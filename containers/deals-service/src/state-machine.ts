// ══════════════════════════════════════════════════
// WASITI 2027 — Deals Service — State Machine
// ══════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';

interface DealState {
  status: string;
  buyer_id: string;
  seller_id: string;
}

const VALID_TRANSITIONS: Record<string, string[]> = {
  'PENDING':      ['ACCEPTED', 'CANCELLED'],
  'ACCEPTED':     ['IN_PROGRESS', 'CANCELLED'],
  'IN_PROGRESS':  ['COMPLETED', 'CANCELLED', 'DISPUTED'],
  'DISPUTED':     ['IN_PROGRESS', 'CANCELLED', 'COMPLETED'],
  'COMPLETED':    [],
  'CANCELLED':    [],
};

@Injectable()
export class StateMachine {
  canTransition(fromStatus: string, toStatus: string, deal: DealState, userId: string): boolean {
    const allowed = VALID_TRANSITIONS[fromStatus];
    if (!allowed || !allowed.includes(toStatus)) return false;

    // buyer يمكنه الإلغاء فقط
    if (userId === deal.buyer_id && toStatus === 'CANCELLED') return true;

    // seller يمكنه Accept, Progress, Complete, Cancel
    if (userId === deal.seller_id) return true;

    return false;
  }

  getNextStates(currentStatus: string): string[] {
    return VALID_TRANSITIONS[currentStatus] || [];
  }
}