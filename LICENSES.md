# Vendor Repositories — Licenses and Reusability Audit

This document summarizes the license and reusability audit for all external repositories cloned into `./vendor` for analysis and design extraction. In accordance with architectural constraints, no repository is imported wholesale; only specifications, layout ideas, domain types, and data models are extracted.

---

| Repository | License | Permissibility & Terms | Integral Parts Extracted & Reused | Explicitly Excluded / Dropped |
| :--- | :--- | :--- | :--- | :--- |
| **`jolpica/jolpica-f1`** | Apache License 2.0 | Permissive; requires attribution and copyright notice. | Ergast-compatible REST endpoint specifications, pagination standards, and JSON response shapes (seasons, races, results, qualifying, standings, laps, pitstops). Handcrafted TypeScript interfaces and a typed browser client. | Python/Django backend, Celery workers, database migration scripts, Docker setups. |
| **`theOehrly/Fast-F1`** | MIT License | Permissive; free use with attribution notice. | F1 telemetry domain abstractions: session structure (FP1/2/3, Qualifying, Sprint, Race), lap telemetry metrics (speed, RPM, gear, throttle, brake, DRS), tyre stint classification (Soft, Medium, Hard, Intermediate, Wet). | All Python code, Fast-F1 core engine, Pandas/NumPy pipelines, local disk caching modules. |
| **`br-g/openf1`** | CC BY-NC-SA 4.0 | Non-commercial share-alike for data schemas. Free community API access. | REST endpoint definitions, query parameters, and field schemas (`/sessions`, `/meetings`, `/drivers`, `/laps`, `/car_data`, `/position`, `/intervals`, `/pit`, `/stints`, `/weather`, `/race_control`). Custom TypeScript client with browser caching. | Backend ingestion pipelines, MongoDB schemas, Docker Compose configurations, and Python scripts. |
| **`matteocelani/f1-telemetry`** | MIT License | Permissive; free use with attribution notice. | Dashboard UI panel hierarchy, telemetry charts layout, and reference documentation from `docs/live-timing-types.md` for timing and telemetry field definitions. | Node.js backend proxy, SignalR socket consumer, server-side data parsers. |
| **`f1stuff/f1-live-data`** | MIT License | Permissive; free use with attribution notice. | Conceptual ideas for race telemetry panels: lap time delta tracker, gap to leader, and sector performance indicators. | InfluxDB time-series storage, Grafana dashboard JSONs, Docker deployment files. |
| **`tdjsnelling/monaco`** | GNU GPL v3.0 | Strong Copyleft; derivative code must also be licensed under GPL-3.0. | **Layout and UX inspiration only.** No code, styling, or assets are copied or linked, ensuring complete isolation from copyleft contagion. | All JavaScript/React source code, server files, and stylesheet definitions. |
| **`VforVitorio/F1-StratLab`** | Apache License 2.0 | Permissive; requires attribution. | Strategy modeling ideas: tyre degradation curves, pit window calculations, undercut/overcut estimation logic. Rebuilt as client-side TypeScript calculations. | Python Flask backend, machine learning notebooks, server dependencies. |
| **`benjamack/DataScience`** | All Rights Reserved (Default GitHub) | No open source license provided; viewable on GitHub for educational purposes. | Algorithmic inspiration only: weighting of grid position, historical circuit deltas, and qualifying pace for race result predictions. Reimplemented as custom TypeScript heuristics. | Python scripts (`prediction1.py`, `prediction2.py`), model artifacts, notebooks. |
| **`hetanjali/F1-RACE-PREDICTOR`** | All Rights Reserved (Default GitHub) | No open source license provided; viewable on GitHub for educational purposes. | Feature engineering concepts: cumulative points, grid starting slot, and recent form weighting for predicting Top-3 podium probability. Reimplemented cleanly in TypeScript. | Streamlit application, trained scikit-learn models (`.pkl`), Python notebooks. |
| **`nextjs/saas-starter`** | MIT License | Permissive; free use with attribution notice. | Next.js App Router SaaS structure, responsive layout shells, clean navigation patterns, and modern dashboard route hierarchy. | Stripe integration, Prisma, Drizzle, PostgreSQL database, Auth.js, and server-side session management. |
| **`mickasmt/next-saas-stripe-starter`** | MIT License | Permissive; free use with attribution notice. | SaaS UI components: landing page hero, feature grids, pricing cards, FAQ accordion, user menu dropdown, and gated Pro feature wrapper design. | Stripe webhooks, Stripe checkout, Resend email workflows, Prisma ORM, and NextAuth. |

---

### Strict Separation and Compliance Summary
1. **Zero Contamination**: Monaco (GPL-3.0) and un-licensed machine learning repositories have zero copied code. Only public domain Formula 1 mathematical concepts and high-level layout wireframes are used.
2. **Independent Client-Side Architecture**: All API clients (`/lib/api/jolpica.ts`, `/lib/api/openf1.ts`) and strategy/prediction calculators (`/lib/prediction.ts`, `/lib/strategy.ts`) are authored from scratch in clean TypeScript.
3. **Billing & Auth Replacement**: All Stripe, Prisma, Drizzle, and NextAuth code from SaaS starters is completely excluded, replaced by a pure client-side Firebase Auth + Firestore setup with a single webhook route handler (`/api/dodo/webhook`) for Dodo Payments.

