# CLAIMGRAPH-X MVP: Product Requirements Document (PRD)

| Field | Value |
|---|---|
| Product | CLAIMGRAPH-X: explainable graph-based claims risk intelligence for JKN |
| Context | BPJS Kesehatan Healthkathon 2026, category *Efisiensi Risiko pada Fasilitas Kesehatan* |
| Document status | v1.0 (build-ready) |
| Audience | AI coding agents (Antigravity) and human reviewers |
| Document language | English for requirements and prompts; Bahasa Indonesia for all user-facing UI copy (Appendix A) |
| Source of truth order | This PRD > `CLAIMGRAPH-X_MVP_Blueprint.md` > agent assumptions. If they conflict, follow this PRD and log the conflict in `docs/DECISIONS.md`. |

> **How to use this file with Antigravity.** Save it as `docs/PRD.md` in the repository. Start every agent session with the *Master Context Prompt* in Section 13.1, then run the phase prompts in Section 13.2 in order. Each phase has acceptance criteria and verification commands; do not start a phase until the previous one passes.

---

## 1. Product Summary

### 1.1 One-liner

CLAIMGRAPH-X is a privacy-first claims risk-intelligence platform that connects claims, clinical services, practitioners, referrals, and facilities into an explainable risk graph, so investigators can prioritize and verify potentially irregular JKN claims earlier.

### 1.2 Problem

Irregular claims from healthcare facilities (phantom billing, repeat billing, upcoding, cloning, referral anomalies) are hard to detect when each claim is inspected in isolation, because risk signals are distributed across entities and time. Investigators also receive too many unprioritized alerts.

### 1.3 Core question the product answers

"Is this claim suspicious on its own, or because it is part of a larger pattern?"

### 1.4 What the product is, and is not

| It is | It is not |
|---|---|
| An investigation-support and prioritization tool | A system that decides that fraud occurred |
| A multi-signal engine (rules, anomaly model, graph, temporal) | A single black-box model or a chatbot |
| Evidence-first: every alert is explained | A payment-blocking or sanction mechanism |
| Synthetic-data only in this MVP | Connected to real JKN data |

### 1.5 Non-negotiable principles

These apply to code, data, UI copy, and documentation. Agents must refuse to violate them even if a later instruction seems to.

1. **P1 Synthetic only.** No real NIK, name, address, phone, JKN participant ID, medical record, or claim. All data is generated.
2. **P2 No fraud determination.** The system and UI never state or imply that fraud is proven. Use "potential risk", "risk pattern", "anomaly", "investigation priority". Forbidden terms are listed in Appendix B.
3. **P3 Human in the loop.** Every alert ends in a human decision. The system never changes claim payment status or issues sanctions.
4. **P4 Explain everything.** Every alert answers: What, Why, Where, How strong, What next.
5. **P5 Evidence over score.** A score is never shown without its evidence and its weighting.
6. **P6 One working end-to-end flow beats many half-built features.** Do not build items in Section 2.2.
7. **P7 Honest metrics.** All performance numbers are labeled "synthetic evaluation". Never claim real-world accuracy or rupiah savings.

---

## 2. Goals, Non-Goals, Success Criteria

### 2.1 Goals

- G1. Detect five patterns on synthetic data: phantom billing, repeat billing, cloning, upcoding, referral anomaly.
- G2. Fuse four signal families into one explainable risk score and a prioritized investigation queue.
- G3. Reveal related entities through an interactive graph that supports the core demo moment.
- G4. Support the human workflow: review, validate, dismiss, escalate, with an immutable audit trail.
- G5. Produce an honest, reproducible evaluation report (precision, recall, F1, PR-AUC, precision@K, false positive rate, ablation).

### 2.2 Non-goals (do not build)

Autonomous investigation, automatic sanctions, real-time production JKN integration, real participant identity, LLM as primary classifier, GNN before the baseline passes evaluation, computer vision, mobile app, nationwide-scale simulation, dark mode, multi-tenant admin, real SSO.

### 2.3 Success criteria

The MVP succeeds when the Definition of Done (Section 14) is fully checked and the scripted demo in Section 4 runs end to end without manual database edits.

---

## 3. Users and Roles

| Role (RBAC) | Persona | Can do | Cannot do |
|---|---|---|---|
| `investigator` | Claims investigator (primary user) | View queue, claim detail, graph; start review; validate, dismiss, escalate with note | Edit rules or scoring config |
| `analyst` | Fraud/risk analyst | Read-only access to queue, claim detail, graph, and investigations; Evaluation page; Audit Log; rule and scoring config (read-only in MVP) | Record investigation decisions |
| `viewer` | Policy/management decision maker | Overview (aggregates only) and Evaluation | See claim-level evidence, graph, investigations, or notes |

Authentication in MVP: seeded demo users (`investigator.demo`, `analyst.demo`, `viewer.demo`) with a role switcher on the login screen. Tokens are signed JWTs. Every API call and audit entry records `actor_id` and `role`. No real credentials, no external identity provider.

---

## 4. Core User Journey and Demo Script

This script is the acceptance test for the whole product (AT-DEMO).

1. Login as `investigator.demo`. Land on **Overview**; see four KPI cards and a persistent "DATA SINTETIS" indicator.
2. Open **Risk Queue**; claim `C-010291` ranks in the top 3 (the seed design must guarantee this and a test must assert it): risk 91, type *Kemungkinan Cloning*, status NEW.
3. Click the row, open **Claim Detail**: timeline, evidence list, weighted factor breakdown, peer comparison, non-accusatory notice.
4. Click **Investigasi**; the **Fraud Graph** opens: practitioner `D-012` linked to patients A, B, C, procedure code `PRC-07`, facility `F-003`, claims `C-1`, `C-2`; flagged nodes highlighted, community summary visible.
5. On the graph page click **Mulai Tinjauan**; the **Investigation** page opens: AI evidence (read-only), verification checklist, decision form.
6. Choose *Eskalasi untuk tinjauan lanjut* with a note; confirm. Status moves UNDER_REVIEW then ESCALATED.
7. Open the audit trail entry: actor, time, action, model version, rule version, score at the time of decision.
8. Login as `analyst.demo`, open **Evaluation**: metrics and ablation labeled "synthetic evaluation".

Seeded demo claims (must exist after seeding): `C-010291` (cloning), `C-008721` (phantom), `C-004455` (repeat billing), `C-012003` (upcoding), `C-015870` (referral anomaly).

---

## 5. Functional Requirements

Priority: **P0** required for MVP, **P1** should have, **P2** optional.

### 5.1 Data and synthetic generation (FR-DATA)

