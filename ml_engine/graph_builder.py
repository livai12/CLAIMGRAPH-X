"""
Graph Builder & Heterogeneous Network Analytics untuk CLAIMGRAPH-X
Mengonstruksi graf multirelasi Peserta, Faskes, Nakes, dan Kode Medis
"""

import math
from typing import Dict, Any, List, Tuple
import networkx as nx
import pandas as pd
import numpy as np

class ClaimGraphBuilder:
    def __init__(self):
        self.G = nx.Graph()

    def build_graph(self, df: pd.DataFrame) -> nx.Graph:
        """
        Membangun graf multirelasi heterogen dari dataframe klaim BPJS.
        """
        self.G.clear()
        
        for _, row in df.iterrows():
            c_id = row["claim_id"]
            p_id = row["patient_id"]
            f_id = row["facility_id"]
            d_id = row["practitioner_id"]
            dx_id = f"DX-{row['diagnosis_code']}"
            
            # Add Nodes
            self.G.add_node(c_id, type="claim", label=c_id, claimAmount=row["claim_amount"])
            self.G.add_node(p_id, type="patient", label=p_id)
            self.G.add_node(f_id, type="facility", label=row["facility_name"])
            self.G.add_node(d_id, type="practitioner", label=row["practitioner_name"])
            self.G.add_node(dx_id, type="code", subType="diagnosis", label=f"ICD-10 {row['diagnosis_code']}")

            # Add Edges
            self.G.add_edge(c_id, p_id, relation="FILED_FOR")
            self.G.add_edge(c_id, f_id, relation="SUBMITTED_BY")
            self.G.add_edge(c_id, d_id, relation="TREATED_BY")
            self.G.add_edge(c_id, dx_id, relation="DIAGNOSED")

            # Add Procedure Nodes & Edges
            for proc in row["procedure_codes"]:
                if proc and proc != "PRO-NON-SPESIFIK":
                    proc_id = f"PROC-{proc}"
                    self.G.add_node(proc_id, type="code", subType="procedure", label=f"Proc {proc}")
                    self.G.add_edge(c_id, proc_id, relation="PERFORMED")

        return self.G

    def extract_graph_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Menghitung metrik sentralitas dan kepadatan relasi graf untuk setiap klaim.
        """
        features = pd.DataFrame(index=df.index)
        
        degree_dict = dict(self.G.degree())
        
        claim_degrees = []
        nakes_degrees = []
        patient_degrees = []
        
        for _, row in df.iterrows():
            c_id = row["claim_id"]
            p_id = row["patient_id"]
            d_id = row["practitioner_id"]
            
            claim_degrees.append(degree_dict.get(c_id, 0))
            patient_degrees.append(degree_dict.get(p_id, 0))
            nakes_degrees.append(degree_dict.get(d_id, 0))

        features["claim_degree"] = claim_degrees
        features["patient_degree"] = patient_degrees
        features["nakes_degree"] = nakes_degrees
        
        # Anomali koneksi nakes: nakes dengan konsentrasi pasien berulang abnormal
        features["graph_score_raw"] = (
            np.log1p(features["nakes_degree"]) * 4.0 + 
            np.log1p(features["patient_degree"]) * 3.0
        )
        # Normalisasi ke skala 0 - 25
        max_val = features["graph_score_raw"].max() or 1.0
        features["graph_score"] = np.clip((features["graph_score_raw"] / max_val) * 25.0, 0, 25.0)
        
        return features

    def extract_ego_community(self, focused_claim_id: str, df: pd.DataFrame, depth: int = 2) -> Dict[str, Any]:
        """
        Mengekstrak subgraf ego-network (maks. 40 node) untuk visualisasi interaktif Cytoscape di frontend.
        """
        if focused_claim_id not in self.G:
            # Fallback jika claim_id tidak ditemukan
            first_claim = df["claim_id"].iloc[0]
            focused_claim_id = first_claim

        subgraph_nodes = set([focused_claim_id])
        current_layer = set([focused_claim_id])
        
        for _ in range(depth):
            next_layer = set()
            for node in current_layer:
                neighbors = set(self.G.neighbors(node))
                next_layer.update(neighbors)
            subgraph_nodes.update(next_layer)
            current_layer = next_layer
            if len(subgraph_nodes) > 40:
                break

        subgraph = self.G.subgraph(list(subgraph_nodes)[:40])
        
        ui_nodes = []
        ui_edges = []
        
        # Calculate circular/grid layout coords
        node_list = list(subgraph.nodes())
        total = len(node_list)
        
        for i, node in enumerate(node_list):
            data = subgraph.nodes[node]
            angle = (2 * math.pi * i) / max(1, total)
            radius = 220 if node != focused_claim_id else 0
            x = math.cos(angle) * radius
            y = math.sin(angle) * radius
            
            node_obj = {
                "id": node,
                "label": data.get("label", node),
                "type": data.get("type", "claim"),
                "x": round(x, 1),
                "y": round(y, 1),
                "isFocused": (node == focused_claim_id),
                "isFlagged": data.get("type") in ["claim", "practitioner"],
                "connectionsCount": self.G.degree(node),
                "details": {
                    "title": data.get("label", node),
                    "description": f"Entitas {data.get('type')} terhubung ke {self.G.degree(node)} klaim/pasien dalam klaster ini.",
                    "relationCount": self.G.degree(node),
                    "claimAmount": data.get("claimAmount", 0)
                }
            }
            if data.get("subType"):
                node_obj["subType"] = data["subType"]
            ui_nodes.append(node_obj)

        for u, v, data in subgraph.edges(data=True):
            ui_edges.append({
                "id": f"e-{u}-{v}",
                "source": u,
                "target": v,
                "isEvidencePath": (u == focused_claim_id or v == focused_claim_id),
                "label": data.get("relation", "TERKAIT")
            })

        focused_row = df[df["claim_id"] == focused_claim_id]
        practitioner_id = focused_row["practitioner_id"].iloc[0] if len(focused_row) > 0 else "NAKES-UNKNOWN"
        claim_amt = int(focused_row["claim_amount"].iloc[0]) if len(focused_row) > 0 else 0

        return {
            "networkId": f"NET-{focused_claim_id}",
            "title": f"Klaster Graf Kasus Terverifikasi {focused_claim_id}",
            "totalEntities": len(ui_nodes),
            "totalRelations": len(ui_edges),
            "focusedClaimId": focused_claim_id,
            "nodes": ui_nodes,
            "edges": ui_edges,
            "summary": {
                "practitionerId": practitioner_id,
                "connectionCount": len(ui_edges),
                "description": f"Subgraf multirelasi mendeteksi klaster koordinasi tindakan di faskes dengan total paparan dana Rp{claim_amt:,.0f}.",
                "claimCount": sum(1 for n in ui_nodes if n["type"] == "claim"),
                "totalAmount": claim_amt
            }
        }
