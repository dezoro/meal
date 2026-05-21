/**
 * Date utility functions for Korea Standard Time (KST - Asia/Seoul)
 */

export function getTodayKST(): Date {
  const now = new Date();
  // Calculate KST time by adjusting UTC time with South Korea's UTC+9 offset.
  // To avoid local browser/server timezone shifts, we build a Date object representing the KST time values as its UTC values.
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  const kstOffset = 9 * 60 * 60 * 1000;
  return new Date(utcTime + kstOffset);
}

export function formatKoreanDate(date: Date): string {
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const dayOfWeek = days[date.getUTCDay()];
  return `${month}월 ${day}일 ${dayOfWeek}`;
}

export function formatDateKey(date: Date): string {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

export function getWeekDates(date: Date): Date[] {
  const day = date.getUTCDay();
  // Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6, Sun=0
  // Calculate difference to Monday
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const mondayTime = date.getTime() + (diffToMonday * 24 * 60 * 60 * 1000);
  
  const dates: Date[] = [];
  for (let i = 0; i < 5; i++) {
    dates.push(new Date(mondayTime + (i * 24 * 60 * 60 * 1000)));
  }
  return dates;
}

export interface WeekOfMonthResult {
  month: number;
  week: number;
}

export function getWeekOfMonth(date: Date): WeekOfMonthResult {
  const dateNum = date.getUTCDate();
  const year = date.getUTCFullYear();
  const monthIndex = date.getUTCMonth();

  const firstDay = new Date(Date.UTC(year, monthIndex, 1));
  const firstDayOfWeek = firstDay.getUTCDay(); // 0 indicates Sunday

  // Monday = 0, Tuesday = 1, ... Sunday = 6
  const adjustedFirstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  const week = Math.ceil((dateNum + adjustedFirstDayOfWeek) / 7);

  return {
    month: monthIndex + 1,
    week
  };
}

export function getDefaultSelectedDate(today: Date): Date {
  const day = today.getUTCDay();
  // 0 is Sunday, 6 is Saturday
  if (day === 6) {
    // Return Next Monday (today + 2 days)
    return new Date(today.getTime() + (2 * 24 * 60 * 60 * 1000));
  } else if (day === 0) {
    // Return Next Monday (today + 1 day)
    return new Date(today.getTime() + (1 * 24 * 60 * 60 * 1000));
  }
  return today;
}

export function getKoreanDayOfWeek(date: Date): string {
  const dayMap = ['일', '월', '화', '수', '목', '금', '토'];
  return dayMap[date.getUTCDay()];
}