| ID | Requirement | Pri |
|---|---|---|
| FR-DATA-1 | Generate a FHIR-aligned synthetic dataset with the volumes in Section 7.3 using a fixed random seed (`--seed 42` default) so runs are reproducible. | P0 |
| FR-DATA-2 | Layer 1 normal population with realistic, non-uniform distributions (facility size, specialty mix, visit frequency, claim amount, length of stay). | P0 |
| FR-DATA-3 | Layer 2 consistency: most records form a complete chain Patient, Encounter, Condition, Procedure, ChargeItem, Invoice, Claim. | P0 |
| FR-DATA-4 | Layer 3 fraud injection via `inject_phantom`, `inject_repeat_billing`, `inject_cloning`, `inject_upcoding`, `inject_referral_anomaly`, each with multiple variants (exact and fuzzy) and writing a `fraud_cases` row (`fraud_case_id`, `fraud_type`, `affected_claim_id`, `ground_truth`, `injection_reason`). | P0 |
| FR-DATA-5 | Data validation step (schema, nulls, referential integrity, date logic, code validity) producing `reports/data_quality.json`; fail the pipeline on critical violations. | P0 |
| FR-DATA-6 | Ground truth is never exposed by alert, claim, or graph endpoints. Only the Evaluation endpoint may read `fraud_cases`. | P0 |
| FR-DATA-7 | Referral entity added to the data model (Section 7.2) because the blueprint lacks it and the referral pattern requires it. | P0 |

### 5.2 Detection (FR-DET)

| ID | Requirement | Pri |
|---|---|---|
| FR-DET-1 | Rule engine implements the rules in Section 8.1, reads thresholds from `config/rules.yaml`, and returns per-rule evidence objects. | P0 |
| FR-DET-2 | Tabular anomaly layer: Isolation Forest (unsupervised) and XGBoost (supervised) over the features in Section 8.2, trained with the temporal split in Section 12. | P0 |
| FR-DET-3 | Graph analytics layer computes the features in Section 8.3 (NetworkX algorithms; Neo4j as graph store and query engine). | P0 |
| FR-DET-4 | Temporal and similarity signals (burst, repeat window, profile similarity) per Section 8.4. | P0 |
| FR-DET-5 | Peer-group baselines (facility type, level, region, volume band) used by statistical and upcoding/referral signals. | P0 |
| FR-DET-6 | Risk fusion per Section 8.5 with versioned config `config/scoring.yaml`; store `model_version` and `rule_version` on every alert. | P0 |
| FR-DET-7 | SHAP-based top feature contributions for the XGBoost component, shown as "Faktor utama". | P2 |
| FR-DET-8 | GNN (GraphSAGE via PyTorch Geometric) only after FR-DET-1..6 pass evaluation. | P2 |

### 5.3 Alerts and explainability (FR-ALR)

| ID | Requirement | Pri |
|---|---|---|
| FR-ALR-1 | One `risk_alert` per flagged claim with fields in Section 7.2, ID format `CGX-` + 5 digits. | P0 |
| FR-ALR-2 | Each alert carries structured evidence (Section 8.6) that the UI renders as What / Why / Where / How strong / What next. | P0 |
| FR-ALR-3 | Alert language is generated from templates (Appendix A), never from an LLM. | P0 |
| FR-ALR-4 | Priority score per Section 8.5 orders the queue by risk, exposure, evidence strength, and network significance. | P0 |

### 5.4 Graph (FR-GRF)

| ID | Requirement | Pri |
|---|---|---|
| FR-GRF-1 | Load nodes and relationships (Section 7.4) into Neo4j with batched `UNWIND` writes; idempotent re-load. | P0 |
| FR-GRF-2 | `GET /claims/{id}/network` returns an ego network with `depth` 1 to 3 and a hard cap of 200 nodes (truncation flagged). | P0 |
| FR-GRF-3 | Detected communities of risk are persisted as `risk_networks` with member claims and a summary. | P0 |
| FR-GRF-4 | Graph UI supports focus, filter by node type, depth control, node detail drawer, and an accessible tabular view of edges. | P0 |

### 5.5 Human workflow and audit (FR-HIT)

| ID | Requirement | Pri |
|---|---|---|
| FR-HIT-1 | Status machine: `NEW` to `UNDER_REVIEW` to one of `VALIDATED`, `DISMISSED`, `ESCALATED`. No other transitions. | P0 |
| FR-HIT-2 | Decision requires a note (minimum 10 characters) and explicit confirmation. | P0 |
| FR-HIT-3 | Audit log is append-only: `audit_id`, `timestamp`, `actor_id`, `role`, `action`, `entity_type`, `entity_id`, `alert_id`, `risk_score_at_time`, `model_version`, `rule_version`, `payload`. No update or delete endpoints, and a database trigger or permission that blocks UPDATE and DELETE on the table. | P0 |
| FR-HIT-4 | Investigator feedback (validated or dismissed) is stored as labeled outcomes for future retraining; retraining itself is out of MVP. | P1 |

### 5.6 UI (FR-UI)

Defined in Section 6. All P0 pages: Overview, Risk Queue, Claim Detail, Fraud Graph, Investigation. P1 pages: Evaluation, Audit Log.

### 5.7 Evaluation (FR-EVL)

| ID | Requirement | Pri |
|---|---|---|
| FR-EVL-1 | Script `ml/evaluate.py` writes `reports/evaluation.json` and `reports/evaluation.md` with metrics in Section 12. | P0 |
| FR-EVL-2 | Ablation: rules only, anomaly only, graph only, fused. | P0 |
| FR-EVL-3 | Every metric label and chart title includes "synthetic evaluation". | P0 |

---

## 6. UI/UX Specification

### 6.1 Design principles

1. **Calm and trustworthy.** Warm, quiet, professional. An investigator should feel the tool is careful, not clever.
2. **Evidence first.** The most prominent element on every detail view is the evidence, not the score.
3. **Never accusatory.** Copy and visuals avoid alarm. Risk is a priority, not a verdict.
4. **Human-made look.** Clean hierarchy, generous whitespace, restrained color. No decoration that does not carry information.
5. **Keyboard-friendly and dense where it matters.** Tables are compact and scannable; detail views breathe.

**Visual anti-patterns (do not produce):** purple/blue gradients, glassmorphism, neon glows, emoji as icons, stock illustrations, oversized rounded cards with heavy shadows, rainbow charts, animated counters, generic hero banners, lorem ipsum.

### 6.2 Design tokens

Implement as CSS variables in `frontend/src/styles/tokens.css` and map into Tailwind theme. Do not hard-code colors elsewhere.

```css
:root {
  /* Surfaces */
  --bg: #F7F5F0;            /* warm paper */
  --surface: #FFFFFF;
  --surface-muted: #F0EDE6;
  --border: #E2DDD3;
  --border-strong: #CFC8BA;

  /* Text */
  --text: #1F1D1A;
  --text-muted: #6B665D;
  --text-subtle: #8D877B;

  /* Accent (single, calm) */
  --accent: #2F5D50;        /* deep green-teal */
  --accent-hover: #264B41;
  --accent-soft: #E3ECE8;

  /* Risk semantics: always paired with a text label and an icon */
  --risk-high: #A63D2F;     /* muted brick */
  --risk-high-soft: #F6E4E0;
  --risk-medium: #A8721A;   /* ochre */
  --risk-medium-soft: #F5EAD3;
  --risk-low: #5F6B63;      /* neutral slate-green */
  --risk-low-soft: #E8ECE9;

  /* Status */
  --status-new: #4B5563;
  --status-review: #2F5D50;
  --status-validated: #A63D2F;
  --status-dismissed: #6B665D;
  --status-escalated: #7A4A12;

  /* Shape and spacing */
  --radius: 6px;
  --radius-lg: 10px;
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 32px; --space-7: 48px;
  --focus-ring: 0 0 0 2px #FFFFFF, 0 0 0 4px #2F5D50;
}
```

