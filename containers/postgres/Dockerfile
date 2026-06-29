# ══════════════════════════════════════════════════
# WASITI 2027 — PostgreSQL Dockerfile
# ══════════════════════════════════════════════════

FROM postgres:16

# ── تثبيت PostGIS فقط ──
RUN apt-get update && apt-get install -y \
    postgresql-16-postgis-3 \
    postgresql-16-postgis-3-scripts \
    && rm -rf /var/lib/apt/lists/*

# ── نسخ ملفات التهيئة ──
COPY . . ./init/ /docker-entrypoint-initdb.d/

EXPOSE 5432

CMD ["postgres"]