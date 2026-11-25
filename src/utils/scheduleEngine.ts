import {
  ContentFormat,
  ContentItem,
  DayOfWeek,
  OptimalityCheckResult,
  PerformanceMetrics,
  SocialPlatform,
} from '../types/content';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
  'Minggu',
];

export const TIME_WINDOWS: string[] = [
  '07:00 - 09:00',
  '11:30 - 13:30',
  '15:00 - 17:00',
  '19:00 - 21:00',
  '21:00 - 23:00',
];

export const PRESET_TIMES: string[] = [
  '08:00',
  '12:00',
  '16:00',
  '19:00',
  '20:00',
  '21:30',
];

export const PLATFORM_FORMATS: Record<SocialPlatform, ContentFormat[]> = {
  Instagram: ['Reels', 'Carousel', 'Foto', 'Story'],
  TikTok: ['Video', 'Reels', 'Foto', 'Story'],
  Facebook: ['Video', 'Foto', 'Carousel', 'Reels', 'Story'],
  YouTube: ['Video', 'Reels'],
};

export const PLATFORM_PEAK_DEFAULTS: Record<
  SocialPlatform,
  { days: DayOfWeek[]; windows: string[]; bestNote: string; peakHour: string }
> = {
  Instagram: {
    days: ['Selasa', 'Rabu', 'Kamis', 'Minggu'],
    windows: ['11:30 - 13:30', '19:00 - 21:00'],
    peakHour: '19:00 - 21:00',
    bestNote: 'Aktivitas tertinggi terjadi saat jam istirahat siang dan malam hari.',
  },
  TikTok: {
    days: ['Selasa', 'Kamis', 'Jumat', 'Sabtu'],
    windows: ['15:00 - 17:00', '19:00 - 21:00', '21:00 - 23:00'],
    peakHour: '19:00 - 21:00',
    bestNote: 'Konsumsi video pendek meningkat drastis pada sore hingga malam hari.',
  },
  Facebook: {
    days: ['Senin', 'Rabu', 'Jumat'],
    windows: ['07:00 - 09:00', '11:30 - 13:30'],
    peakHour: '11:30 - 13:30',
    bestNote: 'Puncak interaksi terjadi pada pagi sebelum aktivitas dan jam istirahat siang.',
  },
  YouTube: {
    days: ['Jumat', 'Sabtu', 'Minggu'],
    windows: ['15:00 - 17:00', '19:00 - 21:00'],
    peakHour: '19:00 - 21:00',
    bestNote: 'Penonton video berdurasi panjang paling aktif menjelang dan saat akhir pekan.',
  },
};

// Pink-family visual styling per platform (NO blue or purple!)
export const PLATFORM_PINK_STYLES: Record<
  SocialPlatform,
  {
    surface: string;
    border: string;
    text: string;
    swatch: string;
    label: string;
  }
> = {
  Instagram: {
    surface: 'bg-[#F8DCE8]',
    border: 'border-[#D98EAA]',
    text: 'text-[#39313A]',
    swatch: '#D98EAA',
    label: 'Dusty Rose',
  },
  TikTok: {
    surface: 'bg-[#39313A]',
    border: 'border-[#39313A]',
    text: 'text-white',
    swatch: '#39313A',
    label: 'Charcoal Rose',
  },
  Facebook: {
    surface: 'bg-[#F4BFD3]',
    border: 'border-[#C57292]',
    text: 'text-[#39313A]',
    swatch: '#F4BFD3',
    label: 'Baby Pink',
  },
  YouTube: {
    surface: 'bg-[#B55478]',
    border: 'border-[#963E60]',
    text: 'text-white',
    swatch: '#B55478',
    label: 'Deep Rose',
  },
};

export function getDayOfWeekFromDate(dateStr: string): DayOfWeek {
  if (!dateStr) return 'Selasa';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const map: DayOfWeek[] = [
    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
  ];
  return map[date.getDay()] || 'Selasa';
}

export function getNextDateForDay(targetDay: DayOfWeek, baseDate = '2026-11-24'): string {
  const [y, m, d] = baseDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const map: DayOfWeek[] = [
    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
  ];
  for (let offset = 1; offset <= 7; offset++) {
    const candidate = new Date(date);
    candidate.setDate(date.getDate() + offset);
    if (map[candidate.getDay()] === targetDay) {
      const cy = candidate.getFullYear();
      const cm = String(candidate.getMonth() + 1).padStart(2, '0');
      const cd = String(candidate.getDate()).padStart(2, '0');
      return `${cy}-${cm}-${cd}`;
    }
  }
  return baseDate;
}

export function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function isTimeInWindow(timeStr: string, windowStr: string): boolean {
  const [start, end] = windowStr.split(' - ');
  if (!start || !end) return false;
  const target = timeToMinutes(timeStr);
  return target >= timeToMinutes(start) && target <= timeToMinutes(end);
}

