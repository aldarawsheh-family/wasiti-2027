#!/bin/bash
# WASITI 2027 — Restore Script
# المسار: infra/backup/restore.sh

# ==========================================================
# إعدادات المتغيرات
# ==========================================================
BACKUP_DIR="/var/backups/wasiti"

# إعدادات PostgreSQL
PG_HOST="localhost"
PG_PORT="5432"
PG_DB="wasiti_db"
PG_USER="wasiti_user"
PG_PASSWORD="wasiti_password"

# إعدادات MinIO
MINIO_ENDPOINT="http://localhost:9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_BUCKET="wasiti-assets"

# ==========================================================
# التحقق من المدخلات
# ==========================================================
if [ -z "$1" ]; then
  echo "[ERROR] Please specify the backup file to restore."
  echo "Usage: $0 <backup_file_name>"
  echo "Example: $0 wasiti_backup_2025-01-15_14-30-00.tar.gz"
  echo "Available backups:"
  ls -lh ${BACKUP_DIR}/*.tar.gz | awk '{print $9}' | xargs -n1 basename
  exit 1
fi

BACKUP_FILE="$1"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_FILE}"

if [ ! -f "${BACKUP_PATH}" ]; then
  echo "[ERROR] Backup file not found: ${BACKUP_PATH}"
  exit 1
fi

# استخراج اسم المجلد المؤقت من اسم الملف
BACKUP_NAME=$(basename "${BACKUP_FILE}" .tar.gz)

# ==========================================================
# 1. فك الضغط
# ==========================================================
echo "[INFO] Extracting backup: ${BACKUP_FILE}"
mkdir -p ${BACKUP_DIR}/${BACKUP_NAME}
tar -xzf ${BACKUP_PATH} -C ${BACKUP_DIR} || {
  echo "[ERROR] Failed to extract backup"
  exit 1
}

echo "[SUCCESS] Backup extracted to: ${BACKUP_DIR}/${BACKUP_NAME}"

# ==========================================================
# 2. استعادة قاعدة بيانات PostgreSQL
# ==========================================================
echo "[INFO] Restoring PostgreSQL database..."

POSTGRES_BACKUP="${BACKUP_DIR}/${BACKUP_NAME}/postgresql.backup"

if [ ! -f "${POSTGRES_BACKUP}" ]; then
  echo "[ERROR] PostgreSQL backup not found: ${POSTGRES_BACKUP}"
  exit 1
fi

export PGPASSWORD=${PG_PASSWORD}
pg_restore -h ${PG_HOST} -p ${PG_PORT} -U ${PG_USER} -d ${PG_DB} \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  --jobs=4 \
  ${POSTGRES_BACKUP} || {
  echo "[ERROR] PostgreSQL restore failed"
  exit 1
}

echo "[SUCCESS] PostgreSQL restore completed"

# ==========================================================
# 3. استعادة صور MinIO
# ==========================================================
echo "[INFO] Restoring MinIO backup..."

MINIO_BACKUP="${BACKUP_DIR}/${BACKUP_NAME}/minio"

if [ ! -d "${MINIO_BACKUP}" ]; then
  echo "[WARNING] MinIO backup not found: ${MINIO_BACKUP}"
  echo "[WARNING] Skipping MinIO restore"
else
  # استخدام mc client لاستعادة الصور
  mc alias set wasiti-minio ${MINIO_ENDPOINT} ${MINIO_ACCESS_KEY} ${MINIO_SECRET_KEY} || {
    echo "[ERROR] Failed to configure MinIO client"
    exit 1
  }

  mc mirror --overwrite ${MINIO_BACKUP} wasiti-minio/${MINIO_BUCKET} || {
    echo "[ERROR] MinIO restore failed"
    exit 1
  }

  echo "[SUCCESS] MinIO restore completed"
fi

# ==========================================================
# 4. تنظيف المجلد المؤقت
# ==========================================================
echo "[INFO] Cleaning up temporary files..."
rm -rf ${BACKUP_DIR}/${BACKUP_NAME}

echo "[SUCCESS] Cleanup completed"

# ==========================================================
# 5. تسجيل العملية
# ==========================================================
LOG_FILE="${BACKUP_DIR}/restore.log"
echo "----------------------------------------" >> ${LOG_FILE}
echo "Restore Date: $(date +'%Y-%m-%d %H:%M:%S')" >> ${LOG_FILE}
echo "Restored Backup: ${BACKUP_FILE}" >> ${LOG_FILE}
echo "Restored Path: ${BACKUP_DIR}/${BACKUP_NAME}" >> ${LOG_FILE}
echo "Status: SUCCESS" >> ${LOG_FILE}
echo "----------------------------------------" >> ${LOG_FILE}

echo "[SUCCESS] Restore completed successfully!"
echo "Restored from: ${BACKUP_PATH}"