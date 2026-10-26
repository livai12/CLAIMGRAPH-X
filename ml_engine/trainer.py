"""
Pipeline Trainer & Inference Engine untuk CLAIMGRAPH-X
Menjalankan siklus lengkap Ingestion -> Graf -> Rule Engine -> Isolation Forest -> GNN -> Fusion -> Export
"""

import time
from typing import Dict, Any, Optional
import pandas as pd

from ml_engine.data_loader import BPJSDataLoader
from ml_engine.rule_engine import RuleEngine
from ml_engine.graph_builder import ClaimGraphBuilder
from ml_engine.models.anomaly_detector import StatisticalAnomalyDetector
from ml_engine.models.graph_gnn import GNNModelRunner
from ml_engine.models.scoring_fusion import ScoringFusion
from ml_engine.exporter import AppDataExporter

class PipelineTrainer:
    def __init__(self, subset: str = "tb", sample_size: int = 3000, gnn_epochs: int = 5):
        self.subset = subset
        self.sample_size = sample_size
        self.gnn_epochs = gnn_epochs
        
        self.loader = BPJSDataLoader(subset_name=subset)
        self.rule_engine = RuleEngine()
        self.graph_builder = ClaimGraphBuilder()
        self.anomaly_detector = StatisticalAnomalyDetector()
        self.gnn_runner = GNNModelRunner()
        self.fusion = ScoringFusion()
        self.exporter = AppDataExporter()

    def run(self, export_to_app: bool = True) -> Dict[str, Any]:
        start_time = time.time()
        print("=" * 70)
        print("  CLAIMGRAPH-X: PIPELINE TRAINING & DETEKSI RISIKO DATASET BPJS 2025")
        print("=" * 70)
        print(f"Target Subset   : {self.subset.upper()}")
        print(f"Batas Sampel    : {self.sample_size:,} baris klaim")
        print(f"GNN Epochs      : {self.gnn_epochs}")
        print("-" * 70)

        # 1. Ingestion
        t0 = time.time()
        df = self.loader.load_data(sample_size=self.sample_size)
        print(f"[1/6] Ingestion & Standarisasi selesai dalam {time.time() - t0:.2f}s")

        # 2. Rule Engine
        t0 = time.time()
        rule_scores, evidence_lists, primary_patterns = self.rule_engine.evaluate_claims(df)
        print(f"[2/6] Rule Engine selesai dalam {time.time() - t0:.2f}s (Rata-rata Skor: {rule_scores.mean():.1f})")

        # 3. Heterogeneous Graph Building
        t0 = time.time()
        G = self.graph_builder.build_graph(df)
        graph_features = self.graph_builder.extract_graph_features(df)
        print(f"[3/6] Graf selesai dibangun dalam {time.time() - t0:.2f}s ({G.number_of_nodes():,} node, {G.number_of_edges():,} edge)")

        # 4. Statistical Anomaly Detection (Isolation Forest)
        t0 = time.time()
        stat_scores, outlier_labels = self.anomaly_detector.fit_predict(df, graph_features)
        outlier_count = (outlier_labels == -1).sum()
        print(f"[4/6] Isolation Forest selesai dalam {time.time() - t0:.2f}s ({outlier_count} outlier teridentifikasi)")

        # 5. Graph Neural Network (PyTorch)
        t0 = time.time()
        print(f"[5/6] Melatih PyTorch GNN Autoencoder ({self.gnn_epochs} epochs)...")
        gnn_scores = self.gnn_runner.train_and_score(G, df["claim_id"].tolist(), epochs=self.gnn_epochs)
        # Gabungkan skor topologi graf & deviasi GNN
        combined_graph_scores = (graph_features["graph_score"] * 0.6 + gnn_scores.values * 0.4).clip(0, 25.0)
        print(f"      GNN training selesai dalam {time.time() - t0:.2f}s")

        # 6. Scoring Fusion & XAI
        t0 = time.time()
        scored_df = self.fusion.fuse(
            df=df,
            rule_scores=rule_scores,
            stat_scores=stat_scores,
            graph_scores=combined_graph_scores,
            evidence_lists=evidence_lists,
            primary_patterns=primary_patterns
        )
        print(f"[6/6] Multi-Signal Scoring Fusion selesai dalam {time.time() - t0:.2f}s")

        # Export ke Frontend
        export_stats = {}
        if export_to_app:
            print("[Export] Mengekspor hasil inferensi ke aplikasi frontend (claimgraph-app)...")
            export_stats = self.exporter.export(scored_df, self.graph_builder, top_n=50)

        total_time = time.time() - start_time
        print("=" * 70)
        print(f" PIPELINE SELESAI DALAM {total_time:.2f} DETIK")
        print("=" * 70)
        print(f"Total Klaim Diproses : {len(scored_df):,}")
        print(f"Klaim Risiko Tinggi  : {(scored_df['risk_score'] >= 75).sum():,} kasus")
        print(f"Klaim Risiko Sedang  : {((scored_df['risk_score'] >= 45) & (scored_df['risk_score'] < 75)).sum():,} kasus")
        print(f"Potensi Fraud/Anomali: Rp{scored_df[scored_df['risk_score'] >= 75]['claim_amount'].sum():,.0f}")
        print("=" * 70)

        return {
            "total_time": total_time,
            "df": scored_df,
            "export_stats": export_stats
        }
