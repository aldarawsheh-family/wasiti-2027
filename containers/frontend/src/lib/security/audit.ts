// WASITI 2027 — دوال سجل التدقيق (Audit Log)
// المسار: src/lib/security/audit.ts

// تعريف نوع سجل التدقيق
export interface AuditEntry {
  id: string;
  userId: string;
  action: string;
  details: Record<string, any>;
  timestamp: string;
}

// مفتاح التخزين في localStorage
const AUDIT_STORAGE_KEY = 'wasiti_audit_logs';

// --- الحصول على سجلات التدقيق من التخزين ---
const getStoredLogs = (): AuditEntry[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(AUDIT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('فشل قراءة سجلات التدقيق:', error);
    return [];
  }
};

// --- حفظ سجلات التدقيق إلى التخزين ---
const saveStoredLogs = (logs: AuditEntry[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('فشل حفظ سجلات التدقيق:', error);
  }
};

// --- تسجيل إجراء جديد ---
export const logAction = (
  userId: string,
  action: string,
  details: Record<string, any> = {}
): AuditEntry => {
  const entry: AuditEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    userId,
    action,
    details,
    timestamp: new Date().toISOString(),
  };

  // تسجيل في التيرمينال (للتطوير)
  console.log(`[AUDIT] ${entry.timestamp} - User: ${userId} - Action: ${action}`, details);

  // حفظ في التخزين المحلي
  const logs = getStoredLogs();
  logs.push(entry);
  saveStoredLogs(logs);

  return entry;
};

// --- جلب سجلات التدقيق لمستخدم معين ---
export const getAuditLogs = (userId?: string): AuditEntry[] => {
  const logs = getStoredLogs();
  if (userId) {
    return logs.filter((log) => log.userId === userId);
  }
  return logs;
};

// --- مسح جميع سجلات التدقيق ---
export const clearAuditLogs = (userId?: string): void => {
  const logs = getStoredLogs();
  if (userId) {
    const filtered = logs.filter((log) => log.userId !== userId);
    saveStoredLogs(filtered);
    console.log(`[AUDIT] تم مسح سجلات المستخدم: ${userId}`);
  } else {
    saveStoredLogs([]);
    console.log('[AUDIT] تم مسح جميع سجلات التدقيق');
  }
};