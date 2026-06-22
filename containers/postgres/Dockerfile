# ══════════════════════════════════════════════════
# WASITI 2027 — PostgreSQL Dockerfile
# ══════════════════════════════════════════════════

FROM postgres:16

# ── تثبيت الإضافات المطلوبة ──
RUN apt-get update && apt-get install -y \
    postgresql-16-postgis-3 \
    postgresql-16-postgis-3-scripts \
    postgresql-16-pgtrgm \
    && rm -rf /var/lib/apt/lists/*

# ── نسخ ملفات التهيئة ──
COPY ./init/ /docker-entrypoint-initdb.d/

# ── جعل الملفات قابلة للتنفيذ ──
RUN chmod -R 755 /docker-entrypoint-initdb.d/

# ── المنفذ ──
EXPOSE 5432

# ── أمر التشغيل ──
CMD ["postgres"]