Rules: surfaces separated by 1px borders, not shadows (one allowed shadow: popovers and dialogs, `0 4px 16px rgba(31,29,26,.12)`). Color alone never conveys meaning; risk level and status always show a text label and an icon.

### 6.3 Typography

Self-host with `@fontsource` packages (no CDN).

| Use | Family | Notes |
|---|---|---|
| Page titles, section titles | Source Serif 4 (600) | 28/36 page title, 20/28 section title |
| Body, UI | IBM Plex Sans (400, 500, 600) | 14/22 body, 13/20 table, 12/16 caption |
| IDs, codes, numbers in tables | IBM Plex Mono (400, 500) | Claim, alert, practitioner IDs; `font-variant-numeric: tabular-nums` for amounts |

Currency format: `Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR', maximumFractionDigits:0})`. Dates: `dd MMM yyyy, HH:mm` in `id-ID`.

### 6.4 Iconography

Inline SVG icons only (use `lucide-react` components, stroke 1.5, size 16 or 20). No emoji anywhere in UI, copy, or logs. Icon set mapping: Overview `layout-dashboard`, Queue `list-checks`, Claim `file-text`, Graph `share-2`, Investigation `clipboard-check`, Evaluation `bar-chart-3`, Audit `history`, Evidence check `check`, Missing link `unlink`, Warning notice `info` (never a red alert triangle).

### 6.5 App shell

- **Left sidebar (232px):** wordmark "CLAIMGRAPH-X" in Source Serif 4, nav items with icons, active item with `--accent-soft` background and 2px left accent bar. Bottom: role badge and "Ganti peran".
- **Top bar (56px):** global claim search (focus with `/`), persistent badge **DATA SINTETIS** (neutral, bordered, never dismissible), user menu.
- **Content:** max width 1440px, 24px padding, page header with title, short description, and primary action.
- **Persistent notice component** `<RiskNotice />` on Claim Detail, Graph, Investigation: "Ini adalah pola risiko yang memerlukan verifikasi, bukan penetapan kecurangan."
- Target viewport: desktop 1280px and up (primary), usable at 1024px, mobile not required.

### 6.6 Shared components

`RiskChip` (level + icon + text), `StatusChip`, `ScoreBar` (numeric score with thin bar, never a speedometer), `EvidenceItem` (check icon, text, rule ID in mono, strength label), `EntityTag` (type icon + ID in mono), `DataTable` (sticky header, server pagination, keyboard row navigation), `FilterBar`, `KpiCard` (number, label, one-line context), `Timeline`, `Drawer`, `ConfirmDialog`, `EmptyState`, `ErrorState`, `Skeleton`, `SyntheticBadge`, `RiskNotice`.

### 6.7 Page specifications

#### Page 1: Overview (`/`)

- Header: "Ringkasan" + last data refresh time.
- Row of four `KpiCard`: Klaim Dianalisis, Klaim Risiko Tinggi, Jaringan Potensial, Investigasi Terbuka. Each shows the number and a one-line context (e.g., share of total). No trend arrows in MVP.
- Left (8 cols): **Antrean Prioritas Teratas**, 5 rows (claim ID, risk, type, facility, status), link "Lihat semua". Shown to `investigator` and `analyst` only; `viewer` sees aggregates only (this block is hidden).
- Right (4 cols): **Sebaran Jenis Risiko** horizontal bar chart (Recharts, single neutral color, labels at bar end), and **Jaringan Potensial** list (community ID, size, dominant pattern).
- Footer strip: **Ringkasan Evaluasi** (precision@K, recall) with caption "Hasil pada evaluasi sintetis terkontrol" (analyst and viewer roles only; investigators see a link).
- States: skeletons on load; ErrorState with retry.

#### Page 2: Risk Queue (`/queue`)

- FilterBar: risk level, risk type, status, facility, amount range, date range, text search by claim ID. Filters sync to URL query.
- Table columns: Claim ID (mono), Risiko (`RiskChip` + score), Jenis Risiko, Fasilitas, Nilai Klaim (right-aligned, IDR), Bukti Utama (one line, truncated with tooltip), Status, chevron.
- Default sort: `priority_score` desc. Sortable: risk score, amount, created time. Page size 25, server-side pagination.
- Row click or `Enter` opens Claim Detail. `j`/`k` move selection.
- Empty: "Tidak ada peringatan yang cocok dengan filter." with "Atur ulang filter".
- Ground truth never appears on this page.

#### Page 3: Claim Detail (`/claims/[claimId]`)

Layout: header, then two columns (main 8 cols, side 4 cols).

- **Header:** claim ID (mono, large), `RiskChip` with score, `StatusChip`, primary button **Investigasi** (opens the Fraud Graph for this claim; hidden for `viewer`).
- **RiskNotice** directly under header.
- **Main:**
  1. *Ringkasan Klaim:* patient pseudonym ID, facility, practitioner, claim period, amount, items count.
  2. *Linimasa Layanan:* vertical timeline Encounter, Condition, Procedure, ChargeItem, Invoice, Claim with timestamps. A missing expected link renders as a dashed node with `unlink` icon and text "Tidak ditemukan kunjungan yang sesuai" (phantom case).
  3. *Bukti:* `EvidenceItem` list. Each has a one-line statement, rule ID, and strength (Kuat, Sedang, Lemah).
- **Side:**
  1. *Rincian Skor:* four horizontal bars (Aturan 30%, Anomali Statistik 25%, Anomali Graf 25%, Temporal/Kemiripan 20%) showing each component 0-100 and its weighted contribution; total equals the risk score.
  2. *Perbandingan dengan Kelompok Sebaya:* one compact chart (facility value vs peer median and p90) for the relevant metric.
  3. *Entitas Terkait:* counts (patients, claims, practitioners, facilities) with link to graph.
  4. *Rekomendasi Verifikasi:* short checklist generated from templates.
- Alert metadata (small, mono): alert ID, `model_version`, `rule_version`, generated time.

#### Page 4: Fraud Graph (`/claims/[claimId]/graph`, also `/graph?network=<id>`)

User-facing page title and nav label are **Jaringan Risiko** (the word "fraud" is internal only, see Appendix B).

- Page header: claim ID, `RiskChip`, and primary button **Mulai Tinjauan** (`investigator` only; calls `POST /investigations` and opens the Investigation page).
- Canvas (Cytoscape.js, main area) + right **Detail Drawer** + top toolbar.
- Toolbar: depth (1, 2, 3), node type toggles, layout reset, fit, zoom, "Tampilkan sebagai tabel" toggle.
- **Node encoding (monochrome, shape-differentiated):** Claim rounded rectangle; Patient circle; Practitioner diamond; Organization hexagon; Procedure triangle; Encounter small square. Default fill `--surface-muted`, border `--border-strong`. **Flagged** nodes: 2px `--risk-high` border plus a label chip; the focused claim has a thicker accent ring. Edges 1px `--border-strong`; flagged-path edges `--risk-high`.
- Labels: mono IDs; show on zoom threshold to avoid clutter.
- Legend (bottom-left) explains shapes and flagged styling.
- Detail Drawer: node type, ID, key attributes, its risk alerts (if claim), "Buka Detail Klaim".
- Community summary card: community size, shared patients, shared practitioners, dominant pattern, exposure sum.
- Performance: cap 200 nodes; show notice "Menampilkan 200 simpul teratas. Perbesar kedalaman atau filter untuk melihat lebih banyak."
- Accessibility: "Tampilkan sebagai tabel" lists edges (source, relation, target) in a keyboard-navigable table.

