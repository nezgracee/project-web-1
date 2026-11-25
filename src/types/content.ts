export type ContentGoal =
  | 'Edukasi'
  | 'Promosi'
  | 'Hiburan'
  | 'Meningkatkan Engagement';

export type SocialPlatform = 'Instagram' | 'TikTok' | 'Facebook' | 'YouTube';

export type ContentFormat = 'Foto' | 'Video' | 'Reels' | 'Carousel' | 'Story';

export type DayOfWeek =
  | 'Senin'
  | 'Selasa'
  | 'Rabu'
  | 'Kamis'
  | 'Jumat'
  | 'Sabtu'
  | 'Minggu';

export type WorkflowStatus =
  | 'Dalam Proses'
  | 'Terjadwal'
  | 'Perlu Perbaikan'
  | 'Siap Publikasi'
  | 'Dipublikasikan';

export type TopNavTab = 'beranda' | 'kalender' | 'analitik' | 'profil';

export type FlowStep =
  | 'dashboard'
  | 'goal'
  | 'audience'
  | 'platform'
  | 'idea'
  | 'active_time'
  | 'schedule_time'
  | 'calendar'
  | 'evaluate_optimality'
  | 'publish_monitoring'
  | 'evaluation_summary';

export interface AudienceProfile {
  ageRange: string;
  interests: string[];
  usageHabit: string;
  activeDays: DayOfWeek[];
  activeTimeWindows: string[];
}

export interface PerformanceMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  recordedAt?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  ideaDescription: string;
  goal: ContentGoal;
  audience: AudienceProfile;
  platform: SocialPlatform;
  format: ContentFormat;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  status: WorkflowStatus;
  revisionNote?: string;
  revisionCount: number;
  publishedAt?: string;
  performance: PerformanceMetrics;
  evaluationNote?: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  role: 'Mahasiswa' | 'Content Creator' | 'Social Media Specialist';
  handle: string;
  primaryPlatform: SocialPlatform;
  bio: string;
}

export interface OptimalityCheckResult {
  isTimeAligned: boolean;
  isDayAligned: boolean;
  isFormatFit: boolean;
  hasCollision: boolean;
  collidingTitle?: string;
  passedChecks: number;
  totalChecks: number;
  isOptimal: boolean;
  recommendation: string;
  suggestedDay: DayOfWeek;
  suggestedTime: string;
}
