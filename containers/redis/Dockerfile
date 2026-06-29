# ══════════════════════════════════════════════════
# WASITI 2027 — Redis Dockerfile
# ══════════════════════════════════════════════════

FROM redis:7-alpine

# ── نسخ ملف الإعدادات ──
COPY . . redis.conf /usr/local/etc/redis/redis.conf

# ── تشغيل Redis بالإعدادات المخصصة ──
CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]

# ── المنفذ ──
EXPOSE 6379

