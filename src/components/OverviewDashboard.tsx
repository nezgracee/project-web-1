import { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Send,
  X,
} from 'lucide-react';
import { ContentItem, FlowStep, TopNavTab } from '../types/content';
import {
  calculateEngagementRate,
  formatIndonesianDate,
} from '../utils/scheduleEngine';
import { PlatformGlyph, StatusLabel } from './PlatformIcon';
import {
  ChromeButterfly,
  ChromeSparkle,
  ChromeStar,
  CuteSmiley,
  GlossyHeart,
  MiniComputer,
  PinkBow,
  PinkFlower,
  RetroCD,
  StickerLabel,
  WashiTape,
} from './Y2KDecorations';

interface OverviewDashboardProps {
  items: ContentItem[];
  onStartNow: () => void;
  onNavigateTab: (tab: TopNavTab) => void;
  onOpenStep: (step: FlowStep, itemId?: string) => void;
}

export function OverviewDashboard({
  items,
  onStartNow,
  onNavigateTab,
  onOpenStep,
}: OverviewDashboardProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'scheduled' | 'published' | 'process'
  >('all');

  const scheduledItems = items.filter(
    (i) => i.status === 'Terjadwal' || i.status === 'Siap Publikasi'
  );
  const publishedItems = items.filter((i) => i.status === 'Dipublikasikan');
  const processItems = items.filter(
    (i) => i.status === 'Dalam Proses' || i.status === 'Perlu Perbaikan'
  );

  const avgEngagement =
    publishedItems.length > 0
      ? (
          publishedItems.reduce(
            (sum, i) => sum + calculateEngagementRate(i.performance),
            0
          ) / publishedItems.length
        ).toFixed(1)
      : '0.0';

  const attentionItems = items.filter(
    (i) => i.status === 'Perlu Perbaikan' || i.status === 'Siap Publikasi'
  );

  const displayedList = (() => {
    if (activeFilter === 'scheduled') return scheduledItems;
    if (activeFilter === 'published') return publishedItems;
    if (activeFilter === 'process') return processItems;
    return items;
  })();

  const quickFlowSteps: { num: string; label: string; step: FlowStep }[] = [
    { num: '01', label: 'Tujuan Konten', step: 'goal' },
    { num: '02', label: 'Target Audiens', step: 'audience' },
    { num: '03', label: 'Platform', step: 'platform' },
    { num: '04', label: 'Ide & Jenis', step: 'idea' },
    { num: '05', label: 'Waktu Aktif', step: 'active_time' },
    { num: '06', label: 'Hari & Jam', step: 'schedule_time' },
  ];

  return (
    <div className="space-y-8">
      {/* Y2K Scrapbook Sticker Collage Hero Section */}
      <section className="relative overflow-visible pt-2">
        {/* Decorative background & overlapping corner stickers */}
        <WashiTape className="-top-0.5 left-8 -rotate-6 z-20 absolute" />
        <WashiTape className="-bottom-2 right-12 rotate-3 z-20 absolute hidden sm:block" />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-5 -left-3 z-20 -rotate-12 sticker-interactive"
        >
          <PinkBow className="w-12 h-10 sm:w-14 sm:h-12" />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none hidden sm:block absolute -top-6 right-20 z-20 y2k-float-slow"
        >
          <ChromeButterfly className="w-14 h-14 rotate-12" />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none hidden md:block absolute -bottom-5 left-1/3 z-20 -rotate-6"
        >
          <PinkFlower className="w-10 h-10" />
        </div>

        <div className="scrapbook-card border-2 border-white ring-1 ring-[#F4BFD3] rounded-[2rem] p-6 sm:p-8 relative overflow-hidden">
          {/* Soft scrapbook ambient gradient patches */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-12 -right-12 w-64 h-64 rounded-full bg-gradient-to-br from-[#F8DCE8] via-[#F4BFD3]/50 to-slate-200/45 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 left-10 w-56 h-56 rounded-full bg-[#F8DCE8]/50 blur-2xl"
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="space-y-3.5 max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <StickerLabel text="PLAN IT!" variant="pink" className="-rotate-2" />
                <StickerLabel text="CREATIVE SPACE" variant="chrome" className="rotate-1" />
                <ChromeSparkle className="w-5 h-5 y2k-twinkle" />
              </div>

              <div className="relative inline-block">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#39313A] text-balance pr-8">
                  Penjadwalan Konten Optimal
                </h1>
                <ChromeStar className="w-6 h-6 y2k-twinkle absolute -top-1 right-0 pointer-events-none" />
              </div>

              <p className="text-sm sm:text-base text-[#39313A]/80 leading-relaxed">
                Rencanakan, atur, dan evaluasi konten media sosialmu dengan alur terstruktur agar
                setiap unggahan tayang di waktu terbaik audiens.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onStartNow}
                  className="y2k-glossy-pink border-2 border-white text-white text-sm font-semibold px-6 py-3 rounded-full inline-flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>Mulai Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateTab('kalender')}
                  className="y2k-chrome-surface text-[#39313A] border-2 border-white hover:ring-2 hover:ring-[#D98EAA] text-sm font-medium px-5 py-3 rounded-full inline-flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4 text-[#B55478]" />
                  <span>Buka Kalender</span>
                </button>
              </div>
            </div>

            {/* Right Asymmetric Y2K Sticker Collage Cluster + Notification Bell */}
            <div className="flex items-start justify-between lg:justify-end gap-4 shrink-0">
              {/* Layered Sticker Cluster (visible on sm+) */}
              <div
                aria-hidden="true"
                className="hidden sm:flex relative w-52 h-44 items-center justify-center select-none pointer-events-none"
              >
                <RetroCD className="w-24 h-24 absolute top-1 left-2 -rotate-12 y2k-float-delayed" />
                <MiniComputer className="w-16 h-16 absolute bottom-2 left-10 rotate-6" />
                <CuteSmiley className="w-11 h-11 absolute top-3 right-6 rotate-12" />
                <GlossyHeart className="w-9 h-9 absolute bottom-8 right-2 -rotate-12 y2k-float-slow" />
                <PinkFlower className="w-10 h-10 absolute bottom-0 right-12 rotate-6" />
                <ChromeStar className="w-6 h-6 absolute top-14 left-0 y2k-twinkle" />
                <StickerLabel
                  text="CONTENT MOOD"
                  variant="charcoal"
                  className="absolute bottom-1 left-0 -rotate-3"
                />
              </div>

              {/* Notification Bell Corner */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowNotifications((v) => !v)}
                  className="w-11 h-11 rounded-full y2k-chrome-surface border-2 border-white ring-1 ring-[#F4BFD3] hover:ring-[#D98EAA] flex items-center justify-center text-[#39313A] transition-all relative cursor-pointer"
                  aria-label="Notifikasi jadwal"
                >
                  <Bell className="w-4 h-4" />
                  {attentionItems.length > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#B55478] ring-2 ring-white" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-md border-2 border-white ring-1 ring-[#F4BFD3] rounded-3xl shadow-xl p-4 z-30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#39313A]">
                        Pengingat Jadwal ({attentionItems.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowNotifications(false)}
                        className="text-[#39313A]/60 hover:text-[#39313A]"
                        aria-label="Tutup notifikasi"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {attentionItems.length === 0 ? (
                      <p className="text-xs text-[#39313A]/65">
                        Belum ada pengingat jadwal saat ini.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {attentionItems.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setShowNotifications(false);
                              onOpenStep(
                                item.status === 'Perlu Perbaikan'
                                  ? 'schedule_time'
                                  : 'evaluate_optimality',
                                item.id
                              );
                            }}
                            className="w-full text-left p-3 rounded-2xl bg-[#FDF4F8] hover:bg-[#F8DCE8]/70 border border-[#F4BFD3] transition-colors"
                          >
                            <p className="text-xs font-semibold text-[#39313A] truncate">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-[#B55478] mt-0.5">
                              {item.status === 'Perlu Perbaikan'
                                ? 'Perlu perbaikan hari & jam'
                                : 'Optimal · Siap publikasi'}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ringkasan Cards with Scrapbook Corner Stickers */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChromeStar className="w-5 h-5 y2k-twinkle" />
            <h2 className="text-base font-bold text-[#39313A]">Ringkasan Jadwal</h2>
            <StickerLabel text="SNAPSHOT" variant="chrome" className="rotate-2 hidden sm:inline-flex" />
          </div>
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#B55478] hover:text-[#9E3F63] cursor-pointer"
          >
            <span>Tampilkan Semua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => setActiveFilter('scheduled')}
            className={`scrapbook-card rounded-3xl p-5 border-2 border-white text-left transition-all space-y-3 relative overflow-visible cursor-pointer ${
              activeFilter === 'scheduled'
                ? 'ring-2 ring-[#B55478]'
                : 'ring-1 ring-[#F4BFD3] hover:ring-[#D98EAA]'
            }`}
          >
            <WashiTape className="-top-2 left-5 -rotate-3 w-12 h-4 absolute" />
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-[#F8DCE8] border border-[#F4BFD3] flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[#B55478]" />
              </span>
              <ChromeSparkle className="w-5 h-5 sticker-interactive" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-[#39313A]">
                {scheduledItems.length}
              </p>
              <p className="text-xs font-medium text-[#39313A]/70 mt-0.5">Terjadwal</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('published')}
            className={`scrapbook-card rounded-3xl p-5 border-2 border-white text-left transition-all space-y-3 relative overflow-visible cursor-pointer ${
              activeFilter === 'published'
                ? 'ring-2 ring-[#B55478]'
                : 'ring-1 ring-[#F4BFD3] hover:ring-[#D98EAA]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              </span>
              <GlossyHeart className="w-6 h-6 rotate-6 sticker-interactive" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-[#39313A]">
                {publishedItems.length}
              </p>
              <p className="text-xs font-medium text-[#39313A]/70 mt-0.5">Terbit</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('process')}
            className={`scrapbook-card rounded-3xl p-5 border-2 border-white text-left transition-all space-y-3 relative overflow-visible cursor-pointer ${
              activeFilter === 'process'
                ? 'ring-2 ring-[#B55478]'
                : 'ring-1 ring-[#F4BFD3] hover:ring-[#D98EAA]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl y2k-chrome-surface border border-slate-300/80 flex items-center justify-center">
                <Clock className="w-4 h-4 text-[#39313A]" />
              </span>
              <PinkFlower className="w-6 h-6 -rotate-6 sticker-interactive" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-[#39313A]">
                {processItems.length}
              </p>
              <p className="text-xs font-medium text-[#39313A]/70 mt-0.5">Dalam Proses</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('analitik')}
            className="scrapbook-card rounded-3xl p-5 border-2 border-white ring-1 ring-[#F4BFD3] hover:ring-[#D98EAA] text-left transition-all space-y-3 relative overflow-visible cursor-pointer"
          >
            <WashiTape className="-top-2 right-4 rotate-3 w-12 h-4 absolute" />
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F8DCE8] to-[#F4BFD3] border border-[#D98EAA] flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-[#B55478]" />
              </span>
              <ChromeStar className="w-5 h-5 y2k-twinkle" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-[#B55478]">
                {avgEngagement}%
              </p>
              <p className="text-xs font-medium text-[#39313A]/70 mt-0.5">
                Rata-rata Engagement
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* Main Content Split: Quick Workflow Steps + Scheduled Queue */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Quick Start Stages */}
        <section className="xl:col-span-5 relative overflow-visible">
          <WashiTape className="-top-2.5 left-6 -rotate-3 z-20 absolute" />
          <MiniComputer className="w-11 h-11 -bottom-4 -left-3 -rotate-6 z-20 pointer-events-none absolute hidden sm:block" />
          <div className="scrapbook-card border-2 border-white ring-1 ring-[#F4BFD3] rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChromeSparkle className="w-4 h-4" />
                <h2 className="text-sm font-bold text-[#39313A]">Tahapan Perencanaan</h2>
              </div>
              <StickerLabel text="6 LANGKAH" variant="chrome" className="rotate-2" />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {quickFlowSteps.map((s) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => onOpenStep(s.step)}
                  className="p-3.5 rounded-2xl border border-[#F4BFD3]/90 bg-white/85 hover:bg-[#F8DCE8]/65 hover:border-[#D98EAA] text-left transition-all space-y-1 cursor-pointer"
                >
                  <span className="text-[11px] font-mono font-semibold text-[#B55478]">
                    {s.num}
                  </span>
                  <p className="text-xs font-semibold text-[#39313A]">{s.label}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Right: Active Schedule List or Sticker Collage Empty State */}
        <section className="xl:col-span-7 relative overflow-visible">
          <PinkBow className="w-11 h-9 -top-4 -right-2 rotate-12 z-20 pointer-events-none absolute" />
          <div className="scrapbook-card border-2 border-white ring-1 ring-[#F4BFD3] rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between gap-3 pr-4">
              <div className="flex items-center gap-2">
                <GlossyHeart className="w-5 h-5" />
                <h2 className="text-sm font-bold text-[#39313A]">
                  {activeFilter === 'scheduled'
                    ? 'Konten Terjadwal'
                    : activeFilter === 'published'
                      ? 'Konten Terpublikasi'
                      : activeFilter === 'process'
                        ? 'Konten Dalam Proses'
                        : 'Daftar Jadwal Konten'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('kalender')}
                className="text-xs font-semibold text-[#B55478] hover:text-[#9E3F63] whitespace-nowrap cursor-pointer"
              >
                Kalender Penuh →
              </button>
            </div>

            {displayedList.length === 0 ? (
              <div className="py-10 px-4 rounded-2xl border border-dashed border-[#D98EAA]/80 bg-gradient-to-b from-white/85 to-[#F8DCE8]/35 text-center space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <RetroCD className="w-11 h-11 -rotate-12 sticker-interactive" />
                  <PinkFlower className="w-9 h-9 -rotate-6 sticker-interactive" />
                  <ChromeButterfly className="w-11 h-11 y2k-float-slow" />
                  <CuteSmiley className="w-9 h-9 rotate-12 sticker-interactive" />
                  <ChromeStar className="w-7 h-7 y2k-twinkle" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-center pb-1">
                    <StickerLabel text="READY TO PLAN!" variant="chrome" className="-rotate-1" />
                  </div>
                  <p className="text-sm font-bold text-[#39313A]">
                    Belum ada jadwal konten
                  </p>
                  <p className="text-xs text-[#39313A]/70 max-w-sm mx-auto leading-relaxed">
                    Mulai rencanakan tujuan, target audiens, platform, dan jam tayang optimalmu
                    sekarang.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onStartNow}
                  className="y2k-glossy-pink border-2 border-white text-white text-xs font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Buat Jadwal Pertama</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {displayedList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-[#F4BFD3] bg-white/90 hover:bg-white transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-[#39313A]/70">
                        <PlatformGlyph platform={item.platform} className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {item.platform} · {item.format} ·{' '}
                          <span className="font-mono">
                            {formatIndonesianDate(item.scheduledDate)} {item.scheduledTime}
                          </span>
                        </span>
                      </div>
                      <p className="text-sm font-bold text-[#39313A] truncate">{item.title}</p>
                      <StatusLabel status={item.status} />
                    </div>

                    <div className="shrink-0">
                      {item.status === 'Perlu Perbaikan' ? (
                        <button
                          type="button"
                          onClick={() => onOpenStep('schedule_time', item.id)}
                          className="px-4 py-2 text-xs font-semibold text-[#39313A] bg-[#F8DCE8] hover:bg-[#F4BFD3] rounded-full transition-colors whitespace-nowrap cursor-pointer"
                        >
                          Perbaiki Jadwal
                        </button>
                      ) : item.status === 'Dipublikasikan' ? (
                        <button
                          type="button"
                          onClick={() => onOpenStep('publish_monitoring', item.id)}
                          className="px-4 py-2 text-xs font-semibold text-[#B55478] y2k-chrome-surface border-2 border-white ring-1 ring-slate-300/80 hover:ring-[#D98EAA] rounded-full transition-colors whitespace-nowrap cursor-pointer"
                        >
                          Lihat Performa
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onOpenStep('evaluate_optimality', item.id)}
                          className="y2k-glossy-pink border border-white text-white px-4 py-2 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          Evaluasi Jadwal
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
