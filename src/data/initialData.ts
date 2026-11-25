import { ContentGoal, ContentItem, UserProfile } from '../types/content';

export const GOAL_OPTIONS: {
  value: ContentGoal;
  description: string;
}[] = [
  {
    value: 'Edukasi',
    description: 'Berbagi tips belajar, tutorial praktis, atau wawasan terstruktur.',
  },
  {
    value: 'Promosi',
    description: 'Mengenalkan produk, layanan, event kampus, atau penawaran spesial.',
  },
  {
    value: 'Hiburan',
    description: 'Konten ringan, cerita keseharian yang relatable, dan visual menarik.',
  },
  {
    value: 'Meningkatkan Engagement',
    description: 'Mendorong komentar, diskusi, polling, dan interaksi dua arah.',
  },
];

export const AGE_RANGE_OPTIONS = [
  '15 - 24 Tahun (Pelajar & Mahasiswa)',
  '18 - 25 Tahun (Gen Z & Fresh Graduate)',
  '25 - 34 Tahun (Profesional Muda)',
  '35 - 44 Tahun (Dewasa & Keluarga)',
];

export const INTEREST_OPTIONS = [
  'Teknologi',
  'Lifestyle',
  'Produktivitas & Kuliah',
  'Desain & Kreativitas',
  'Bisnis & UMKM',
  'Karier & Magang',
  'Kuliner',
  'Kecantikan & Fashion',
];

export const HABIT_OPTIONS = [
  'Setiap hari saat jam istirahat siang & malam',
  'Sore sepulang kuliah/kerja hingga malam hari',
  'Pagi sebelum beraktivitas & istirahat siang',
  'Dominan akhir pekan dengan durasi tonton panjang',
];

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: '',
  role: 'Mahasiswa',
  handle: '',
  primaryPlatform: 'Instagram',
  bio: '',
};

export const INITIAL_CONTENT_ITEMS: ContentItem[] = [];
