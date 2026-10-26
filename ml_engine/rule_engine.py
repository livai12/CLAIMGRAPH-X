"""
Rule Engine untuk Deteksi Pola Kecurangan & Anomali Klaim BPJS Kesehatan
Mendukung investigasi K-04 Duplikasi Prosedur, Repeat Billing, Upcoding, dan Outlier Biaya
"""

from typing import List, Dict, Any, Tuple
import pandas as pd
import numpy as np

class RuleEngine:
    def __init__(self):
        pass

    def evaluate_claims(self, df: pd.DataFrame) -> Tuple[pd.Series, List[List[Dict[str, Any]]], List[str]]:
        """
        Mengevaluasi setiap klaim terhadap katalog aturan medis & kepatuhan INA-CBG.
        Mengembalikan:
        - rule_scores: skor aturan (0 - 30)
        - evidence_lists: list bukti temuan klinis / aturan per klaim
        - primary_patterns: label pola dominan
        """
        n = len(df)
        rule_scores = np.zeros(n, dtype=float)
        evidence_lists = [[] for _ in range(n)]
        primary_patterns = ["none" for _ in range(n)]

        # 1. Deteksi Pola K-04 (Cloning / Duplikasi Prosedur)
        # Menghitung kombinasi Faskes + Nakes + Tanggal + Diagnosis/Prosedur
        cloning_groups = df.groupby(["facility_id", "practitioner_id", "diagnosis_code", "ina_cbg_code"])
        
        for name, group in cloning_groups:
            # Jika dalam grup yang sama ada >= 3 klaim berbeda untuk pasien berbeda
            unique_patients = group["patient_id"].nunique()
            if len(group) >= 3 and unique_patients >= 2:
                # Periksa rentang waktu (misal dalam rentang 3 hari)
                date_span = (group["service_date"].max() - group["service_date"].min()).days
                if date_span <= 3:
                    pts = min(18, 10 + len(group) * 2)
                    for idx in group.index:
                        rule_scores[idx] += pts
                        evidence_lists[idx].append({
                            "id": f"ev-cl-{idx}",
                            "category": "Aturan",
                            "text": f"Pola K-04 terdeteksi: {len(group)} klaim identik (Diagnosis {name[2]} / {name[3]}) diajukan untuk {unique_patients} pasien dalam rentang {date_span} hari.",
                            "ruleId": "R-CL-01",
                            "strength": "Kuat"
                        })
                        if primary_patterns[idx] == "none":
                            primary_patterns[idx] = "possible_cloning"

        # 2. Deteksi Pola Repeat Billing (Klaim berulang pasien yang sama dalam hitungan hari)
        patient_groups = df.groupby(["patient_id", "facility_id", "diagnosis_code"])
        for name, group in patient_groups:
            if len(group) >= 2:
                sorted_group = group.sort_values("service_date")
                diffs = sorted_group["service_date"].diff().dt.days
                rapid_repeats = diffs[(diffs >= 0) & (diffs <= 4)]
                if len(rapid_repeats) > 0:
                    for idx in group.index:
                        rule_scores[idx] += 16
                        evidence_lists[idx].append({
                            "id": f"ev-rb-{idx}",
                            "category": "Waktu",
                            "text": f"Kunjungan berulang untuk pasien yang sama dan diagnosis {name[2]} terjadi dalam rentang <= 4 hari pada faskes yang sama.",
                            "ruleId": "R-RB-02",
                            "strength": "Kuat"
                        })
                        if primary_patterns[idx] in ["none", "possible_cloning"]:
                            primary_patterns[idx] = "possible_repeat_billing"

        # 3. Deteksi Upcoding Severity Level
        # Cek jika severity_level menyatakan Berat (Severity 3), namun rawat jalan atau biaya tinggi deviasi
        for idx, row in df.iterrows():
            sev_str = str(row["severity_level"]).lower()
            if "berat" in sev_str or "3" in sev_str or "iii" in str(row["ina_cbg_code"]).lower():
                # Jika LOS hanya 1 hari untuk kasus berat rawat inap
                if row["length_of_stay"] <= 1 and row["care_type"] == "RITL":
                    rule_scores[idx] += 14
                    evidence_lists[idx].append({
                        "id": f"ev-uc-{idx}",
                        "category": "Aturan",
                        "text": f"Indikasi Upcoding: Klaim INA-CBG severity tinggi ({row['ina_cbg_code']}) dengan durasi rawat inap hanya {row['length_of_stay']} hari.",
                        "ruleId": "R-UC-03",
                        "strength": "Sedang"
                    })
                    if primary_patterns[idx] == "none":
                        primary_patterns[idx] = "possible_upcoding"

        # 4. Deteksi Deviasi Biaya Tagih vs Verifikasi BPJS
        for idx, row in df.iterrows():
            cost_disc = row["cost_discrepancy"]
            approved = row["claim_amount"]
            if approved > 0 and (cost_disc / approved) > 0.4:
                rule_scores[idx] += 10
                evidence_lists[idx].append({
                    "id": f"ev-cd-{idx}",
                    "category": "Statistik",
                    "text": f"Biaya tagih provider menyimpang Rp{cost_disc:,.0f} (>40%) di atas plafon tarif disetujui BPJS.",
                    "ruleId": "R-CD-04",
                    "strength": "Sedang"
                })

        # Cap max rule score to 30
        capped_scores = np.clip(rule_scores, 0, 30)
        return pd.Series(capped_scores, index=df.index), evidence_lists, primary_patterns
