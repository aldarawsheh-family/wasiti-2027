// ══════════════════════════════════════════════════
// WASITI 2027 — Shared — Constants
// ══════════════════════════════════════════════════

export const APP_NAME = 'وسيطي';
export const APP_NAME_EN = 'Wasity';
export const APP_VERSION = '2027.1.0';

export const ROLES = {
  USER: 'USER',
  SELLER: 'SELLER',
  COMPANY_ADMIN: 'COMPANY_ADMIN',
  PLATFORM_ADMIN: 'PLATFORM_ADMIN',
} as const;

export const TENANT_TYPES = {
  INDIVIDUAL: 'INDIVIDUAL',
  COMPANY: 'COMPANY',
  MARKETPLACE: 'MARKETPLACE',
} as const;

export const LISTING_STATUSES = {
  ACTIVE: 'ACTIVE',
  SOLD: 'SOLD',
  EXPIRED: 'EXPIRED',
  DRAFT: 'DRAFT',
  SUSPENDED: 'SUSPENDED',
  DELETED: 'DELETED',
} as const;

export const DEAL_STATUSES = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  DISPUTED: 'DISPUTED',
} as const;

export const BOOKING_STATUSES = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CHECKED_IN: 'CHECKED_IN',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW',
  REFUNDED: 'REFUNDED',
} as const;

export const TRANSPORT_TYPES = {
  BUS: 'BUS',
  MINIBUS: 'MINIBUS',
  VAN: 'VAN',
  TAXI: 'TAXI',
  TRUCK: 'TRUCK',
  SHIPPING: 'SHIPPING',
} as const;

export const TRIP_STATUSES = {
  SCHEDULED: 'SCHEDULED',
  BOARDING: 'BOARDING',
  DEPARTED: 'DEPARTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const MAX_IMAGES_PER_LISTING = 50;
export const MAX_FILE_SIZE_MB = 10;
export const MAX_MESSAGE_LENGTH = 2000;
export const MAX_LISTINGS_PER_PAGE = 100;
export const DEFAULT_LISTINGS_PER_PAGE = 20;