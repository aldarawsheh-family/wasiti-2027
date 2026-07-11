# ══════════════════════════════════════════════════
FROM python:3.11-slim

WORKDIR /app

# ── تثبيت wget للـ health check ──
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

# ── تحديث pip ──
RUN pip install --upgrade pip

# ── تثبيت التبعيات ──
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ── نسخ الكود ──
COPY src/ ./src/

# ── المنفذ ──
EXPOSE 8000

# ── تشغيل ──
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]