export function getAudienceActivityScores(
  platform: SocialPlatform,
  habit: string,
  activeDays: DayOfWeek[]
): { day: DayOfWeek; score: number; peakLabel: string }[] {
  const baseScores: Record<SocialPlatform, Record<DayOfWeek, number>> = {
    Instagram: {
      Senin: 62,
      Selasa: 88,
      Rabu: 84,
      Kamis: 86,
      Jumat: 74,
      Sabtu: 78,
      Minggu: 82,
    },
    TikTok: {
      Senin: 65,
      Selasa: 84,
      Rabu: 76,
      Kamis: 89,
      Jumat: 92,
      Sabtu: 90,
      Minggu: 80,
    },
    Facebook: {
      Senin: 85,
      Selasa: 72,
      Rabu: 88,
      Kamis: 75,
      Jumat: 83,
      Sabtu: 64,
      Minggu: 60,
    },
    YouTube: {
      Senin: 58,
      Selasa: 64,
      Rabu: 68,
      Kamis: 72,
      Jumat: 86,
      Sabtu: 94,
      Minggu: 91,
    },
  };

  return DAYS_OF_WEEK.map((day) => {
    let score = baseScores[platform][day];
    if (activeDays.includes(day)) {
      score = Math.min(98, score + 6);
    }
    if (habit.includes('Akhir Pekan') && (day === 'Sabtu' || day === 'Minggu')) {
      score = Math.min(98, score + 8);
    }
    if (habit.includes('Pagi') && (day === 'Senin' || day === 'Rabu')) {
      score = Math.min(96, score + 5);
    }
    return {
      day,
      score,
      peakLabel: PLATFORM_PEAK_DEFAULTS[platform].peakHour,
    };
  });
}

export function getSuggestedAudienceWindows(
  platform: SocialPlatform,
  habit: string
): { days: DayOfWeek[]; windows: string[] } {
  const base = PLATFORM_PEAK_DEFAULTS[platform];
  if (habit.includes('Pagi')) {
    return {
      days: ['Senin', 'Rabu', 'Jumat'],
      windows: ['07:00 - 09:00', '11:30 - 13:30'],
    };
  }
  if (habit.includes('Malam') || habit.includes('Sore')) {
    return {
      days: ['Selasa', 'Kamis', 'Jumat', 'Sabtu'],
      windows: ['15:00 - 17:00', '19:00 - 21:00'],
    };
  }
  if (habit.includes('Akhir Pekan')) {
    return {
      days: ['Jumat', 'Sabtu', 'Minggu'],
      windows: ['15:00 - 17:00', '19:00 - 21:00'],
    };
  }
  return {
    days: base.days,
    windows: base.windows,
  };
}

export function suggestTimeFromWindows(windows: string[]): string {
  if (!windows.length) return '19:00';
  const preferred = windows.find((w) => w.includes('19:00')) || windows[0];
  const [start] = preferred.split(' - ');
  return start || '19:00';
}

export function evaluateScheduleOptimality(
  item: ContentItem,
  allItems: ContentItem[]
): OptimalityCheckResult {
  const dayName = getDayOfWeekFromDate(item.scheduledDate);
  const isDayAligned = item.audience.activeDays.includes(dayName);
  const isTimeAligned = item.audience.activeTimeWindows.some((w) =>
    isTimeInWindow(item.scheduledTime, w)
  );
  const isFormatFit = PLATFORM_FORMATS[item.platform].includes(item.format);

  const collidingItem = allItems.find(
    (other) =>
      other.id !== item.id &&
      other.scheduledDate === item.scheduledDate &&
      other.platform === item.platform &&
      Math.abs(timeToMinutes(other.scheduledTime) - timeToMinutes(item.scheduledTime)) < 120
  );

  const hasCollision = Boolean(collidingItem);
  const checks = [isDayAligned, isTimeAligned, isFormatFit, !hasCollision];
  const passedChecks = checks.filter(Boolean).length;
  const isOptimal = isDayAligned && isTimeAligned && !hasCollision;

  const suggestedDay = item.audience.activeDays[0] || 'Selasa';
  const suggestedTime = suggestTimeFromWindows(item.audience.activeTimeWindows);

  let recommendation = '';
  if (isOptimal && isFormatFit) {
    recommendation = `Jadwal ${dayName}, ${item.scheduledTime} WIB sudah sesuai dengan puncak aktivitas audiens di ${item.platform}.`;
  } else {
    const issues: string[] = [];
    if (!isDayAligned) {
      issues.push(
        `Hari ${dayName} berada di luar hari aktif audiens (${item.audience.activeDays.join(', ')})`
      );
    }
    if (!isTimeAligned) {
      issues.push(
        `Jam ${item.scheduledTime} WIB belum masuk waktu puncak (${item.audience.activeTimeWindows.join(', ')})`
      );
    }
    if (!isFormatFit) {
      issues.push(`Format ${item.format} kurang optimal untuk ${item.platform}`);
    }
    if (hasCollision && collidingItem) {
      issues.push(
        `Jadwal berdekatan dengan "${collidingItem.title}" pada platform yang sama`
      );
    }
    recommendation = issues.join('. ') + '.';
  }

  return {
    isTimeAligned,
    isDayAligned,
    isFormatFit,
    hasCollision,
    collidingTitle: collidingItem?.title,
    passedChecks,
    totalChecks: 4,
    isOptimal,
    recommendation,
    suggestedDay,
    suggestedTime,
  };
}

export function calculateEngagementRate(perf: PerformanceMetrics): number {
  if (!perf.views || perf.views <= 0) return 0;
  const interactions = perf.likes + perf.comments + perf.shares;
  return Number(((interactions / perf.views) * 100).toFixed(2));
}

export function formatIndonesianDate(dateStr: string): string {
  if (!dateStr) return '-';
  const [y, m, d] = dateStr.split('-').map(Number);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];
  return `${d} ${months[(m || 1) - 1]} ${y}`;
}
