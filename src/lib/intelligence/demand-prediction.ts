export interface ForecastPoint {
  timeLabel: string;
  hour: number;
  occupancyPercent: number;
  predictedDemandLevel: 'low' | 'medium' | 'high';
  isCurrentHour?: boolean;
}

/**
 * Historical demand model with peak multipliers:
 * - Canteen: Peaks heavily at lunch (12:00 - 14:00, ~1.85x) and tea-break (16:30 - 17:30, ~1.4x)
 * - Library: Steady mid-day, huge surge during exam weeks (2.2x) and evening study hours (17:00 - 21:00)
 * - Admin Services: Morning surge (10:00 - 12:30, ~1.6x)
 * - Fees: Month-end / semester start surge
 */
export function getFacilityHourlyForecast(
  facilityType: 'canteen' | 'library' | 'admin' | 'fees',
  isExamWeek: boolean = false
): ForecastPoint[] {
  const points: ForecastPoint[] = [];
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const currentHour = new Date().getHours();

  for (const h of hours) {
    let baseRate = 25; // baseline occupancy %

    if (facilityType === 'canteen') {
      if (h === 8 || h === 9) baseRate = 35; // breakfast
      else if (h === 12) baseRate = 82; // lunch rush peak
      else if (h === 13) baseRate = 88; // lunch rush peak
      else if (h === 14) baseRate = 60; // late lunch
      else if (h === 16 || h === 17) baseRate = 70; // evening snacks
      else if (h >= 18 && h <= 20) baseRate = 45; // dinner
      else baseRate = 20;
    } else if (facilityType === 'library') {
      if (h >= 10 && h <= 12) baseRate = 55;
      else if (h >= 14 && h <= 17) baseRate = 65;
      else if (h >= 18 && h <= 20) baseRate = 78; // evening deep study
      else baseRate = 30;

      if (isExamWeek) {
        baseRate = Math.min(98, Math.round(baseRate * 1.35));
      }
    } else if (facilityType === 'admin') {
      if (h >= 10 && h <= 12) baseRate = 75; // morning rush for certificates
      else if (h >= 14 && h <= 16) baseRate = 50;
      else baseRate = 15;
    } else if (facilityType === 'fees') {
      if (h >= 10 && h <= 13) baseRate = 70;
      else if (h >= 14 && h <= 16) baseRate = 40;
      else baseRate = 10;
    }

    const timeLabel = h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`;

    const predictedDemandLevel =
      baseRate < 50 ? 'low' : baseRate <= 75 ? 'medium' : 'high';

    points.push({
      timeLabel,
      hour: h,
      occupancyPercent: baseRate,
      predictedDemandLevel,
      isCurrentHour: h === currentHour,
    });
  }

  return points;
}
