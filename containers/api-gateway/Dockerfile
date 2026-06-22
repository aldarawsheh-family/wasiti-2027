# ══════════════════════════════════════════════════
# WASITI 2027 — API Gateway Dockerfile
# ══════════════════════════════════════════════════

FROM nginx:alpine

# ── حذف الإعدادات الافتراضية ──
RUN rm /etc/nginx/conf.d/default.conf

# ── نسخ إعداداتنا ──
COPY nginx.conf /etc/nginx/nginx.conf

# ── المنافذ ──
EXPOSE 80 443

# ── تشغيل Nginx ──
CMD ["nginx", "-g", "daemon off;"]