# Indive — Minimal MVP Scaffold

This repository contains a minimal scaffold for an Indrive/Uber Eats-like platform: frontend (Next.js), backend (NestJS + Prisma), basic infra (docker-compose) and seed data.

Structure (minimal):
- backend/  (NestJS + Prisma)
- frontend/ (Next.js)

Quickstart (development, minimal):
1. Install Docker and Node 18+.
2. Start DB & Redis:
   - docker compose -f backend/docker-compose.dev.yml up -d
3. Backend:
   - cd backend
   - npm install
   - npx prisma generate
   - npx prisma migrate dev --name init
   - npm run seed
   - npm run start:dev
4. Frontend:
   - cd frontend
   - yarn install
   - yarn dev

.env placeholders are provided in each workspace.
