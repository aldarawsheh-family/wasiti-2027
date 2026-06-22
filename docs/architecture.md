# WASITI 2027 — Architecture

## Overview
Wasity is a Multi-Tenant SaaS Marketplace Operating System.

## Containers (13)
- api-gateway (Nginx)
- auth-service (NestJS)
- user-service (NestJS)
- company-service (NestJS)
- listings-service (NestJS)
- chat-service (NestJS + WebSocket)
- deals-service (NestJS)
- notification-service (NestJS)
- ai-service (Python/FastAPI)
- frontend (Next.js)
- postgres (PostgreSQL 16)
- redis (Redis 7)
- minio (MinIO)

## Data Flow
Client → Gateway → Service → PostgreSQL/Redis/MinIO