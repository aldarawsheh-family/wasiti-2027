# ══════════════════════════════════════════════════
# WASITI 2027 — Auth Service Dockerfile
# ══════════════════════════════════════════════════

FROM node:20-alpine

WORKDIR /app

# ── نسخ ملفات التبعيات ──
COPY package.json package-lock.json* ./

# ── تثبيت التبعيات ──
RUN npm ci --only=production

# ── نسخ الكود ──
COPY . .

# ── بناء TypeScript ──
RUN npm run build

# ── المنفذ ──
EXPOSE 3000

# ── تشغيل ──
CMD ["node", "dist/main.js"]