#### Page 5: Investigation (`/investigations/[alertId]`)

Three-step vertical flow with the audit trail on the right.

1. **Bukti AI** (read-only summary of What/Why/Where/How strong, plus link to Claim Detail and Graph).
2. **Tinjauan Manusia:** verification checklist generated per pattern (e.g., "Periksa dokumentasi kunjungan", "Cocokkan tindakan dengan rincian biaya"), each with checkbox and optional per-item note. Not mandatory to tick all, but ticked items are stored.
3. **Keputusan:** radio group (Validasi sebagai pola berisiko, Tolak peringatan, Eskalasi untuk tinjauan lanjut), required note (min 10 chars), button **Catat Keputusan**. `ConfirmDialog`: "Keputusan ini akan tercatat dalam jejak audit dan tidak dapat diubah."
- **Jejak Audit (right column):** append-only timeline with actor, role, action, time, score and versions at that moment.
- After decision: form becomes read-only; status chip updates; success toast "Keputusan tercatat."
- `analyst`: read-only view with the decision form hidden. `viewer`: no access.

#### Page 6 (P1): Evaluation (`/evaluation`, analyst and viewer)

Metrics cards (precision, recall, F1, PR-AUC), PR curve, precision@K and recall@K table for K in {10, 25, 50, 100}, ablation table, per-peer-group false positive rate, potential exposure flagged. Page header and every chart title include "evaluasi sintetis". A fixed note: "Hasil ini berasal dari data sintetis dengan pola yang disuntikkan dan bukan estimasi kinerja pada data JKN riil."

#### Page 7 (P1): Audit Log (`/audit`, analyst only)

Filterable append-only table (actor, action, entity, date range) with CSV export. Read-only.

### 6.8 Interaction and state rules

- Loading: skeletons for tables and cards; no spinners over whole pages.
- Errors: inline `ErrorState` with a retry button and a technical request ID in mono.
- Empty: concise sentence plus a next action.
- Destructive or irreversible actions always use `ConfirmDialog`.
- Toasts for success only; errors stay inline.
- Motion: 120-160ms opacity/transform transitions only; respect `prefers-reduced-motion`.
- Keyboard: visible focus ring (`--focus-ring`), `/` focuses search, `Esc` closes drawers and dialogs, tables navigable with arrow keys.

### 6.9 Accessibility and quality bars

WCAG 2.1 AA contrast for all text and chips; all interactive elements reachable by keyboard; ARIA labels on icon-only buttons; graph has a table alternative; no information by color alone; page `lang="id"`.

---

## 7. Data Model

### 7.1 Identifier conventions (all pseudonymous and synthetic)

| Entity | Format | Example |
|---|---|---|
| Patient | `PT-` + 5 digits | `PT-00412` |
| Practitioner | `D-` + 3 digits | `D-012` |
| Organization (facility) | `F-` + 3 digits | `F-003` |
| Encounter | `E-` + 6 digits | `E-004281` |
| Condition / Procedure event | `CN-` / `PX-` + 6 digits | `PX-009113` |
| Procedure code (catalog) | `PRC-` + 2 digits | `PRC-07` |
| Claim | `C-` + 6 digits | `C-010291` |
| Alert | `CGX-` + 5 digits | `CGX-00128` |

Code catalogs (`reference/code_catalog.csv`) are small synthetic lists (about 60 diagnosis codes and 40 procedure codes with a `complexity_level` 1 to 4). They may be inspired by public code structures but must not claim to be official ICD or INA-CBG content.

### 7.2 Relational schema (PostgreSQL, source of truth)

Use SQLAlchemy 2.x models and Alembic migrations. All timestamps `timestamptz`. Add indexes on every foreign key and on `claims(organization_id, claim_created)`, `risk_alerts(priority_score DESC)`, `audit_log(timestamp)`.

| Table | Columns |
|---|---|
| `patients` | patient_id PK, birth_year, sex, region_code, membership_status |
| `practitioners` | practitioner_id PK, specialty, organization_id FK, region_code |
| `organizations` | organization_id PK, facility_type, facility_level, region_code, peer_group_id FK |
| `peer_groups` | peer_group_id PK, facility_type, facility_level, region_group, volume_band |
| `encounters` | encounter_id PK, patient_id, organization_id, practitioner_id, encounter_type, start_datetime, end_datetime |
| `conditions` | condition_id PK, encounter_id, condition_code |
| `procedures` | procedure_id PK, encounter_id, patient_id, practitioner_id, procedure_code, procedure_datetime |
| `charge_items` | charge_item_id PK, encounter_id, procedure_id, quantity, unit_price, total_price |
| `invoices` | invoice_id PK, encounter_id, organization_id, total_amount, issued_at |
| `claims` | claim_id PK, patient_id, organization_id, encounter_id (nullable, null allowed only for phantom injection), claim_created, billable_period_start, billable_period_end, claim_amount, claimed_complexity_level, claim_status |
| `claim_items` | claim_item_id PK, claim_id, diagnosis_sequence, procedure_sequence, procedure_code, quantity, unit_price, total_price |
| `referrals` | referral_id PK, patient_id, from_practitioner_id, from_organization_id, to_organization_id, referral_datetime, capacity_reason_flag bool |
| `ref_code_catalog` | code PK, code_type, description, complexity_level |
| `ref_expected_complexity` | procedure_code PK, expected_level_min, expected_level_max |
| `fraud_cases` | fraud_case_id PK, fraud_type, affected_claim_id, ground_truth, injection_reason, variant, network_group_id (nullable) |
| `risk_alerts` | alert_id PK, claim_id unique, risk_score int, risk_level, primary_pattern, secondary_patterns jsonb, component_scores jsonb, priority_score float, exposure_amount, evidence jsonb, related_entities jsonb, confidence, status, model_version, rule_version, created_at |
| `risk_networks` | network_id PK, community_size, dominant_pattern, member_claim_ids jsonb, exposure_sum, summary jsonb |
| `investigations` | investigation_id PK, alert_id FK, opened_by, opened_at, checklist jsonb, decision, note, decided_by, decided_at |
| `audit_log` | audit_id PK, timestamp, actor_id, role, action, entity_type, entity_id, alert_id, risk_score_at_time, model_version, rule_version, payload jsonb |
| `users` | user_id PK, username, role |

`audit_log` is append-only: revoke UPDATE and DELETE for the application role or add a trigger that raises on both.

### 7.3 Target volumes and injection plan

| Entity | Target | Entity | Target |
|---|---|---|---|
| Patients | 10,000 | Claims | 30,000 |
| Practitioners | 500 | Claim items | 60,000 |
| Organizations | 100 | Charge items | 60,000 |
| Encounters | 30,000 | Invoices | 30,000 |
| Conditions | 30,000 | Procedures | 40,000 |
| Referrals | about 6,000 | Peer groups | 8 to 12 |

Injected positives (about 2% overall, preserving realistic class imbalance):

