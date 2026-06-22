# ══════════════════════════════════════════════════
# WASITI 2027 — MinIO Dockerfile
# ══════════════════════════════════════════════════

FROM minio/minio:latest

# ── المنافذ ──
EXPOSE 9000 9001

# ── تشغيل MinIO مع الكونسول ──
CMD ["server", "/data", "--console-address", ":9001"]