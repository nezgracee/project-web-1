import { useState } from 'react';
import { CheckCircle2, Save, Trash2, User } from 'lucide-react';
import { SocialPlatform, UserProfile } from '../types/content';
import {
  ChromeSparkle,
  ChromeStar,
  GlossyHeart,
  MiniComputer,
  PinkBow,
  PinkFlower,
  StickerLabel,
  WashiTape,
} from './Y2KDecorations';

interface ProfileViewProps {
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onClearAllData: () => void;
}

const ROLES: UserProfile['role'][] = [
  'Mahasiswa',
  'Content Creator',
  'Social Media Specialist',
];

const PLATFORMS: SocialPlatform[] = ['Instagram', 'TikTok', 'Facebook', 'YouTube'];

export function ProfileView({
  profile,
  onSaveProfile,
  onClearAllData,
}: ProfileViewProps) {
  const [form, setForm] = useState<UserProfile>(profile);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto pt-2">
      <div className="relative overflow-visible">
        <WashiTape className="-top-2 left-10 -rotate-6 z-20 absolute" />
        <WashiTape className="-bottom-2 right-10 rotate-3 z-20 absolute hidden sm:block" />
        <PinkBow className="w-12 h-10 -top-4 -right-2 rotate-12 z-20 pointer-events-none absolute" />
        <MiniComputer className="w-12 h-12 -bottom-5 -left-4 -rotate-6 z-20 pointer-events-none absolute hidden sm:block" />

        <div className="scrapbook-card border-2 border-white ring-1 ring-[#F4BFD3] rounded-[2rem] p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <StickerLabel text="CREATOR ID" variant="pink" className="-rotate-2" />
                <ChromeSparkle className="w-4 h-4 y2k-twinkle" />
              </div>
              <h1 className="text-lg font-bold text-[#39313A]">Profil Pengguna</h1>
              <p className="text-xs sm:text-sm text-[#39313A]/65">
                Atur identitas akun dan preferensi platform publikasi Anda.
              </p>
            </div>
            <div className="flex items-center -space-x-1 shrink-0">
              <PinkFlower className="w-8 h-8 -rotate-6 sticker-interactive" />
              <ChromeStar className="w-6 h-6 y2k-twinkle" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-4 pb-4 border-b border-[#F4BFD3]/70">
              <div className="relative w-13 h-13 rounded-full y2k-chrome-surface border-2 border-white ring-1 ring-slate-300/80 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-[#B55478]" />
                <GlossyHeart className="w-5 h-5 -bottom-1 -right-1 absolute pointer-events-none" />
              </div>
              <div>
                <p className="text-base font-bold text-[#39313A]">
                  {form.name || 'Nama Belum Diisi'}
                </p>
                <p className="text-xs text-[#39313A]/65">
                  {form.role}
                  {form.handle ? ` · ${form.handle}` : ''} · Platform utama: {form.primaryPlatform}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="prof-name" className="block text-xs font-semibold text-[#39313A]">
                  Nama Lengkap
                </label>
                <input
                  id="prof-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Masukkan nama Anda"
                  className="w-full px-4 py-2.5 text-sm border border-[#F4BFD3] rounded-2xl bg-white focus:outline-none focus:border-[#B55478]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="prof-handle" className="block text-xs font-semibold text-[#39313A]">
                  Username / Akun Utama
                </label>
                <input
                  id="prof-handle"
                  type="text"
                  value={form.handle}
                  onChange={(e) => setForm((p) => ({ ...p, handle: e.target.value }))}
                  placeholder="Contoh: @username"
                  className="w-full px-4 py-2.5 text-sm border border-[#F4BFD3] rounded-2xl bg-white focus:outline-none focus:border-[#B55478]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="prof-role" className="block text-xs font-semibold text-[#39313A]">
                  Peran Pengguna
                </label>
                <select
                  id="prof-role"
                  value={form.role}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, role: e.target.value as UserProfile['role'] }))
                  }
                  className="w-full px-4 py-2.5 text-sm border border-[#F4BFD3] rounded-2xl bg-white focus:outline-none focus:border-[#B55478]"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="prof-plat" className="block text-xs font-semibold text-[#39313A]">
                  Platform Fokus Utama
                </label>
                <select
                  id="prof-plat"
                  value={form.primaryPlatform}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      primaryPlatform: e.target.value as SocialPlatform,
                    }))
                  }
                  className="w-full px-4 py-2.5 text-sm border border-[#F4BFD3] rounded-2xl bg-white focus:outline-none focus:border-[#B55478]"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="prof-bio" className="block text-xs font-semibold text-[#39313A]">
                Catatan Fokus Konten
              </label>
              <textarea
                id="prof-bio"
                rows={3}
                value={form.bio}
                onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                placeholder="Tuliskan topik utama atau target konten Anda..."
                className="w-full px-4 py-2.5 text-sm border border-[#F4BFD3] rounded-2xl bg-white focus:outline-none focus:border-[#B55478]"
              />
            </div>

            <div className="pt-3 border-t border-[#F4BFD3]/70 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClearAllData}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-red-700 bg-white border border-[#F4BFD3] hover:bg-red-50 rounded-full transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Kosongkan Semua Jadwal
              </button>

              <div className="flex items-center gap-3">
                {saved && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    Profil tersimpan
                  </span>
                )}
                <button
                  type="submit"
                  className="y2k-glossy-pink border-2 border-white text-white px-5 py-2 text-xs font-semibold rounded-full inline-flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Simpan Profil
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
