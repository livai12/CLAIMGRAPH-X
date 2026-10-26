"""
Konfigurasi Pipeline Machine Learning & Graph Neural Network CLAIMGRAPH-X
Dataset Rilis Resmi BPJS Kesehatan 2025
"""

import os
from pathlib import Path

# Base Paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATASET_ROOT = PROJECT_ROOT / "Dataset" / "2025"
EXPORT_APP_PATH = PROJECT_ROOT / "claimgraph-app" / "src" / "data" / "bpjs2025Data.ts"
ARTIFACTS_DIR = PROJECT_ROOT / "ml_engine" / "artifacts"

# Dataset Subset Paths
SUBSET_PATHS = {
    "tb": DATASET_ROOT / "Data Sampel Kontekstual TB Edisi 2025" / "data" / "TB2024_fkrtl.dta",
    "dm": DATASET_ROOT / "Data Sampel Kontekstual DM Edisi 2025" / "data" / "DM2024_fkrtl.dta",
    "covid": DATASET_ROOT / "Data Sampel Kontekstual COVID Edisi 2025" / "data" / "COV20152024_fkrtl.dta",
    "kia_anak": DATASET_ROOT / "Data Sampel Kontekstual KIA Edisi 2025 - Subset Anak" / "data" / "KIA2024anak_fkrtl.dta",
    "kia_ibu": DATASET_ROOT / "Data Sampel Kontekstual KIA Edisi 2025 - Subset Ibu" / "data" / "KIA2024ibu_fkrtl.dta",
    "mental": DATASET_ROOT / "Data Sampel Kontekstual Kesehatan Mental Edisi 2025" / "data" / "KM2024_fkrtl.dta",
    "reguler": DATASET_ROOT / "Data Sampel Reguler Edisi 2025" / "data" / "202403_fkrtl.dta"
}

# BPJS Field Mappings
FIELD_MAPPINGS = {
    "patient_id": "PSTV01",
    "family_id": "PSTV02",
    "referral_id": "FKP02",
    "claim_id": "FKL02",
    "service_date": "FKL03",
    "discharge_date": "FKL04",
    "province": "FKL05",
    "city": "FKL06",
    "facility_ownership": "FKL07",
    "facility_type": "FKL08",
    "facility_class": "FKL09",
    "care_type": "FKL10",           # RJTL / RITL
    "department": "FKL11",          # Poli FKRTL (INT, PAR, KFR, etc.)
    "participant_segment": "FKL12",
    "care_class": "FKL13",
    "discharge_status": "FKL14",
    "diagnosis_code": "FKL16",      # ICD-10 Diagnosis Masuk
    "diagnosis_desc": "FKL16A",
    "primary_dx_code": "FKL18",     # ICD-10 Diagnosis Primer
    "primary_dx_desc": "FKL18A",
    "ina_cbg_code": "FKL19",        # Kode INA-CBG
    "ina_cbg_desc": "FKL19A",       # Deskripsi INA-CBG
    "severity_level": "FKL23",      # Keparahan INA-CBG
    "procedure_desc": "FKL30",      # ICD-9-CM Prosedur
    "billed_amount": "FKL47",       # Biaya Tagih oleh Faskes
    "approved_amount": "FKL48"      # Biaya Verifikasi Disetujui BPJS
}

# Scoring Weights (Total 100)
SCORE_WEIGHTS = {
    "rule_max": 30,
    "statistical_max": 25,
    "graph_max": 25,
    "temporal_max": 20
}

# Detection Thresholds
THRESHOLDS = {
    "high_risk": 75,
    "medium_risk": 45,
    "cloning_similarity_ratio": 0.85,
    "repeat_billing_days": 5,
    "cost_discrepancy_ratio": 0.30
}
