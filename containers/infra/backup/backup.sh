#!/bin/bash
# WASITI 2027 — Backup Script
# المسار: infra/backup/backup.sh

# ==========================================================
# إعدادات المتغيرات
# ==========================================================
BACKUP_DIR="/var/backups/wasiti"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_NAME="wasiti_backup_${DATE}"

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

# إعدادات التخزين
RETENTION_DAYS=30

# ==========================================================
# إنشاء مجلد النسخ الاحتياطي
# ==========================================================
mkdir -p ${BACKUP_DIR}
echo "[INFO] Creating backup directory: ${BACKUP_DIR}/${BACKUP_NAME}"
mkdir -p ${BACKUP_DIR}/${BACKUP_NAME}

# ==========================================================
# 1. نسخ قاعدة بيانات PostgreSQL
# ==========================================================
echo "[INFO] Starting PostgreSQL backup..."
export PGPASSWORD=${PG_PASSWORD}
pg_dump -h ${PG_HOST} -p ${PG_PORT} -U ${PG_USER} -d ${PG_DB} \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  --format=custom \
  --file=${BACKUP_DIR}/${BACKUP_NAME}/postgresql.backup

if [ $? -eq 0 ]; then
  echo "[SUCCESS] PostgreSQL backup completed: ${BACKUP_DIR}/${BACKUP_NAME}/postgresql.backup"
else
  echo "[ERROR] PostgreSQL backup failed"
  exit 1
fi

# ==========================================================
# 2. نسخ صور MinIO
# ==========================================================
echo "[INFO] Starting MinIO backup..."

# استخدام mc client للحصول على النسخة
# تم تثبيته مسبقاً عبر Docker أو apt-get
mc alias set wasiti-minio ${MINIO_ENDPOINT} ${MINIO_ACCESS_KEY} ${MINIO_SECRET_KEY}
mc mirror wasiti-minio/${MINIO_BUCKET} ${BACKUP_DIR}/${BACKUP_NAME}/minio/

if [ $? -eq 0 ]; then
  echo "[SUCCESS] MinIO backup completed: ${BACKUP_DIR}/${BACKUP_NAME}/minio/"
else
  echo "[ERROR] MinIO backup failed"
  exit 1
fi

# ==========================================================
# 3. ضغط النسخة الاحتياطية
# ==========================================================
echo "[INFO] Compressing backup..."
tar -czf ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz -C ${BACKUP_DIR} ${BACKUP_NAME}

if [ $? -eq 0 ]; then
  echo "[SUCCESS] Compression completed: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
else
  echo "[ERROR] Compression failed"
  exit 1
fi

# ==========================================================
# 4. تنظيف النسخ القديمة
# ==========================================================
echo "[INFO] Cleaning old backups (older than ${RETENTION_DAYS} days)..."
find ${BACKUP_DIR} -name "wasiti_backup_*.tar.gz" -type f -mtime +${RETENTION_DAYS} -delete

# حذف المجلدات غير المضغوطة
find ${BACKUP_DIR} -maxdepth 1 -type d -name "wasiti_backup_*" -mtime +${RETENTION_DAYS} -exec rm -rf {} \;

echo "[INFO] Cleanup completed."

# ==========================================================
# 5. تحديث السجل
# ==========================================================
echo "[INFO] Writing log entry..."
LOG_FILE="${BACKUP_DIR}/backup.log"
echo "----------------------------------------" >> ${LOG_FILE}
echo "Backup Date: ${DATE}" >> ${LOG_FILE}
echo "Backup Size: $(du -h ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz | cut -f1)" >> ${LOG_FILE}
echo "Backup Path: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" >> ${LOG_FILE}
echo "Status: SUCCESS" >> ${LOG_FILE}
echo "----------------------------------------" >> ${LOG_FILE}

echo "[SUCCESS] Backup completed successfully!"
echo "Backup file: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
echo "Log file: ${LOG_FILE}"