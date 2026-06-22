# ══════════════════════════════════════════════════
# WASITI 2027 — AI Service Dockerfile
# ══════════════════════════════════════════════════

FROM python:3.11-slim

WORKDIR /app

# ── تثبيت التبعيات ──
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ── نسخ الكود ──
COPY src/ ./src/

# ── المنفذ ──
EXPOSE 8000

# ── تشغيل ──
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]