| Pattern | Target | Variants |
|---|---|---|
| Phantom billing | about 120 claims | no encounter; encounter without matching procedure; date outside encounter |
| Repeat billing | about 180 claims | exact duplicate; near duplicate within 1 to 3 days with small amount variation |
| Cloning | 8 networks, 3 to 10 claims each | exact copy; high-similarity copy with minor code or length-of-stay changes |
| Upcoding | about 150 claims across 6 facilities or practitioners | claimed level above expected; gradual monthly shift |
| Referral anomaly | 4 practitioners, about 100 claims | high concentration; reciprocal loop between two facilities |

A subset of normal records must be deliberately "hard negatives" (legitimately high-volume referral hospital, complex cases, legitimate repeat visits) to test false positives.

### 7.4 Graph schema (Neo4j, rebuilt from PostgreSQL)

Nodes: `Patient`, `Practitioner`, `Organization`, `Encounter`, `Condition`, `Procedure`, `ChargeItem`, `Invoice`, `Claim`. Constraints: unique id per label.

Relationships:

```text
(Patient)-[:HAS_ENCOUNTER]->(Encounter)
(Practitioner)-[:PERFORMED]->(Procedure)
(Organization)-[:HOSTED]->(Encounter)
(Encounter)-[:HAS_CONDITION]->(Condition)
(Encounter)-[:HAS_PROCEDURE]->(Procedure)
(Encounter)-[:HAS_CHARGE]->(ChargeItem)
(Encounter)-[:HAS_INVOICE]->(Invoice)
(Claim)-[:FOR_ENCOUNTER]->(Encounter)
(Claim)-[:SUBMITTED_BY]->(Organization)
(Claim)-[:FOR_PATIENT]->(Patient)
(Practitioner)-[:REFERRED_TO {referral_id, datetime}]->(Organization)
```

Graph load must be idempotent (`MERGE`) and batched (`UNWIND`, batches of 1,000 to 5,000).

---

## 8. Detection Specification

All thresholds live in `config/rules.yaml` and `config/scoring.yaml` and are versioned (`rule_version`, `model_version` read from these files plus a git-independent semantic version string).

### 8.1 Rules

| Rule ID | Pattern | Logic (default thresholds in config) | Evidence strength |
|---|---|---|---|
| R-PH-01 | Phantom | Claim has no valid encounter (null or not found) | Kuat |
| R-PH-02 | Phantom | Encounter exists but no procedure or charge item matches the claim items | Kuat |
| R-PH-03 | Phantom | Billable period falls outside encounter period by more than `tolerance_days` (default 1) | Sedang |
| R-RP-01 | Repeat | Same patient, procedure code, organization, and service date in more than one claim | Kuat |
| R-RP-02 | Repeat | Same patient and procedure family at same organization within `window_days` (default 3) with amount difference under 10% | Sedang |
| R-CL-01 | Cloning | Profile similarity (Jaccard over diagnosis and procedure code sets, plus length-of-stay bucket match) at least 0.9 between claims of different patients, same practitioner, within 30 days; cluster size at least 3 | Kuat when cluster size 5 or more, else Sedang |
| R-UP-01 | Upcoding | `claimed_complexity_level` above `expected_level_max` from `ref_expected_complexity` for the encounter's procedures | Kuat |
| R-UP-02 | Upcoding | Monthly share of high-complexity claims for the practitioner or facility above peer-group mean by more than 2.5 standard deviations, or a detected trend break | Sedang |
| R-RF-01 | Referral | A practitioner's referral share to one organization above the peer p95, at least 20 referrals, and no capacity reason | Sedang |
| R-RF-02 | Referral | Reciprocal referral loop between two organizations or practitioners above `min_loop_count` | Sedang |

Each rule returns `{rule_id, triggered, strength, statement_params, entity_refs}`. Statements are rendered from templates (Appendix A).

### 8.2 Tabular anomaly features

`claim_amount`, `claim_frequency`, `procedure_frequency`, `doctor_claim_frequency`, `facility_claim_frequency`, `patient_claim_frequency`, `duplicate_similarity`, `price_deviation` (vs procedure and peer median), `service_gap` (days since previous service of same type), `length_of_stay`, `complexity_gap` (claimed minus expected), `peer_zscore_amount`.

Models: Isolation Forest (unsupervised, contamination from config) and XGBoost (supervised, class-weighted, probability calibrated with isotonic regression). Both output 0 to 100 after normalization; `statistical_score = 0.4 * iforest + 0.6 * xgb` (configurable). XGBoost is the chosen supervised model (LightGBM is out of scope).

### 8.3 Graph features

`provider_patient_degree`, `provider_claim_degree`, `procedure_concentration` (entropy-based), `shared_patient_count`, `shared_provider_count`, `community_size` (Louvain on the claim-similarity and shared-entity projection), `community_density`, `referral_share_to_top_org`, `reciprocal_referral_count`. Compute with NetworkX on a projection exported from PostgreSQL or Neo4j; write results to a feature table keyed by `claim_id`. `graph_score` is a monotone transform of the weighted features into 0 to 100.

### 8.4 Temporal and similarity signals

`burst_score` (claims per practitioner per week vs own history and peers), `repeat_window_hits`, `profile_similarity_max`, `temporal_concentration` (share of cluster claims within a 7-day window). `temporal_similarity_score` combines them into 0 to 100.

### 8.5 Risk fusion and priority

```text
rule_score        = max over triggered rules of strength_weight (Kuat=100, Sedang=60, Lemah=30),
                    plus 10 for each additional triggered rule (distinct rule IDs), capped at 100
risk_score        = round( 0.30*rule_score + 0.25*statistical_score
                         + 0.25*graph_score + 0.20*temporal_similarity_score )
risk_level        = HIGH if >= 75, MEDIUM if >= 50, else LOW        (configurable)
evidence_strength = (number of signal families above family_threshold) / 4
confidence        = Tinggi if evidence_strength >= 0.75, Sedang if >= 0.5, else Rendah
priority_score    = 0.50*(risk_score/100) + 0.20*exposure_norm
                  + 0.15*evidence_strength + 0.15*network_significance
```

`exposure_norm` is min-max normalized `log10(1 + claim_amount)` over the dataset; `network_significance` is the normalized size and density of the claim's risk network (0 if none). Weights are initial prototype configuration, not official BPJS weights, and the UI must say so on the score breakdown ("Konfigurasi awal prototipe").

Only claims with `risk_score >= alert_min_score` (default 40) create a `risk_alert`.

### 8.6 Evidence schema (stored in `risk_alerts.evidence`)

```json
{
  "what": {"pattern": "possible_cloning", "label": "Kemungkinan Cloning", "claim_ids": ["C-010291"]},
  "why": [
    {"rule_id": "R-CL-01", "family": "rule", "strength": "kuat",
     "statement": "Profil layanan sangat mirip pada 3 pasien berbeda dengan tenaga kesehatan yang sama.",
     "params": {"similarity": 0.94, "cluster_size": 3}}
  ],
  "where": {"patients": ["PT-00412", "PT-00977", "PT-01530"], "practitioners": ["D-012"],
            "organizations": ["F-003"], "claims": ["C-010291", "C-010292"]},
  "how_strong": {"score": 91, "level": "HIGH", "confidence": "Tinggi", "evidence_strength": 1.0},
  "what_next": ["Periksa dokumentasi kunjungan untuk klaim terkait",
                "Bandingkan urutan tindakan antar pasien pada periode yang sama"]
}
```

