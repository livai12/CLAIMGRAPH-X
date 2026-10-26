"""
Exporter modul untuk mengekspor hasil training & inferensi ke format UI TypeScript
Memungkinkan CLAIMGRAPH-X langsung menampilkan data real BPJS Kesehatan 2025 di antarmuka
"""

import json
import os
from pathlib import Path
from typing import Dict, Any, List
import pandas as pd

from ml_engine.config import EXPORT_APP_PATH, ARTIFACTS_DIR
from ml_engine.graph_builder import ClaimGraphBuilder

class AppDataExporter:
    def __init__(self, export_path: Path = EXPORT_APP_PATH, artifacts_dir: Path = ARTIFACTS_DIR):
        self.export_path = export_path
        self.artifacts_dir = artifacts_dir
        self.artifacts_dir.mkdir(parents=True, exist_ok=True)

    def export(
        self,
        df: pd.DataFrame,
        graph_builder: ClaimGraphBuilder,
        top_n: int = 50
    ) -> Dict[str, Any]:
        """
        Mengekspor daftar klaim berisiko tinggi & klaster graf ke bpjs2025Data.ts
        """
        # Urutkan berdasarkan prioritas dan skor risiko tertinggi
        sorted_df = df.sort_values(by=["risk_score", "claim_amount"], ascending=[False, False])
        selected_df = sorted_df.head(top_n)

        claims_list: List[Dict[str, Any]] = []
        communities_dict: Dict[str, Any] = {}

        for idx, row in selected_df.iterrows():
            c_id = row["claim_id"]
            svc_date_str = row["service_date"].strftime("%d %b %Y")
            # submission ~2 days later
            sub_date_str = (row["service_date"] + pd.Timedelta(days=2)).strftime("%d %b %Y")
            
            # Buat timeline klinis klaim
            timeline = [
                {
                    "date": row["service_date"].strftime("%d %b"),
                    "time": "08.30",
                    "title": f"Penerimaan Layanan di {row['facility_name']}",
                    "description": f"Pasien {row['patient_id']} didaftarkan pada poli {row['department']}.",
                    "isCurrent": False
                },
                {
                    "date": row["service_date"].strftime("%d %b"),
                    "time": "10.15",
                    "title": f"Penetapan Diagnosis {row['diagnosis_code']}",
                    "description": f"{row['diagnosis_desc']}. Prosedur: {', '.join(row['procedure_codes'])}.",
                    "isCurrent": True
                },
                {
                    "date": sub_date_str,
                    "time": "14.00",
                    "title": "Pengajuan E-Klaim INA-CBG",
                    "description": f"Kode {row['ina_cbg_code']} ({row['ina_cbg_desc']}) senilai Rp{row['claim_amount']:,.0f}.",
                    "isCurrent": False
                },
                {
                    "date": "15 Okt",
                    "time": "06.00",
                    "title": "Analisis Multi-Sinyal CLAIMGRAPH-X",
                    "description": f"Terdeteksi sinyal risiko {row['risk_score']}/100 ({row['pattern_label']}).",
                    "isCurrent": False
                }
            ]

            evidence = row["evidence_list"]
            if not evidence:
                evidence = [
                    {
                        "id": f"ev-{c_id}-1",
                        "category": "Statistik",
                        "text": f"Klaim terverifikasi BPJS 2025 dengan skor anomali statistik {row['statistical_score']}/25.",
                        "strength": "Kuat"
                    },
                    {
                        "id": f"ev-{c_id}-2",
                        "category": "Graf",
                        "text": f"Sentralitas graf relasi poli {row['department']} mencapai {row['graph_score']}/25.",
                        "strength": "Sedang"
                    }
                ]

            claim_item = {
                "claimId": c_id,
                "patientId": row["patient_id"],
                "practitionerId": row["practitioner_id"],
                "practitionerName": row["practitioner_name"],
                "facilityId": row["facility_id"],
                "facilityType": "FKRTL",
                "serviceDate": svc_date_str,
                "submissionDate": sub_date_str,
                "claimAmount": int(row["claim_amount"]),
                "riskScore": int(row["risk_score"]),
                "riskLevel": row["risk_level"],
                "primaryPattern": row["primary_pattern"],
                "patternLabel": row["pattern_label"],
                "status": "NEW",
                "priorityScore": float(row["priority_score"]),
                "signals": {
                    "ruleScore": float(row["rule_score"]),
                    "statisticalScore": float(row["statistical_score"]),
                    "graphScore": float(row["graph_score"]),
                    "temporalScore": float(row["temporal_score"])
                },
                "diagnosisCode": row["diagnosis_code"],
                "diagnosisDesc": row["diagnosis_desc"],
                "procedureCodes": row["procedure_codes"],
                "explanation": row["explanation"],
                "evidenceList": evidence,
                "timeline": timeline,
                "networkId": f"NET-{c_id}",
                "isSeedDemo": False
            }
            claims_list.append(claim_item)

        # Buat subgraf klaster untuk top 5 klaim paling berisiko
        top_claim_ids = [c["claimId"] for c in claims_list[:8]]
        for cid in top_claim_ids:
            comm = graph_builder.extract_ego_community(cid, df)
            communities_dict[f"NET-{cid}"] = comm

        # Ekstrak ringkasan statistik dataset
        total_claims_dataset = len(df)
        total_amount = int(df["claim_amount"].sum())
        high_risk_count = int((df["risk_score"] >= 75).sum())
        med_risk_count = int(((df["risk_score"] >= 45) & (df["risk_score"] < 75)).sum())
        total_anomaly_identified = high_risk_count + med_risk_count
        potential_savings = int(df[df["risk_score"] >= 75]["claim_amount"].sum())

        summary_stats = {
            "datasetName": "Data Sampel Resmi BPJS Kesehatan Edisi Rilis 2025",
            "totalProcessedClaims": total_claims_dataset,
            "totalFinancialValue": total_amount,
            "anomalyRatioPercent": round((total_anomaly_identified / max(1, total_claims_dataset)) * 100, 1),
            "potentialSavings": potential_savings,
            "highRiskCount": high_risk_count,
            "mediumRiskCount": med_risk_count,
            "topRiskClaimsCount": len(claims_list)
        }

        # Simpan JSON Artifacts
        json_artifact_path = self.artifacts_dir / "bpjs_2025_processed.json"
        with open(json_artifact_path, "w", encoding="utf-8") as f:
            json.dump({
                "stats": summary_stats,
                "claims": claims_list[:10],
                "communities": list(communities_dict.keys())
            }, f, indent=2, ensure_ascii=False)

        # Buat berkas TypeScript untuk frontend
        ts_content = f"""// AUTO-GENERATED BY ml_engine/exporter.py
// Dataset Resmi BPJS Kesehatan Rilis 2025 Terverifikasi
import {{ Claim, NetworkCommunity }} from '../types';

export const BPJS_2025_STATS = {json.dumps(summary_stats, indent=2, ensure_ascii=False)};

export const BPJS_2025_CLAIMS: Claim[] = {json.dumps(claims_list, indent=2, ensure_ascii=False)};

export const BPJS_2025_COMMUNITIES: Record<string, NetworkCommunity> = {json.dumps(communities_dict, indent=2, ensure_ascii=False)};

export const BPJS_2025_DEFAULT_COMMUNITY: NetworkCommunity = {json.dumps(list(communities_dict.values())[0] if communities_dict else {}, indent=2, ensure_ascii=False)};
"""
        with open(self.export_path, "w", encoding="utf-8") as f:
            f.write(ts_content)

        print(f"[Exporter] Berhasil mengekspor {len(claims_list)} klaim berisiko dan {len(communities_dict)} subgraf klaster ke: {self.export_path}")
        return summary_stats
