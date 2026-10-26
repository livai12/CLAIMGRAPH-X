"""
Data Loader & Preprocessor untuk Dataset BPJS Kesehatan 2025 (.dta)
Kepatuhan UU No. 27 Tahun 2022 (UU PDP) dengan Penyamaran Identitas Kriptografis
"""

import hashlib
import re
from pathlib import Path
from typing import Optional, Dict, Any
import pandas as pd
import numpy as np

from ml_engine.config import SUBSET_PATHS, FIELD_MAPPINGS, PROJECT_ROOT

SALT = "CLAIMGRAPH_BPJS_2025_KEY"

def mask_identifier(val: Any, prefix: str = "PST-") -> str:
    """Mask sensitive IDs using deterministic SHA-256 prefixing (UU PDP compliance)."""
    if pd.isna(val) or val == "":
        return f"{prefix}UNKNOWN"
    str_val = f"{SALT}_{str(val)}"
    digest = hashlib.sha256(str_val.encode("utf-8")).hexdigest()[:6].upper()
    return f"{prefix}{digest}"

def clean_procedure(proc_str: Any) -> list:
    """Extract procedure ICD-9-CM codes from text (e.g. '9059 - Other microscopic...')."""
    if pd.isna(proc_str) or not str(proc_str).strip():
        return ["PRO-NON-SPESIFIK"]
    val = str(proc_str).strip()
    match = re.match(r"^(\d{2,4})", val)
    if match:
        code = match.group(1)
        if len(code) == 4:
            code = f"{code[:2]}.{code[2:]}"
        return [code]
    return [val[:15]]

