/**
 * Calculates estimated wait time (ETA) for a queue token.
 * @param queuePosition 1-indexed position in queue (1 = next to be served)
 * @param avgServiceMinutes Average time spent per token
 * @param activeCounters Number of open service desks
 */
export function calculateQueueETA(
  queuePosition: number,
  avgServiceMinutes: number = 8,
  activeCounters: number = 2
): number {
  if (queuePosition <= 0) return 0;
  const effectiveCounters = Math.max(1, activeCounters);
  // Integer ceiling of (position / counters) * avgServiceMinutes
  return Math.ceil((queuePosition / effectiveCounters) * avgServiceMinutes);
}

/**
 * Checks load capacity of a pickup slot.
 * Capped at 40-45 orders per 10-minute window to prevent kitchen bottleneck.
 */
export function checkSlotCapacity(currentOrders: number, maxCapacity: number = 45): {
  status: 'available' | 'almost_full' | 'full';
  remaining: number;
  occupancyPercent: number;
} {
  const remaining = Math.max(0, maxCapacity - currentOrders);
  const occupancyPercent = Math.round((currentOrders / maxCapacity) * 100);

  if (remaining === 0) {
    return { status: 'full', remaining: 0, occupancyPercent: 100 };
  }
  if (occupancyPercent >= 80) {
    return { status: 'almost_full', remaining, occupancyPercent };
  }
  return { status: 'available', remaining, occupancyPercent };
}

/**
 * Generates human-friendly sequential order IDs (e.g. #CF-4081)
 */
export function generateOrderNumber(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CF-${randomSuffix}`;
}

/**
 * Generates human-friendly service token (e.g. A-105, F-203)
 */
export function generateTokenCode(prefix: 'A' | 'F' | 'L', counter: number): string {
  return `${prefix}-${100 + (counter % 900)}`;
}
