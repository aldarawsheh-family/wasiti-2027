# ══════════════════════════════════════════════════
# WASITI 2027 — Makefile
# ══════════════════════════════════════════════════

.PHONY: up down restart logs clean build ps

# ── تشغيل كل الحاويات ──
up:
	docker-compose up -d

# ── إيقاف كل الحاويات ──
down:
	docker-compose down

# ── إعادة تشغيل ──
restart:
	docker-compose down && docker-compose up -d

# ── عرض السجلات ──
logs:
	docker-compose logs -f

# ── تنظيف كل شيء ──
clean:
	docker-compose down -v
	docker system prune -f

# ── بناء الصور ──
build:
	docker-compose build

# ── عرض الحاويات العاملة ──
ps:
	docker-compose ps

# ── الدخول لقاعدة البيانات ──
db:
	docker exec -it wasity-postgres psql -U wasity -d wasity

# ── الدخول لـ Redis ──
redis:
	docker exec -it wasity-redis redis-cli

# ── إعادة بناء حاوية واحدة ──
rebuild-gateway:
	docker-compose build api-gateway && docker-compose up -d api-gateway

rebuild-auth:
	docker-compose build auth-service && docker-compose up -d auth-service

rebuild-listings:
	docker-compose build listings-service && docker-compose up -d listings-service

rebuild-frontend:
	docker-compose build frontend && docker-compose up -d frontend