"""
Command Line Interface (CLI) untuk CLAIMGRAPH-X ML & GNN Pipeline
Contoh Penggunaan:
  py ml_engine/main.py --subset tb --sample-size 3000 --epochs 5
  py ml_engine/main.py --subset dm --sample-size 5000
  py ml_engine/main.py --subset reguler --sample-size 10000
"""

import argparse
import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from ml_engine.trainer import PipelineTrainer
from ml_engine.config import SUBSET_PATHS

def main():
    parser = argparse.ArgumentParser(
        description="CLAIMGRAPH-X: Engine Training & Investigasi Risiko Klaim BPJS Kesehatan 2025"
    )
    parser.add_argument(
        "--subset",
        type=str,
        default="tb",
        choices=list(SUBSET_PATHS.keys()),
        help=f"Pilihan subset data rilis 2025: {', '.join(SUBSET_PATHS.keys())}"
    )
    parser.add_argument(
        "--sample-size",
        type=int,
        default=3000,
        help="Jumlah baris sampel untuk training/ekstraksi (default: 3000)"
    )
    parser.add_argument(
        "--epochs",
        type=int,
        default=5,
        help="Jumlah epochs pelatihan Graph Neural Network (default: 5)"
    )
    parser.add_argument(
        "--no-export",
        action="store_true",
        help="Lewati ekspor data ke aplikasi frontend"
    )

    args = parser.parse_args()
    
    trainer = PipelineTrainer(
        subset=args.subset,
        sample_size=args.sample_size,
        gnn_epochs=args.epochs
    )
    trainer.run(export_to_app=not args.no_export)

if __name__ == "__main__":
    main()
