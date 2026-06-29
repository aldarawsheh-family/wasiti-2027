// WASITI 2027 - Listing Status Machine

export const LISTING_STATUS = {
  ACTIVE: 'ACTIVE',
  RESERVED: 'RESERVED',
  SOLD: 'SOLD',
  CANCELLED: 'CANCELLED',
} as const;

export type ListingStatus = (typeof LISTING_STATUS)[keyof typeof LISTING_STATUS];

const ALLOWED_TRANSITIONS: Record<ListingStatus, ListingStatus[]> = {
  ACTIVE: [LISTING_STATUS.RESERVED, LISTING_STATUS.CANCELLED],
  RESERVED: [LISTING_STATUS.SOLD, LISTING_STATUS.CANCELLED],
  SOLD: [],
  CANCELLED: [],
};

export function canTransition(from: ListingStatus, to: ListingStatus): boolean {
  const allowed = ALLOWED_TRANSITIONS[from];
  if (!allowed) return false;
  return allowed.includes(to);
}

export function transition(from: ListingStatus, to: ListingStatus): ListingStatus {
  if (!canTransition(from, to)) {
    throw new Error(`Invalid status transition: ${from} -> ${to}`);
  }
  return to;
}
