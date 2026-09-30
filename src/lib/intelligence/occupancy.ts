import { CrowdLevel } from '@/types';

/**
 * Calculates percentage of current occupancy.
 */
export function calculateOccupancyPercentage(occupied: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((occupied / total) * 100));
}

/**
 * Derives crowd severity tier:
 * - Low: < 50%
 * - Medium: 50% - 80%
 * - High: > 80%
 */
export function getCrowdLevelFromOccupancy(occupancyRate: number): CrowdLevel {
  if (occupancyRate < 50) return 'low';
  if (occupancyRate <= 80) return 'medium';
  return 'high';
}

/**
 * Estimates the wait time until the next seat frees up (e.g. for library or canteen seating).
 * Uses a Poisson-distribution-inspired turnover approximation.
 */
export function estimateNextAvailableSeatTime(
  occupied: number,
  total: number,
  avgStayMinutes: number = 45
): number {
  const available = total - occupied;
  if (available > 0) return 0; // immediate seating available

  // If completely full, estimate when at least one seat frees up based on average duration
  // Turnover rate = total / avgStayMinutes seats per minute
  const turnoverPerMinute = total / avgStayMinutes;
  const estimatedWait = Math.ceil(1 / Math.max(turnoverPerMinute, 0.1));
  return Math.min(estimatedWait, 25);
}
