import { ClassTimeAnalysisResult, MenuItem } from '@/types';

interface ClassTimeAnalysisInput {
  targetClassTime: string; // e.g. "13:30" or "01:30 PM"
  items: Array<{ item: MenuItem; quantity: number }>;
  currentQueueWaitMinutes: number; // e.g. 10
  walkingMinutes?: number; // default 5 mins across campus
  isDineIn?: boolean; // if false, takeaway eating time is reduced
}

/**
 * Parses user-entered class time (e.g., "13:30", "1:30 PM", "14:00") into minutes from midnight today.
 */
export function parseTimeToMinutesFromMidnight(timeStr: string): number | null {
  if (!timeStr) return null;

  const cleaned = timeStr.trim().toLowerCase();
  const isPM = cleaned.includes('pm');
  const isAM = cleaned.includes('am');

  const match = cleaned.replace(/[^0-9:]/g, '').split(':');
  if (match.length < 2) return null;

  let hours = parseInt(match[0], 10);
  const minutes = parseInt(match[1], 10);

  if (isNaN(hours) || isNaN(minutes) || minutes < 0 || minutes > 59) return null;

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/**
 * Flags hero feature: "Can I make it to class?"
 * Calculates: order prep + pickup wait + eating time + walking time
 */
export function analyzeCanIMakeItToClass({
  targetClassTime,
  items,
  currentQueueWaitMinutes = 8,
  walkingMinutes = 5,
  isDineIn = true,
}: ClassTimeAnalysisInput): ClassTimeAnalysisResult {
  // 1. Calculate prep time
  // System takes the max prep time of selected items (since cooks prepare in parallel) + 1.5 min per extra item
  const maxItemPrepTime = items.reduce(
    (max, i) => Math.max(max, i.item.prep_time_minutes || 8),
    items.length > 0 ? 0 : 5
  );
  const totalItemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const prepTime = Math.max(5, maxItemPrepTime + Math.max(0, totalItemCount - 1) * 1.5);

  // 2. Pickup wait (queue wait at counter)
  const pickupQueueWait = Math.max(3, currentQueueWaitMinutes);

  // 3. Eating time:
  // Quick items (drinks/sandwiches/snacks) take ~6-8 mins. Full meals take ~15-18 mins.
  const hasOnlyQuickItems =
    items.length > 0 && items.every((i) => i.item.quick_item);
  let diningTime = 12;
  if (!isDineIn) {
    diningTime = 4; // Takeaway / grab & go
  } else if (hasOnlyQuickItems) {
    diningTime = 7;
  } else if (totalItemCount >= 3) {
    diningTime = 18;
  }

  // 4. Campus walk buffer
  const walkingTime = Math.max(3, walkingMinutes);

  // Total required minutes
  const totalTimeMinutes = Math.round(
    prepTime + pickupQueueWait + diningTime + walkingTime
  );

  // Available minutes until target class
  const now = new Date();
  const currentMinutesFromMidnight = now.getHours() * 60 + now.getMinutes();
  const classMinutes = parseTimeToMinutesFromMidnight(targetClassTime);

  let availableMinutes = 45; // default fallback if unparseable
  if (classMinutes !== null) {
    let diff = classMinutes - currentMinutesFromMidnight;
    if (diff < 0) {
      // If class time entered is earlier than now, assume it's next cycle/pm or tomorrow
      diff += 24 * 60;
    }
    availableMinutes = diff;
  }

  const marginMinutes = availableMinutes - totalTimeMinutes;

  let verdict: 'SAFE' | 'TIGHT' | 'NOT SAFE';
  let recommendation: string;
  let quickAction: ClassTimeAnalysisResult['quickAction'];

  if (marginMinutes >= 15) {
    verdict = 'SAFE';
    recommendation = `Plenty of time! You'll arrive ~${marginMinutes} minutes before your class begins. Sit back and enjoy your meal comfortably.`;
  } else if (marginMinutes >= 0) {
    verdict = 'TIGHT';
    recommendation = `You have a tight ${marginMinutes}-min buffer. We recommend packing as takeaway or opting for express counter pickup.`;
    quickAction = {
      type: 'CHANGE_SLOT',
      label: 'Select Express Takeaway',
    };
  } else {
    verdict = 'NOT SAFE';
    recommendation = `You are likely to be ${Math.abs(marginMinutes)} minutes late! Switch to an Express Quick Item (e.g. Panini or Cold Brew) or pick an after-class slot.`;
    quickAction = {
      type: 'QUICK_MEAL',
      label: 'Filter Quick Meals (< 6 min prep)',
    };
  }

  return {
    verdict,
    totalTimeMinutes,
    availableMinutes,
    marginMinutes,
    breakdown: {
      prepTime: Math.round(prepTime),
      pickupQueueWait: Math.round(pickupQueueWait),
      diningTime: Math.round(diningTime),
      walkingTime: Math.round(walkingTime),
    },
    recommendation,
    quickAction,
  };
}
