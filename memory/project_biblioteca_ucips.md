---
name: Biblioteca UCIPS — Stack Migration
description: Migration from PHP/MySQL to Vite+React+FastAPI+Firebase for Universidad de Ciencias Policiales
type: project
---

Full-stack migration of the UCIPS Digital Library. Deployed on shared VPS 161.97.92.90.

**Stack:**
- Frontend: Vite + React + TypeScript + Tailwind CSS (port 8320)
- Backend: FastAPI + SQLAlchemy async + MySQL (port 8220)
- Auth: Firebase Authentication (email/password + forgot password + admin roles)
- Proxy: Caddy (existing on VPS) — domain: biblioteca-161-97-92-90.sslip.io
- DB: MySQL 8 (host port 3316)

**Live URLs:**
- App: https://biblioteca-161-97-92-90.sslip.io
- API health: https://biblioteca-161-97-92-90.sslip.io/health
- GitHub: https://github.com/Alekla0126/biblioteca-ucips

**VPS paths:**
- Project: /opt/biblioteca/
- Firebase SA: /opt/biblioteca/firebase-service-account.json
- Backend env: /opt/biblioteca/.env.backend
- Caddyfile: /opt/ucips-opsboard/app/deploy/Caddyfile

**Why:** VPS has Caddy on ports 80/443 shared with other UCIPS projects. Ports 8220/8320/3316 are free.

**How to apply:** When working on this project, check existing port assignments on the VPS before adding new services. Use sslip.io subdomain pattern for HTTPS.

**PENDING — User must configure:**
1. Firebase project: create at console.firebase.google.com, enable Email/Password auth
2. Download service account JSON → /opt/biblioteca/firebase-service-account.json
3. Update /opt/biblioteca/.env.backend with real FIREBASE_PROJECT_ID
4. Rebuild backend: `cd /opt/biblioteca && docker compose build backend && docker compose up -d backend`
5. Set GitHub secrets: VITE_FIREBASE_* for CI/CD frontend builds