class BPJSDataLoader:
    def __init__(self, subset_name: str = "tb"):
        self.subset_name = subset_name.lower()
        if self.subset_name not in SUBSET_PATHS:
            raise ValueError(f"Subset '{subset_name}' tidak dikenal. Pilih dari: {list(SUBSET_PATHS.keys())}")
        self.file_path = SUBSET_PATHS[self.subset_name]
        if not self.file_path.exists():
            raise FileNotFoundError(f"Berkas dataset tidak ditemukan di: {self.file_path}")

    def load_data(self, sample_size: Optional[int] = 5000) -> pd.DataFrame:
        """
        Membaca dataset Stata (.dta) secara efisien dengan batas baris/sample.
        """
        print(f"[DataLoader] Membaca dataset '{self.subset_name}' dari {self.file_path.name}...")
        
        # Read using iterator to preserve memory
        reader = pd.read_stata(self.file_path, iterator=True)
        if sample_size and sample_size > 0:
            raw_df = reader.read(sample_size)
        else:
            raw_df = reader.read()
            
        print(f"[DataLoader] Berhasil memuat {len(raw_df)} baris mentah. Memulai standardisasi data...")
        return self._preprocess(raw_df)

    def _preprocess(self, df: pd.DataFrame) -> pd.DataFrame:
        clean_df = pd.DataFrame()
        
        # Mapping Kolom Utama
        clean_df["raw_claim_id"] = df[FIELD_MAPPINGS["claim_id"]].astype(str)
        clean_df["claim_id"] = clean_df["raw_claim_id"].apply(
            lambda x: f"C-{x[-6:]}" if len(x) >= 6 else f"C-{x.zfill(6)}"
        )
        
        clean_df["raw_patient_id"] = df[FIELD_MAPPINGS["patient_id"]]
        clean_df["patient_id"] = clean_df["raw_patient_id"].apply(
            lambda x: mask_identifier(x, prefix="PST-")
        )
        
        # Faskes & Kota
        city_col = df[FIELD_MAPPINGS["city"]].fillna("KOTA_UNKNOWN").astype(str)
        f_type = df[FIELD_MAPPINGS["facility_class"]].fillna("RS Type C").astype(str)
        clean_df["facility_name"] = f_type + " " + city_col
        clean_df["facility_id"] = clean_df["facility_name"].apply(
            lambda x: mask_identifier(x, prefix="FKRTL-")
        )
        clean_df["facility_type"] = "FKRTL"
        clean_df["city"] = city_col
        clean_df["province"] = df[FIELD_MAPPINGS["province"]].fillna("NASIONAL").astype(str)
        
        # Nakes / Dokter (BPJS anonymized to Poli/Spesialisasi, dipetakan ke NAKES-xxx)
        dept_col = df[FIELD_MAPPINGS["department"]].fillna("UMUM").astype(str)
        clean_df["department"] = dept_col
        clean_df["practitioner_id"] = (clean_df["facility_id"] + "_" + dept_col).apply(
            lambda x: mask_identifier(x, prefix="NAKES-")
        )
        
        dept_name_map = {
            "INT": "dr. Sp.PD (Penyakit Dalam)",
            "PAR": "dr. Sp.P (Paru)",
            "KFR": "dr. Sp.KFR (Rehabilitasi Medik)",
            "ANA": "dr. Sp.A (Anak)",
            "BED": "dr. Sp.B (Bedah)",
            "JAN": "dr. Sp.JP (Jantung)",
            "SAR": "dr. Sp.S (Saraf)",
            "OBS": "dr. Sp.OG (Kebidanan)",
            "RAD": "dr. Sp.Rad (Radiologi)",
            "LAB": "dr. Sp.PK (Patologi Klinik)"
        }
        clean_df["practitioner_name"] = dept_col.apply(
            lambda d: dept_name_map.get(str(d).strip().upper(), f"dr. Spesialis {d}")
        )

        # Dates & Length of Stay
        clean_df["service_date"] = pd.to_datetime(df[FIELD_MAPPINGS["service_date"]], errors="coerce")
        clean_df["discharge_date"] = pd.to_datetime(df[FIELD_MAPPINGS["discharge_date"]], errors="coerce")
        # default to service_date if discharge is null
        clean_df["discharge_date"] = clean_df["discharge_date"].fillna(clean_df["service_date"])
        clean_df["service_date"] = clean_df["service_date"].fillna(pd.Timestamp("2024-01-01"))
        
        los = (clean_df["discharge_date"] - clean_df["service_date"]).dt.days
        clean_df["length_of_stay"] = los.clip(lower=1)
        
        # Diagnosis & INA-CBG
        clean_df["diagnosis_code"] = df[FIELD_MAPPINGS["diagnosis_code"]].fillna("R69").astype(str).str.strip()
        clean_df["diagnosis_desc"] = df[FIELD_MAPPINGS["diagnosis_desc"]].fillna("Diagnosis Terverifikasi").astype(str).str.strip()
        
        clean_df["ina_cbg_code"] = df[FIELD_MAPPINGS["ina_cbg_code"]].fillna("NON-CBG").astype(str).str.strip()
        clean_df["ina_cbg_desc"] = df[FIELD_MAPPINGS["ina_cbg_desc"]].fillna("Layanan Kasus Umum").astype(str).str.strip()
        clean_df["severity_level"] = df[FIELD_MAPPINGS["severity_level"]].fillna("Rawat Jalan").astype(str)

        # Procedures
        clean_df["raw_procedures"] = df[FIELD_MAPPINGS["procedure_desc"]]
        clean_df["procedure_codes"] = clean_df["raw_procedures"].apply(clean_procedure)

        # Financials
        clean_df["billed_amount"] = pd.to_numeric(df[FIELD_MAPPINGS["billed_amount"]], errors="coerce").fillna(0).astype(int)
        clean_df["claim_amount"] = pd.to_numeric(df[FIELD_MAPPINGS["approved_amount"]], errors="coerce").fillna(0).astype(int)
        
        # If approved amount is 0, fall back to billed
        clean_df["claim_amount"] = np.where(clean_df["claim_amount"] > 0, clean_df["claim_amount"], clean_df["billed_amount"])
        # ensure min reasonable amount
        clean_df["claim_amount"] = np.where(clean_df["claim_amount"] > 0, clean_df["claim_amount"], 150000)
        
        clean_df["cost_discrepancy"] = clean_df["billed_amount"] - clean_df["claim_amount"]
        clean_df["care_type"] = df[FIELD_MAPPINGS["care_type"]].fillna("RJTL").astype(str)

        print(f"[DataLoader] Standardisasi selesai: {len(clean_df)} klaim, {clean_df['patient_id'].nunique()} peserta unik, {clean_df['facility_id'].nunique()} faskes.")
        return clean_df