---

## 9. API Specification

Base path `/api/v1`. JSON only. Auth: `Authorization: Bearer <jwt>` from demo login. Pagination: `page` (1-based) and `page_size` (max 100) returning `{items, page, page_size, total}`. Errors:

```json
{"error": {"code": "VALIDATION_ERROR", "message": "note must be at least 10 characters", "request_id": "req_8f2a..."}}
```

| Method and path | Purpose | Roles |
|---|---|---|
| `POST /auth/demo-login` | Body `{"username": "..."}`, returns token and role | public |
| `GET /health` | Liveness and dependency status (Postgres, Neo4j) | public |
| `GET /overview` | KPI counts and risk-type distribution (all roles); top 5 alerts and network list (investigator, analyst only) | all |
| `GET /risk-alerts` | Queue. Query: `risk_level`, `risk_type`, `status`, `facility_id`, `amount_min`, `amount_max`, `date_from`, `date_to`, `q`, `sort`, `page`, `page_size` | investigator, analyst |
| `GET /claims/{claim_id}` | Claim, timeline, alert, evidence, component scores, peer comparison | investigator, analyst |
| `GET /claims/{claim_id}/network` | Ego network. Query `depth` (1 to 3). Returns `{nodes, edges, truncated, community}` | investigator, analyst |
| `POST /claims/analyze` | Body `{"claim_id": "..."}`. Re-runs scoring for one claim and upserts its alert. Idempotent. | investigator, analyst |
| `GET /risk-networks` | List and detail of detected risk networks | investigator, analyst |
| `POST /investigations` | Body `{"alert_id": "..."}`. Opens a review (`NEW` to `UNDER_REVIEW`), writes audit entry | investigator |
| `POST /investigations/{id}/decision` | Body `{"decision": "VALIDATED|DISMISSED|ESCALATED", "note": "...", "checklist": [...]}`. Validates transition, writes audit entry | investigator |
| `GET /investigations/{id}` | Investigation with audit entries for the alert | all except viewer |
| `GET /audit-log` | Filterable audit entries | analyst |
| `GET /evaluation` | Reads `reports/evaluation.json` plus ground-truth-based aggregates | analyst, viewer |

Example response for `GET /risk-alerts?page=1&page_size=25&sort=-priority_score`:

```json
{
  "items": [{
    "alert_id": "CGX-00128", "claim_id": "C-010291", "risk_score": 91, "risk_level": "HIGH",
    "primary_pattern": "possible_cloning", "facility": {"id": "F-003", "type": "RS"},
    "claim_amount": 18450000, "top_evidence": "Profil layanan sangat mirip pada 3 pasien berbeda",
    "status": "NEW", "priority_score": 0.87
  }],
  "page": 1, "page_size": 25, "total": 612
}
```

Contract rules: no endpoint except `GET /evaluation` may read `fraud_cases`; Pydantic v2 schemas for all responses; OpenAPI served at `/docs`; the frontend generates its TypeScript types from the OpenAPI schema (`openapi-typescript`).

---

## 10. Architecture and Repository

### 10.1 Components

```text
data_gen (Python) -> validation -> PostgreSQL (truth) -> Neo4j (graph store, rebuilt from PG)
PostgreSQL -> features -> Rule Engine + Anomaly Models + Graph Analytics (NetworkX) -> Fusion -> risk_alerts
FastAPI (reads PG, queries Neo4j) -> Next.js dashboard
```

### 10.2 Repository layout

```text
claimgraph-x/
  docs/            PRD.md, DECISIONS.md, DESIGN_NOTES.md
  config/          rules.yaml, scoring.yaml
  reference/       code_catalog.csv, expected_complexity.csv
  data_gen/        generate.py, normal/, inject/, validate.py
  backend/app/     api/, core/, db/, schemas/, services/, detection/, graph/
  ml/              features.py, train.py, evaluate.py, models/
  frontend/        Next.js (App Router, TypeScript)
  reports/         data_quality.json, evaluation.json, evaluation.md
  tests/           unit/, integration/, e2e/
  scripts/         *.ps1 helper scripts (PowerShell)
  docker-compose.yml, .env.example, README.md
```

### 10.3 Stack decisions (fixed)

Python 3.11, FastAPI, SQLAlchemy 2.x, Alembic, Pydantic v2, pandas, scikit-learn, XGBoost, NetworkX, neo4j driver; PostgreSQL 16; Neo4j 5 Community; Node 20, Next.js (App Router), TypeScript, Tailwind CSS mapped to tokens, TanStack Query, Cytoscape.js, Recharts, lucide-react, `@fontsource` fonts; Docker Compose; pytest, Playwright (one e2e for the demo script).

### 10.4 Environment and commands (Windows PowerShell)

`.env.example` must include `POSTGRES_*`, `NEO4J_AUTH`, `JWT_SECRET`, `DATA_SEED=42`. Provide `scripts/` PowerShell wrappers:

```powershell
docker compose up -d --build
python -m data_gen.generate --seed 42 --out data/
python -m data_gen.validate
python -m backend.app.db.load --source data/
python -m backend.app.graph.load
python -m ml.train
python -m backend.app.detection.run_all
python -m ml.evaluate
pytest -q
npm --prefix frontend run dev
```

Provide a single `scripts/seed-all.ps1` that runs the data and detection steps in order and prints a summary (counts, injected cases, alerts created).

---

## 11. Non-Functional Requirements

| Area | Requirement |
|---|---|
| Reproducibility | `docker compose up` plus `seed-all.ps1` rebuilds the full demo from scratch in under 15 minutes on a laptop; same seed gives identical datasets and alert IDs |
| Performance | Queue page under 1.5 s for 30,000 claims (server-side pagination, indexes); ego network under 2 s for depth 2; Claim Detail under 1 s |
| Security | RBAC enforced server-side on every endpoint; JWT secret from env; no secrets in git; CORS limited to the frontend origin; input validation on all bodies |
| Privacy | Synthetic only; no real identifiers; ground truth isolated; no data sent to external LLM or analytics services; no third-party trackers or CDN fonts |
| Auditability | Every state change and every decision produces an audit entry in the same transaction |
| Accessibility | Section 6.9 |
| Quality | Type hints and `ruff` clean; ESLint and `tsc --noEmit` clean; unit tests for every rule (positive and negative case) and for the status machine and RBAC; one Playwright test for the demo script |
| Observability | Structured JSON logs with `request_id`; `/health` endpoint |
| Documentation | README with setup and demo script; `docs/DECISIONS.md` for deviations |

---

## 12. Evaluation Specification

- **Split by time and episode, not random rows.** Synthetic timeline of 10 months: train months 1 to 6, validation 7 to 8, test 9 to 10. All claims of one injected episode or network stay in one split.
- **Metrics:** precision, recall, F1, PR-AUC; precision@K and recall@K for K in {10, 25, 50, 100}; false positive rate and false negative rate overall and per peer group; alerts reviewed to reach 50% and 80% recall; average evidence count per alert; detection latency (data ingestion to alert); number of risk networks found out of those injected; potential exposure flagged (sum of claim amount of true-positive alerts).
- **Ablation:** rules only, anomaly only, graph only, fused. Report each metric for each variant.
- **Baselines for workload reduction:** random ordering and amount-descending ordering.
- **Labeling:** every table, chart, JSON key group, and doc paragraph says "synthetic evaluation". Potential exposure is named "Potential claim exposure identified in synthetic evaluation", never "savings".
- **Output files:** `reports/evaluation.json` (machine-readable) and `reports/evaluation.md` (human-readable, with the injection rates and seed stated).
- The goal is a credible and honest result, not a maximal number. Do not tune on the test split.

