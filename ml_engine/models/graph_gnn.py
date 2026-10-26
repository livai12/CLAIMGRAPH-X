"""
Graph Neural Network (GNN) Engine berbasis PyTorch untuk Deteksi Anomali Graf Klaim JKN
Mengagregasi representasi relasional heterogen antara Peserta, Faskes, dan Prosedur
"""

from typing import Dict, Any, Tuple
import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import pandas as pd
import networkx as nx

class ClaimGNNLayer(nn.Module):
    def __init__(self, in_dim: int, out_dim: int):
        super().__init__()
        self.fc_self = nn.Linear(in_dim, out_dim)
        self.fc_neigh = nn.Linear(in_dim, out_dim)
        self.act = nn.LeakyReLU(0.2)

    def forward(self, x: torch.Tensor, adj_norm: torch.Tensor) -> torch.Tensor:
        # Aggregation: AHW + XW_self
        neigh_agg = torch.spmm(adj_norm, x)
        out = self.fc_self(x) + self.fc_neigh(neigh_agg)
        return self.act(out)

class GraphAnomalyGNN(nn.Module):
    def __init__(self, in_features: int = 16, hidden_dim: int = 32, emb_dim: int = 16):
        super().__init__()
        self.encoder1 = ClaimGNNLayer(in_features, hidden_dim)
        self.encoder2 = ClaimGNNLayer(hidden_dim, emb_dim)
        self.decoder = nn.Sequential(
            nn.Linear(emb_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, in_features)
        )

    def forward(self, x: torch.Tensor, adj_norm: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
        h1 = self.encoder1(x, adj_norm)
        emb = self.encoder2(h1, adj_norm)
        reconstruction = self.decoder(emb)
        return emb, reconstruction

class GNNModelRunner:
    def __init__(self, in_dim: int = 16, hidden_dim: int = 32, emb_dim: int = 16, lr: float = 0.01):
        self.model = GraphAnomalyGNN(in_features=in_dim, hidden_dim=hidden_dim, emb_dim=emb_dim)
        self.optimizer = torch.optim.Adam(self.model.parameters(), lr=lr, weight_decay=1e-5)
        self.in_dim = in_dim

    def train_and_score(self, G: nx.Graph, claim_ids: list, epochs: int = 5) -> pd.Series:
        """
        Melatih GNN Autoencoder pada struktur graf untuk mendeteksi deviasi struktural (anomali klaster).
        """
        node_list = list(G.nodes())
        node2idx = {node: i for i, node in enumerate(node_list)}
        num_nodes = len(node_list)

        # Build Normalized Adjacency Matrix
        adj = nx.adjacency_matrix(G, nodelist=node_list).astype(np.float32)
        deg = np.array(adj.sum(axis=1)).flatten()
        deg_inv_sqrt = np.zeros_like(deg)
        mask = deg > 0
        deg_inv_sqrt[mask] = np.power(deg[mask], -0.5)
        d_mat = np.diag(deg_inv_sqrt)
        adj_norm_np = d_mat @ adj.toarray() @ d_mat

        # Node initial features (degree + random seed projection)
        torch.manual_seed(42)
        node_features = torch.randn(num_nodes, self.in_dim)
        for i, node in enumerate(node_list):
            node_features[i, 0] = float(G.degree(node))

        adj_tensor = torch.tensor(adj_norm_np, dtype=torch.float32)
        
        # Training loop
        self.model.train()
        for epoch in range(epochs):
            self.optimizer.zero_grad()
            emb, recon = self.model(node_features, adj_tensor)
            loss = F.mse_loss(recon, node_features)
            loss.backward()
            self.optimizer.step()

        # Inference: structural reconstruction error as GNN anomaly score
        self.model.eval()
        with torch.no_grad():
            emb, recon = self.model(node_features, adj_tensor)
            errors = torch.sum((recon - node_features) ** 2, dim=1).numpy()

        claim_scores = []
        for c_id in claim_ids:
            if c_id in node2idx:
                idx = node2idx[c_id]
                claim_scores.append(errors[idx])
            else:
                claim_scores.append(0.0)

        claim_scores = np.array(claim_scores)
        # Normalize to 0 - 25
        min_err, max_err = claim_scores.min(), claim_scores.max()
        norm_scores = (claim_scores - min_err) / max(1e-5, (max_err - min_err))
        final_scores = np.clip(norm_scores * 25.0, 0, 25.0)

        return pd.Series(final_scores, index=claim_ids)
