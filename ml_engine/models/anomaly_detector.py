"""
Modul Model Machine Learning: Deteksi Anomali Statistik (Isolation Forest)
"""

from typing import Tuple
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

class StatisticalAnomalyDetector:
    def __init__(self, contamination: float = 0.08, random_state: int = 42):
        self.model = IsolationForest(
            contamination=contamination,
            random_state=random_state,
            n_estimators=100
        )
        self.scaler = StandardScaler()

    def fit_predict(self, df: pd.DataFrame, graph_features: pd.DataFrame) -> Tuple[pd.Series, np.ndarray]:
        """
        Melatih Isolation Forest pada fitur finansial, durasi rawat, dan sentralitas graf.
        Mengembalikan skor anomali statistik ternormalisasi (0 - 25) dan label outlier.
        """
        feature_matrix = pd.DataFrame(index=df.index)
        feature_matrix["claim_amount"] = np.log1p(df["claim_amount"])
        feature_matrix["cost_discrepancy"] = np.log1p(np.maximum(0, df["cost_discrepancy"]))
        feature_matrix["length_of_stay"] = df["length_of_stay"]
        feature_matrix["patient_degree"] = graph_features["patient_degree"]
        feature_matrix["nakes_degree"] = graph_features["nakes_degree"]

        # Scale features
        X = self.scaler.fit_transform(feature_matrix.fillna(0))
        
        # Train model
        self.model.fit(X)
        
        # In IsolationForest, lower decision function means more abnormal
        decision_scores = self.model.decision_function(X)
        predictions = self.model.predict(X) # -1 is outlier, 1 is normal
        
        # Invert and normalize to 0 - 25
        # decision_scores typically range from -0.3 to 0.3
        min_s, max_s = decision_scores.min(), decision_scores.max()
        norm_scores = (max_s - decision_scores) / max(1e-5, (max_s - min_s))
        statistical_scores = np.clip(norm_scores * 25.0, 0, 25.0)

        return pd.Series(statistical_scores, index=df.index), predictions