---

## 13. Antigravity Execution Plan

### 13.1 Master Context Prompt (paste at the start of every session)

```text
You are building CLAIMGRAPH-X, an explainable claims risk-intelligence MVP for JKN claim
investigators. The single source of truth is docs/PRD.md. Read it fully before acting.

Non-negotiable rules:
1. Synthetic data only. Never create or request real personal or claim data.
2. Never write code, UI text, logs, or docs that say or imply fraud is proven. Use
   "potential risk", "risk pattern", "anomaly", "investigation priority". Obey Appendix B.
3. A human decides. The system never changes payment status or issues sanctions.
4. Every alert is explained (What, Why, Where, How strong, What next).
5. Do not build anything listed in PRD Section 2.2.
6. UI must follow PRD Section 6 exactly: tokens, fonts, SVG icons (lucide), no emoji,
   no gradients, no glassmorphism, Bahasa Indonesia copy from Appendix A.
7. Work on one phase at a time. After each phase, run the verification commands, fix
   failures, and summarize: what was built, how it was verified, deviations (log them in
   docs/DECISIONS.md). Do not start the next phase until I confirm.
8. Environment is Windows with PowerShell and Docker Desktop. Use PowerShell syntax.
9. If a requirement is ambiguous, choose the simplest option that satisfies the PRD and
   record the decision; do not ask unless it blocks progress.
```

### 13.2 Phase prompts

Each phase ends with its acceptance criteria. Run phases in order.

**Phase 0: Scaffold and guardrails**

```text
Read docs/PRD.md. Create the repository layout from Section 10.2, docker-compose.yml with
postgres, neo4j, backend, frontend, .env.example, pyproject (ruff, pytest), frontend with
Next.js App Router + TypeScript + Tailwind, and an empty health endpoint (GET /api/v1/health)
that checks Postgres and Neo4j. Add frontend/src/styles/tokens.css exactly as in PRD 6.2 and
configure @fontsource fonts per 6.3. Add tests/unit/test_forbidden_terms.py that scans backend
templates and frontend copy files for the forbidden terms in Appendix B and fails if any appear.
Acceptance: `docker compose up -d --build` succeeds; /api/v1/health returns both services ok;
`pytest -q` passes; `npm --prefix frontend run build` passes.
```

**Phase 1: Data foundation (FR-DATA)**

```text
Implement Section 7 and FR-DATA-1..7: SQLAlchemy models + Alembic migration for every table,
reference catalogs, and data_gen with Layer 1 normal population, Layer 2 consistency, Layer 3
injectors with the variants and counts in Section 7.3, plus hard negatives. Add data_gen/validate.py
producing reports/data_quality.json. Make output deterministic with --seed. Seed the five demo
claims in Section 4 with their reserved IDs. Add loader to PostgreSQL.
Acceptance: row counts match Section 7.3 within 2%; referential integrity passes; each injector
has a unit test; same seed yields identical hashes of generated CSVs; fraud_cases is populated;
no column contains NIK, names, addresses, or phone numbers.
```

**Phase 2: Detection baseline (FR-DET-1, 2, 4, 5, 6; FR-ALR)**

```text
Implement config/rules.yaml and config/scoring.yaml, the rule engine for all rules in 8.1 (each
with positive and negative unit tests), peer-group baselines, feature engineering (8.2, 8.4),
Isolation Forest and XGBoost training with the temporal split in Section 12, fusion and priority
per 8.5, evidence JSON per 8.6 rendered from Appendix A templates, and a runner that creates
risk_alerts. Store model_version and rule_version on each alert.
Acceptance: all five seeded demo claims produce alerts with the expected primary_pattern, and C-010291 ranks in the top 3 of the queue (asserted by a test);
reports show precision/recall for rules-only and anomaly-only variants; alert evidence validates
against the schema; no alert text contains forbidden terms.
```

**Phase 3: Graph intelligence (FR-DET-3, FR-GRF)**

```text
Load the graph into Neo4j per 7.4 (idempotent, batched). Compute graph features per 8.3 with
NetworkX, detect communities, persist risk_networks, and integrate graph_score into fusion.
Implement the ego-network query with depth 1 to 3 and the 200-node cap, returning the shape in
Section 9.
Acceptance: the cloning demo network (C-010291) is detected as one risk network; ego network for
C-010291 depth 2 returns in under 2 seconds and includes practitioner D-012; re-running the loader
does not duplicate nodes; fused variant outperforms rules-only on cloning and referral recall.
```

**Phase 4: API (FR-HIT, Section 9)**

```text
Implement every endpoint in Section 9 with Pydantic v2 schemas, JWT demo login, RBAC dependencies,
the status machine (FR-HIT-1), mandatory decision note, and append-only audit log written in the
same DB transaction. Block UPDATE/DELETE on audit_log at the database level. Expose OpenAPI and
generate frontend types with openapi-typescript.
Acceptance: integration tests cover RBAC for the three roles, invalid status transitions return 409,
note under 10 chars returns 422, an audit row exists for every state change, and ground truth is
never present in any response except GET /evaluation.
```

**Phase 5: Design system and app shell (Section 6.1 to 6.6)**

```text
Build the frontend foundation: tokens, typography, app shell (sidebar, top bar with persistent
SYNTHETIC DATA badge, role badge), and all shared components in 6.6 with Storybook-free demo page
at /_components. Use lucide-react SVG icons only. Use TanStack Query and the generated API types.
Implement demo login with role switcher.
Acceptance: components render all states (loading, empty, error); keyboard focus ring visible; axe
checks pass on /_components; no emoji or gradients anywhere (grep check); colors come only from tokens.
```

**Phase 6: Pages (Section 6.7)**

```text
Implement Overview, Risk Queue, Claim Detail, Fraud Graph (Cytoscape.js with the encoding in 6.7),
and Investigation exactly per Section 6.7, then Evaluation and Audit Log (P1). Use copy from
Appendix A in Bahasa Indonesia. Wire filters to URL query. Implement the table alternative for the
graph. Include the RiskNotice component where specified.
Acceptance: the full demo script in Section 4 can be performed by hand; a Playwright test automates
steps 1 to 7 of the script; Lighthouse accessibility score at least 95 on Queue and Claim Detail;
tsc and ESLint clean; no forbidden terms (test_forbidden_terms passes).
```

**Phase 7: Evaluation and hardening (FR-EVL, Section 11)**

```text
Implement ml/evaluate.py per Section 12 with ablation and baselines, writing reports/evaluation.json
and reports/evaluation.md, and the Evaluation page. Add scripts/seed-all.ps1, README with setup and
the demo script, and docs/DECISIONS.md. Run the full test suite and the Playwright demo test.
Acceptance: every item in the Definition of Done (Section 14) is checked; `seed-all.ps1` rebuilds
everything from scratch; all metrics are labeled "synthetic evaluation"; README states that no real
data is used.
```

---

## 14. Definition of Done

