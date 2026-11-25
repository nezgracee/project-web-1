import { useMemo, useState } from 'react';
import {
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
} from 'lucide-react';
import { ContentItem, SocialPlatform } from '../types/content';
import {
  PLATFORM_PINK_STYLES,
  formatIndonesianDate,
} from '../utils/scheduleEngine';
import { PlatformGlyph, StatusLabel } from './PlatformIcon';
import {
  ChromeButterfly,
  ChromeSparkle,
  ChromeStar,
  PinkBow,
  PinkFlower,
  RetroCD,
  StickerLabel,
  WashiTape,
} from './Y2KDecorations';

interface CalendarViewProps {
  items: ContentItem[];
  highlightedItemId?: string | null;
  onBack: () => void;
  onCreateForDate: (dateStr: string) => void;
  onEditSchedule: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onSaveAndContinueToEvaluation: (itemId: string) => void;
}

const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const WEEKDAY_HEADERS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

export function CalendarView({
  items,
  highlightedItemId,
  onBack,
  onCreateForDate,
  onEditSchedule,
  onDeleteItem,
  onSaveAndContinueToEvaluation,
}: CalendarViewProps) {
  const highlighted = items.find((i) => i.id === highlightedItemId);
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(10); // November 2026
  const [selectedDate, setSelectedDate] = useState<string>(
    highlighted?.scheduledDate || '2026-11-24'
  );
  const [platformFilter, setPlatformFilter] = useState<'Semua' | SocialPlatform>('Semua');

  const filteredItems = useMemo(() => {
    if (platformFilter === 'Semua') return items;
    return items.filter((i) => i.platform === platformFilter);
  }, [items, platformFilter]);

  const calendarCells = useMemo(() => {
    const jsFirstDay = new Date(year, month, 1).getDay();
    const mondayOffset = (jsFirstDay + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: { dateStr: string | null; dayNumber: number | null }[] = [];

    for (let i = 0; i < mondayOffset; i++) {
      cells.push({ dateStr: null, dayNumber: null });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const mm = String(month + 1).padStart(2, '0');
      const dd = String(day).padStart(2, '0');
      cells.push({ dateStr: `${year}-${mm}-${dd}`, dayNumber: day });
    }
    while (cells.length % 7 !== 0) {
      cells.push({ dateStr: null, dayNumber: null });
    }
    return cells;
  }, [year, month]);

  const selectedDateItems = filteredItems
    .filter((i) => i.scheduledDate === selectedDate)
    .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

  const primaryEvalItem =
    highlighted ||
    selectedDateItems.find((i) => i.status !== 'Dipublikasikan') ||
    items.find((i) => i.status !== 'Dipublikasikan') ||
    null;

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header + Platform Filter Pills */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-full y2k-chrome-surface border-2 border-white ring-1 ring-slate-300/80 hover:ring-[#D98EAA] flex items-center justify-center text-[#39313A] cursor-pointer"
            aria-label="Kembali"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-[#39313A] inline-flex items-center gap-2">
                <span>Kalender Publikasi</span>
                <ChromeSparkle className="w-5 h-5 y2k-twinkle" />
              </h1>
              <StickerLabel text="CALENDAR CLUB" variant="chrome" className="-rotate-2" />
            </div>
            <p className="text-xs sm:text-sm text-[#39313A]/65">
              Klik tanggal untuk melihat atau menjadwalkan konten berdasarkan platform.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 p-1 bg-white/90 border-2 border-white ring-1 ring-[#F4BFD3] rounded-full overflow-x-auto">
            {(['Semua', 'Instagram', 'TikTok', 'Facebook', 'YouTube'] as const).map(
              (plat) => (
                <button
                  key={plat}
                  type="button"
                  onClick={() => setPlatformFilter(plat)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap cursor-pointer ${
                    platformFilter === plat
                      ? 'y2k-glossy-pink text-white'
                      : 'text-[#39313A]/75 hover:bg-[#F8DCE8]/50'
                  }`}
                >
                  {plat}
                </button>
              )
            )}
          </div>

          <button
            type="button"
            onClick={() => onCreateForDate(selectedDate)}
            className="y2k-glossy-pink border-2 border-white text-white text-xs font-semibold px-4 py-2.5 rounded-full inline-flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            <span>Tambah Jadwal</span>
          </button>
        </div>
      </div>

      {/* Main Split: Calendar Grid + Selected Day Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <section className="xl:col-span-7 relative overflow-visible">
          <WashiTape className="-top-2.5 left-8 -rotate-3 z-20 absolute" />
          <RetroCD className="w-12 h-12 -bottom-4 -left-4 -rotate-12 z-20 pointer-events-none absolute hidden sm:block y2k-float-delayed" />
          <PinkFlower className="w-9 h-9 -top-4 -right-2 rotate-12 z-20 pointer-events-none absolute hidden sm:block" />

          <div className="scrapbook-card border-2 border-white ring-1 ring-[#F4BFD3] rounded-[2rem] p-6 space-y-5">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={prevMonth}
                className="w-9 h-9 rounded-full y2k-chrome-surface border-2 border-white ring-1 ring-slate-300/80 flex items-center justify-center text-[#39313A] cursor-pointer"
                aria-label="Bulan sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-base font-bold text-[#39313A] inline-flex items-center gap-2">
                <ChromeStar className="w-5 h-5 y2k-twinkle" />
                {MONTH_NAMES[month]} {year}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                className="w-9 h-9 rounded-full y2k-chrome-surface border-2 border-white ring-1 ring-slate-300/80 flex items-center justify-center text-[#39313A] cursor-pointer"
                aria-label="Bulan berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 text-center text-xs font-semibold text-[#39313A]/65 pb-1">
              {WEEKDAY_HEADERS.map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-2.5 justify-items-center">
              {calendarCells.map((cell, idx) => {
                if (!cell.dateStr || !cell.dayNumber) {
                  return <div key={`empty-${idx}`} className="w-10 h-11" />;
                }

                const dayItems = filteredItems.filter(
                  (i) => i.scheduledDate === cell.dateStr
                );
                const isSelected = selectedDate === cell.dateStr;
                const hasScheduled = dayItems.length > 0;

                return (
                  <button
                    key={cell.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(cell.dateStr!)}
                    className="flex flex-col items-center gap-1 group cursor-pointer"
                  >
                    <span
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-mono tabular-nums transition-all ${
                        isSelected
                          ? 'y2k-glossy-pink border-2 border-white text-white font-bold'
                          : hasScheduled
                            ? 'bg-[#F8DCE8] border border-[#D98EAA] text-[#39313A] font-semibold'
                            : 'text-[#39313A] hover:bg-white'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    <div className="flex items-center gap-0.5 h-1.5">
                      {dayItems.slice(0, 3).map((item) => (
                        <span
                          key={item.id}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: PLATFORM_PINK_STYLES[item.platform].swatch,
                          }}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Platform Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-3 text-xs text-[#39313A]/75 border-t border-[#F4BFD3]/60">
              {(['Instagram', 'TikTok', 'Facebook', 'YouTube'] as SocialPlatform[]).map(
                (plat) => (
                  <span key={plat} className="inline-flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: PLATFORM_PINK_STYLES[plat].swatch }}
                    />
                    {plat}
                  </span>
                )
              )}
            </div>
          </div>
        </section>

        {/* Right: Selected Date Detail Panel */}
        <aside className="xl:col-span-5 relative overflow-visible">
          <PinkBow className="w-11 h-9 -top-4 -right-2 rotate-12 z-20 pointer-events-none absolute" />
          <WashiTape className="-bottom-2 left-8 rotate-2 z-20 absolute hidden sm:block" />

          <div className="scrapbook-card border-2 border-white ring-1 ring-[#F4BFD3] rounded-[2rem] p-6 space-y-5">
            <div className="flex items-center justify-between gap-2 pr-5">
              <div className="space-y-1">
                <StickerLabel text="PLAN IT!" variant="pink" className="-rotate-2" />
                <h2 className="text-sm font-bold text-[#39313A]">
                  Jadwal · {formatIndonesianDate(selectedDate)}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onCreateForDate(selectedDate)}
                className="text-xs font-semibold text-[#B55478] hover:text-[#9E3F63] cursor-pointer whitespace-nowrap"
              >
                + Tambah di Tanggal Ini
              </button>
            </div>

            {selectedDateItems.length === 0 ? (
              <div className="py-10 px-4 rounded-2xl border border-dashed border-[#D98EAA]/80 bg-white/75 text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <PinkFlower className="w-8 h-8 -rotate-6 sticker-interactive" />
                  <ChromeButterfly className="w-9 h-9 y2k-float-slow" />
                </div>
                <p className="text-xs font-semibold text-[#39313A]">
                  Belum ada konten pada tanggal ini
                </p>
                <p className="text-[11px] text-[#39313A]/65">
                  Klik tombol Tambah Jadwal untuk memasukkan rencana kontenmu.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateItems.map((item) => {
                  const style = PLATFORM_PINK_STYLES[item.platform];
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${style.surface} ${style.border} ${style.text}`}
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 text-[11px] font-mono opacity-90">
                          <PlatformGlyph platform={item.platform} className="w-3.5 h-3.5" />
                          <span>
                            {item.platform} · {item.format} · {item.scheduledTime} WIB
                          </span>
                        </div>
                        <p className="text-sm font-bold truncate">{item.title}</p>
                        <div className="text-[11px] opacity-90">
                          <StatusLabel status={item.status} />
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => onEditSchedule(item.id)}
                          className="p-2 rounded-full bg-white/90 text-[#39313A] hover:bg-white transition-colors cursor-pointer"
                          title="Ubah hari & jam"
                          aria-label="Ubah jadwal"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteItem(item.id)}
                          className="p-2 rounded-full bg-white/90 text-red-700 hover:bg-white transition-colors cursor-pointer"
                          title="Hapus jadwal"
                          aria-label="Hapus jadwal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {primaryEvalItem ? (
              <button
                type="button"
                onClick={() => onSaveAndContinueToEvaluation(primaryEvalItem.id)}
                className="w-full y2k-glossy-pink border-2 border-white text-white py-3.5 px-6 text-sm font-semibold rounded-full transition-all cursor-pointer"
              >
                Simpan Jadwal &amp; Evaluasi
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onCreateForDate(selectedDate)}
                className="w-full y2k-glossy-pink border-2 border-white text-white py-3.5 px-6 text-sm font-semibold rounded-full transition-all cursor-pointer"
              >
                Tambah Jadwal Pertama
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
