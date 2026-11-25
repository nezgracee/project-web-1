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
  AbstractFlower,
  ChromeButterfly,
  ChromeSparkle,
  ChromeStar,
  GlossyHeart,
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
    <div className="space-y-7">
      {/* Spacious Hero Banner Card with Y2K Chrome Accents */}
      <section className="y2k-glass-card border border-[#F4BFD3] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        {/* Subtle Y2K decorative corner elements */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-12 -right-12 w-56 h-56 rounded-full bg-gradient-to-br from-[#F8DCE8] to-[#F4BFD3]/40 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none hidden sm:block absolute top-6 right-16 y2k-float-slow opacity-90"
        >
          <ChromeButterfly className="w-12 h-12" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none hidden sm:block absolute bottom-5 right-8 y2k-float-delayed opacity-85"
        >
          <ChromeStar className="w-7 h-7" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#B55478]">
              <ChromeSparkle className="w-4 h-4 shrink-0" />
              <span>Studio Perencanaan Publikasi Media Sosial</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#39313A] text-balance">
              Penjadwalan Konten Optimal
            </h1>

            <p className="text-sm sm:text-base text-[#39313A]/75 leading-relaxed">
              Rencanakan, atur, dan evaluasi konten media sosialmu dengan alur terstruktur agar
              setiap unggahan tayang di waktu terbaik audiens.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onStartNow}
                className="y2k-glossy-pink text-white text-sm font-semibold px-6 py-3 rounded-full inline-flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Mulai Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('kalender')}
                className="y2k-chrome-surface text-[#39313A] border border-slate-300/80 hover:border-[#D98EAA] text-sm font-medium px-5 py-3 rounded-full inline-flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 text-[#B55478]" />
                <span>Buka Kalender</span>
              </button>
            </div>
          </div>

          {/* Notification Bell Corner */}
          <div className="lg:self-start relative">
            <button
              type="button"
              onClick={() => setShowNotifications((v) => !v)}
              className="w-11 h-11 rounded-full y2k-chrome-surface border border-slate-300/80 hover:border-[#D98EAA] flex items-center justify-center text-[#39313A] transition-all relative"
              aria-label="Notifikasi jadwal"
            >
              <Bell className="w-4 h-4" />
              {attentionItems.length > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#B55478]" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-md border border-[#F4BFD3] rounded-3xl shadow-xl p-4 z-30 space-y-3">
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
      </section>

      {/* Ringkasan Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChromeStar className="w-4 h-4" />
            <h2 className="text-base font-bold text-[#39313A]">Ringkasan Jadwal</h2>
          </div>
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#B55478] hover:text-[#9E3F63]"
          >
            <span>Tampilkan Semua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => setActiveFilter('scheduled')}
            className={`y2k-glass-card rounded-3xl p-5 border text-left transition-all space-y-3 ${
              activeFilter === 'scheduled'
                ? 'border-[#B55478] ring-2 ring-[#F4BFD3]'
                : 'border-[#F4BFD3] hover:border-[#D98EAA]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-[#F8DCE8] border border-[#F4BFD3] flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[#B55478]" />
              </span>
              <ChromeSparkle className="w-4 h-4 opacity-70" />
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
            className={`y2k-glass-card rounded-3xl p-5 border text-left transition-all space-y-3 ${
              activeFilter === 'published'
                ? 'border-[#B55478] ring-2 ring-[#F4BFD3]'
                : 'border-[#F4BFD3] hover:border-[#D98EAA]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              </span>
              <GlossyHeart className="w-4 h-4 opacity-80" />
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
            className={`y2k-glass-card rounded-3xl p-5 border text-left transition-all space-y-3 ${
              activeFilter === 'process'
                ? 'border-[#B55478] ring-2 ring-[#F4BFD3]'
                : 'border-[#F4BFD3] hover:border-[#D98EAA]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl y2k-chrome-surface border border-slate-300/80 flex items-center justify-center">
                <Clock className="w-4 h-4 text-[#39313A]" />
              </span>
              <AbstractFlower className="w-4 h-4 opacity-75" />
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
            className="y2k-glass-card rounded-3xl p-5 border border-[#F4BFD3] hover:border-[#D98EAA] text-left transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F8DCE8] to-[#F4BFD3] border border-[#D98EAA] flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-[#B55478]" />
              </span>
              <ChromeStar className="w-4 h-4 opacity-75" />
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
        <section className="xl:col-span-5 y2k-glass-card border border-[#F4BFD3] rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChromeSparkle className="w-4 h-4" />
              <h2 className="text-sm font-bold text-[#39313A]">Tahapan Perencanaan</h2>
            </div>
            <span className="text-[11px] font-mono text-[#B55478]">6 Langkah</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {quickFlowSteps.map((s) => (
              <button
                key={s.step}
                type="button"
                onClick={() => onOpenStep(s.step)}
                className="p-3.5 rounded-2xl border border-[#F4BFD3]/80 bg-white/75 hover:bg-[#F8DCE8]/55 hover:border-[#D98EAA] text-left transition-all space-y-1"
              >
                <span className="text-[11px] font-mono font-semibold text-[#B55478]">
                  {s.num}
                </span>
                <p className="text-xs font-semibold text-[#39313A]">{s.label}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Right: Active Schedule List or Clean Y2K Empty State */}
        <section className="xl:col-span-7 y2k-glass-card border border-[#F4BFD3] rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <GlossyHeart className="w-4 h-4" />
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
              className="text-xs font-semibold text-[#B55478] hover:text-[#9E3F63] whitespace-nowrap"
            >
              Kalender Penuh →
            </button>
          </div>

          {displayedList.length === 0 ? (
            <div className="py-10 px-4 rounded-2xl border border-dashed border-[#D98EAA]/70 bg-gradient-to-b from-white/70 to-[#F8DCE8]/30 text-center space-y-3 relative">
              <div className="flex items-center justify-center gap-3">
                <AbstractFlower className="w-8 h-8" />
                <ChromeButterfly className="w-9 h-9 y2k-float-slow" />
                <ChromeStar className="w-6 h-6" />
              </div>
              <div className="space-y-1">
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
                className="y2k-glossy-pink text-white text-xs font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-1.5 transition-all cursor-pointer"
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
                  className="p-4 rounded-2xl border border-[#F4BFD3] bg-white/85 hover:bg-white transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
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
                        className="px-4 py-2 text-xs font-semibold text-[#39313A] bg-[#F8DCE8] hover:bg-[#F4BFD3] rounded-full transition-colors whitespace-nowrap"
                      >
                        Perbaiki Jadwal
                      </button>
                    ) : item.status === 'Dipublikasikan' ? (
                      <button
                        type="button"
                        onClick={() => onOpenStep('publish_monitoring', item.id)}
                        className="px-4 py-2 text-xs font-semibold text-[#B55478] y2k-chrome-surface border border-slate-300/80 hover:border-[#D98EAA] rounded-full transition-colors whitespace-nowrap"
                      >
                        Lihat Performa
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onOpenStep('evaluate_optimality', item.id)}
                        className="y2k-glossy-pink text-white px-4 py-2 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 transition-all whitespace-nowrap"
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
        </section>
      </div>
    </div>
  );
}