- [ ] Synthetic dataset generated reproducibly (seed 42) and validated
- [ ] Five fraud patterns injected with ground truth, with hard negatives present
- [ ] Rule engine finds deterministic cases; every rule has positive and negative tests
- [ ] Anomaly models produce scores; fusion produces `risk_score` and `priority_score`
- [ ] Neo4j holds the relationship graph; at least the injected cloning networks are discovered
- [ ] Dashboard shows evidence (What, Why, Where, How strong, What next) for every alert
- [ ] Investigator can start a review and record validate, dismiss, or escalate with a note
- [ ] Audit log is append-only and records model and rule versions
- [ ] Evaluation report with metrics, ablation, and baselines exists and is labeled synthetic
- [ ] Demo script in Section 4 passes by hand and in Playwright
- [ ] No real data anywhere; ground truth not exposed outside the Evaluation endpoint
- [ ] No forbidden terms in UI, API templates, logs, or docs
- [ ] Persistent "DATA SINTETIS" indicator and RiskNotice present where specified
- [ ] Accessibility bar in Section 6.9 met
- [ ] No claim of real-world accuracy or rupiah savings anywhere

---

## 15. Decisions, Risks, and Open Items

### 15.1 Decisions already made (do not re-litigate)

| Decision | Reason |
|---|---|
| PostgreSQL is the source of truth; Neo4j is rebuilt from it | Simplicity and reproducibility |
| NetworkX for graph algorithms; Neo4j for storage, queries, visualization source | Avoids dependency on Neo4j GDS availability |
| XGBoost as the supervised model (not LightGBM) | One model, fewer moving parts |
| Referral table added to the data model | Blueprint lacks it; referral pattern requires it |
| Alert text from templates, never LLM | Predictability, no hallucination, privacy |
| Next.js App Router, desktop-first | Fast dashboard delivery; investigators work on desktop |
| Synthetic code catalog, not official code sets | Licensing and scope |

### 15.2 Risks and mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Synthetic data too regular | High | Skewed distributions, hard negatives, multiple injection variants |
| Overfitting to injected patterns | High | Temporal and episode split, variant held-out in test |
| False positives on legitimately complex facilities | High | Peer-group baselines, hard negatives, human review |
| Graph too heavy for UI | Medium | 200-node cap, depth limit, table alternative |
| Scope creep (GNN, LLM, extras) | Medium | Section 2.2 and Master Context Prompt rule 5 |
| Overclaiming results | High | Principle P7 and labeling rules in Section 12 |

### 15.3 Open items (non-blocking)

- Final facility naming style in UI (keep neutral codes `F-003` plus type until the team decides on fictional names).
- Whether to add SHAP explanations (FR-DET-7, P2) after Phase 7.

---

## Appendix A. Copy Deck (Bahasa Indonesia)

**Navigation:** Ringkasan, Antrean Risiko, Detail Klaim, Jaringan Risiko, Investigasi, Evaluasi, Jejak Audit.

**Risk levels:** Tinggi, Sedang, Rendah. **Confidence:** Tinggi, Sedang, Rendah. **Evidence strength:** Kuat, Sedang, Lemah.

**Status:** Baru (`NEW`), Sedang Ditinjau (`UNDER_REVIEW`), Divalidasi (`VALIDATED`), Ditolak (`DISMISSED`), Dieskalasi (`ESCALATED`).

**Pattern labels:** Kemungkinan Phantom Billing, Kemungkinan Repeat Billing, Kemungkinan Cloning, Kemungkinan Upcoding, Anomali Pola Rujukan.

**Persistent notice:** "Ini adalah pola risiko yang memerlukan verifikasi, bukan penetapan kecurangan."

**Synthetic badge:** "DATA SINTETIS". **Evaluation note:** "Hasil ini berasal dari data sintetis dengan pola yang disuntikkan dan bukan estimasi kinerja pada data JKN riil."

**Score breakdown note:** "Konfigurasi awal prototipe. Bobot ini bukan bobot resmi BPJS Kesehatan."

**Evidence statement templates** (`{}` are parameters):

| Rule | Template |
|---|---|
| R-PH-01 | "Klaim tidak memiliki kunjungan yang sesuai." |
| R-PH-02 | "Kunjungan ada, tetapi tidak ditemukan tindakan atau rincian biaya yang sesuai dengan butir klaim." |
| R-PH-03 | "Periode penagihan berada di luar periode kunjungan sejauh {days} hari." |
| R-RP-01 | "Pasien, tindakan, fasilitas, dan tanggal layanan yang sama muncul pada {n} klaim." |
| R-RP-02 | "Layanan serupa untuk pasien yang sama diajukan {n} kali dalam {days} hari dengan nilai yang hampir sama." |
| R-CL-01 | "Profil layanan sangat mirip (kemiripan {sim}) pada {n} pasien berbeda dengan tenaga kesehatan yang sama." |
| R-UP-01 | "Tingkat kompleksitas yang diklaim ({claimed}) lebih tinggi dari yang diharapkan untuk tindakan terkait ({expected})." |
| R-UP-02 | "Proporsi klaim kompleksitas tinggi {pct}% di atas rata-rata kelompok sebaya." |
| R-RF-01 | "{pct}% rujukan dari tenaga kesehatan ini mengarah ke satu fasilitas, di atas persentil ke-95 kelompok sebaya." |
| R-RF-02 | "Ditemukan pola rujukan timbal balik antara dua fasilitas sebanyak {n} kali." |

**Recommended action templates:** "Periksa dokumentasi kunjungan untuk klaim terkait." "Cocokkan tindakan pada klaim dengan rincian biaya." "Bandingkan urutan tindakan antar pasien pada periode yang sama." "Tinjau alasan klinis atau kapasitas untuk pola rujukan ini." "Mintakan klarifikasi dokumentasi dari fasilitas bila diperlukan."

**Decision dialog:** "Keputusan ini akan tercatat dalam jejak audit dan tidak dapat diubah."

**Empty and error:** "Tidak ada peringatan yang cocok dengan filter." "Terjadi kesalahan saat memuat data. Coba lagi." (with request ID in mono).

## Appendix B. Forbidden Terms and Automated Check

Must not appear in UI copy, API templates, logs, or docs (case-insensitive, Indonesian and English): `terbukti curang`, `terbukti fraud`, `terbukti melakukan`, `rumah sakit curang`, `pelaku`, `bersalah`, `tersangka`, `penipu`, `penipuan terbukti`, `proven fraud`, `fraudulent hospital`, `guilty`, `confirmed fraud`, `fraud detected` (use "risk pattern detected"). The word "fraud" may appear only in code identifiers, internal technical docs, and the injected-case table names, never in user-facing text. `tests/unit/test_forbidden_terms.py` enforces this and runs in CI. The scan covers `frontend/src`, backend alert templates, and user-facing docs; it excludes this Appendix, the PRD's internal sections, and the test file itself.

## Appendix C. Glossary

**Risk pattern:** a claim or group of claims that deviates from expected behavior and merits review. **Evidence:** a structured, verifiable observation supporting an alert. **Peer group:** facilities comparable by type, level, region, and volume. **Hard negative:** a legitimate synthetic case that looks unusual, used to test false positives. **Potential claim exposure:** sum of claim amounts associated with true-positive synthetic cases, not savings.
