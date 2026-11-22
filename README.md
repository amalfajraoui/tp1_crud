# TP1 CRUD - Full-Stack DevOps Project

Application Full-Stack conteneurisée avec Docker Compose dans un environnement WSL2.

## Architecture & Technologies
- **Frontend :** React + Vite (`http://localhost:5173`)
- **Backend :** FastAPI + Python (`http://localhost:8000`, Swagger UI sur `/docs`)
- **Base de données :** PostgreSQL 17 (`postgres:17-alpine`) avec persistance via le volume `pgdata`

## Lancement du projet
`docker compose up -d`

## Arrêt du projet
`docker compose down`
## Collaboration Git
Workflow collaboratif avec branches dédiées et Pull Requests révisées avant fusion sur `main`.
