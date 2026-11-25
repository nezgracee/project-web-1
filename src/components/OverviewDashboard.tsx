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
import { formatIndonesianDate } from '../utils/scheduleEngine';
import { PlatformGlyph, StatusLabel } from './PlatformIcon';

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
  const [showAllItems, setShowAllItems] = useState(false);
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

  const attentionItems = items.filter(
    (i) => i.status === 'Perlu Perbaikan' || i.status === 'Siap Publikasi'
  );

  const displayedList = (() => {
    if (activeFilter === 'scheduled') return scheduledItems;
    if (activeFilter === 'published') return publishedItems;
    if (activeFilter === 'process') return processItems;
    return items;
  })();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <section className="bg-white border border-[#F4BFD3] rounded-3xl p-6 sm:p-8 shadow-sm space-y-7 relative">
        <div className="flex items-center justify-between">
          <div className="w-11 h-11 rounded-2xl bg-[#F8DCE8] border border-[#F4BFD3] flex items-center justify-center">
            <Calendar className="w-5 h-5 text-[#B55478]" />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications((v) => !v)}
              className="w-10 h-10 rounded-full hover:bg-[#F8DCE8]/60 flex items-center justify-center text-[#39313A] transition-colors relative"
              aria-label="Notifikasi jadwal"
            >
              <Bell className="w-5 h-5" />
              {attentionItems.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#B55478]" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-[#F4BFD3] rounded-2xl shadow-lg p-4 z-30 space-y-3">
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
                        className="w-full text-left p-2.5 rounded-xl bg-[#FDF8FA] hover:bg-[#F8DCE8]/60 border border-[#F4BFD3]/70 transition-colors"
                      >
                        <p className="text-xs font-semibold text-[#39313A] truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-[#B55478] mt-0.5">
                          {item.status === 'Perlu Perbaikan'
                            ? 'Perlu perbaikan hari/jam'
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

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#39313A] leading-tight">
            Penjadwalan Konten Optimal
          </h1>
          <p className="text-sm sm:text-base text-[#39313A]/75 leading-relaxed">
            Rencanakan, atur, dan evaluasi konten media sosialmu!
          </p>
        </div>

        <button
          type="button"
          onClick={onStartNow}
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 text-sm sm:text-base font-semibold text-white bg-[#B55478] hover:bg-[#9E3F63] rounded-2xl transition-colors"
        >
          <span>Mulai Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-[#39313A]">Ringkasan</h2>
            <button
              type="button"
              onClick={() => {
                setActiveFilter('all');
                setShowAllItems((v) => !v);
              }}
              className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#B55478] hover:text-[#9E3F63]"
            >
              <span>{showAllItems ? 'Sembunyikan' : 'Lihat Semua'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => {
                setActiveFilter('scheduled');
                setShowAllItems(true);
              }}
              className={`p-4 rounded-2xl border text-center transition-colors space-y-2 ${
                showAllItems && activeFilter === 'scheduled'
                  ? 'bg-[#F8DCE8]/70 border-[#B55478]'
                  : 'bg-[#FDF8FA] border-[#F4BFD3] hover:bg-[#F8DCE8]/45'
              }`}
            >
              <div className="w-9 h-9 mx-auto rounded-xl bg-[#F8DCE8] flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[#B55478]" />
              </div>
              <p className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-[#39313A]">
                {scheduledItems.length}
              </p>
              <p className="text-xs font-medium text-[#39313A]/75">Terjadwal</p>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveFilter('published');
                setShowAllItems(true);
              }}
              className={`p-4 rounded-2xl border text-center transition-colors space-y-2 ${
                showAllItems && activeFilter === 'published'
                  ? 'bg-[#F8DCE8]/70 border-[#B55478]'
                  : 'bg-[#FDF8FA] border-[#F4BFD3] hover:bg-[#F8DCE8]/45'
              }`}
            >
              <div className="w-9 h-9 mx-auto rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              </div>
              <p className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-[#39313A]">
                {publishedItems.length}
              </p>
              <p className="text-xs font-medium text-[#39313A]/75">Terbit</p>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveFilter('process');
                setShowAllItems(true);
              }}
              className={`p-4 rounded-2xl border text-center transition-colors space-y-2 ${
                showAllItems && activeFilter === 'process'
                  ? 'bg-[#F8DCE8]/70 border-[#B55478]'
                  : 'bg-[#FDF8FA] border-[#F4BFD3] hover:bg-[#F8DCE8]/45'
              }`}
            >
              <div className="w-9 h-9 mx-auto rounded-xl bg-[#F4BFD3]/70 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-[#39313A]" />
              </div>
              <p className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-[#39313A]">
                {processItems.length}
              </p>
              <p className="text-xs font-medium text-[#39313A]/75">Dalam Proses</p>
            </button>
          </div>
        </div>
      </section>

      {(showAllItems || items.length > 0) && (
        <section className="bg-white border border-[#F4BFD3] rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-[#39313A]">
              {activeFilter === 'scheduled'
                ? 'Konten Terjadwal'
                : activeFilter === 'published'
                  ? 'Konten Terpublikasi'
                  : activeFilter === 'process'
                    ? 'Konten Dalam Proses'
                    : 'Daftar Jadwal Konten'}
            </h3>
            <button
              type="button"
              onClick={() => onNavigateTab('kalender')}
              className="text-xs font-semibold text-[#B55478] hover:text-[#9E3F63]"
            >
              Buka Kalender →
            </button>
          </div>

          {displayedList.length === 0 ? (
            <div className="p-6 rounded-2xl border border-dashed border-[#F4BFD3] bg-[#FDF8FA] text-center space-y-2">
              <p className="text-xs text-[#39313A]/70">
                Belum ada konten pada kategori ini. Klik <strong>Mulai Sekarang</strong> untuk
                memasukkan jadwal konten baru.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {displayedList.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-[#F4BFD3]/80 bg-[#FDF8FA] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <PlatformGlyph platform={item.platform} className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-xs text-[#39313A]/70">
                        {item.platform} · {item.format} ·{' '}
                        <span className="font-mono">
                          {formatIndonesianDate(item.scheduledDate)} {item.scheduledTime}
                        </span>
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#39313A] truncate">
                      {item.title}
                    </p>
                    <StatusLabel status={item.status} />
                  </div>

                  <div className="shrink-0">
                    {item.status === 'Perlu Perbaikan' ? (
                      <button
                        type="button"
                        onClick={() => onOpenStep('schedule_time', item.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#39313A] bg-[#F8DCE8] hover:bg-[#F4BFD3] rounded-xl transition-colors whitespace-nowrap"
                      >
                        <Clock className="w-3.5 h-3.5 text-[#B55478]" />
                        Perbaiki Jadwal
                      </button>
                    ) : item.status === 'Dipublikasikan' ? (
                      <button
                        type="button"
                        onClick={() => onOpenStep('publish_monitoring', item.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#B55478] bg-white border border-[#F4BFD3] hover:bg-[#F8DCE8]/50 rounded-xl transition-colors whitespace-nowrap"
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                        Lihat Performa
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onOpenStep('evaluate_optimality', item.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#B55478] hover:bg-[#9E3F63] rounded-xl transition-colors whitespace-nowrap"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Evaluasi Jadwal
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
