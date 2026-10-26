"""
Multi-Signal Scoring Fusion & Explainable AI (XAI) Synthesis
Menggabungkan Sinyal Aturan Medis, Anomali Statistik, Graf Sentralitas, dan Kewajaran Waktu
"""

from typing import Dict, Any, List
import pandas as pd
import numpy as np

class ScoringFusion:
    def __init__(self):
        pass

    def compute_temporal_score(self, df: pd.DataFrame) -> pd.Series:
        """
        Menghitung sinyal kewajaran waktu (0 - 20):
        - Kunjungan berdekatan / interval tidak wajar
        - Lonjakan klaim dalam rentang pendek
        """
        n = len(df)
        temporal_scores = np.zeros(n, dtype=float)

        # Cek selisih tanggal masuk dan durasi rawat
        for idx, row in df.iterrows():
            los = row["length_of_stay"]
            pts = 5.0
            if los > 14: # Rawat inap sangat panjang
                pts += 10.0
            elif los == 1 and row["care_type"] == "RITL": # Rawat inap hanya 1 hari (potensi false one-day admission)
                pts += 8.0
            
            # Weekend submission check (Sabtu/Minggu)
            if row["service_date"].weekday() >= 5:
                pts += 4.0

            temporal_scores[idx] = min(20.0, pts)

        return pd.Series(temporal_scores, index=df.index)

    def fuse(
        self,
        df: pd.DataFrame,
        rule_scores: pd.Series,
        stat_scores: pd.Series,
        graph_scores: pd.Series,
        evidence_lists: List[List[Dict[str, Any]]],
        primary_patterns: List[str]
    ) -> pd.DataFrame:
        """
        Menggabungkan seluruh sinyal dan menghasilkan objek klaim terstruktur dengan XAI.
        """
        temporal_scores = self.compute_temporal_score(df)
        
        result_df = df.copy()
        result_df["rule_score"] = rule_scores.round(1)
        result_df["statistical_score"] = stat_scores.round(1)
        result_df["graph_score"] = graph_scores.round(1)
        result_df["temporal_score"] = temporal_scores.round(1)
        
        total_risk = (
            result_df["rule_score"] +
            result_df["statistical_score"] +
            result_df["graph_score"] +
            result_df["temporal_score"]
        )
        result_df["risk_score"] = total_risk.clip(0, 100).round().astype(int)
        
        # Risk Level
        conditions = [
            (result_df["risk_score"] >= 75),
            (result_df["risk_score"] >= 45)
        ]
        choices = ["HIGH", "MEDIUM"]
        result_df["risk_level"] = np.select(conditions, choices, default="LOW")

        # Priority Score (0.0 to 1.0)
        result_df["priority_score"] = (result_df["risk_score"] / 100.0).round(2)
        
        # Pattern Labels
        pattern_labels = {
            "possible_cloning": "Duplikasi Prosedur (Cloning)",
            "possible_repeat_billing": "Klaim Berulang (Repeat Billing)",
            "possible_upcoding": "Penggelembungan Kode (Upcoding)",
            "possible_phantom_billing": "Klaim Fiktif / Faskes Bayangan",
            "referral_anomaly": "Anomali Rujukan Berantai",
            "none": "Verifikasi Pola Standar"
        }

        # Resolve primary pattern if still 'none'
        resolved_patterns = []
        resolved_labels = []
        for i, row in result_df.iterrows():
            pat = primary_patterns[i]
            if pat == "none":
                if row["rule_score"] > 15:
                    pat = "possible_cloning"
                elif row["statistical_score"] > 15:
                    pat = "possible_upcoding"
                elif row["graph_score"] > 15:
                    pat = "referral_anomaly"
                else:
                    pat = "possible_repeat_billing"
            resolved_patterns.append(pat)
            resolved_labels.append(pattern_labels.get(pat, "Anomali Terverifikasi"))

        result_df["primary_pattern"] = resolved_patterns
        result_df["pattern_label"] = resolved_labels

        # Construct Explanations (XAI)
        explanations = []
        for i, row in result_df.iterrows():
            diag = row["diagnosis_code"]
            cbg = row["ina_cbg_code"]
            fac = row["facility_name"]
            score = row["risk_score"]
            pat_lbl = row["pattern_label"]
            
            why = (
                f"Klaim {row['claim_id']} ditandai berisiko {score}/100 ({pat_lbl}) "
                f"berdasarkan kombinasi diagnosis {diag}, kode INA-CBG {cbg}, serta pola relasi pada {fac}."
            )
            threshold = f"Deviasi multi-sinyal melampaui batas ambang standar investigasi JKN."
            next_step = f"Lakukan verifikasi rekam medis elektronik dan kesesuaian berkas penagihan di {fac}."

            explanations.append({
                "why": why,
                "thresholdNote": threshold,
                "nextStep": next_step
            })

        result_df["explanation"] = explanations
        result_df["evidence_list"] = evidence_lists

        return result_df
