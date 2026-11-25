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
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-[#F4BFD3] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-xl border border-[#F4BFD3] hover:bg-[#F8DCE8]/50 flex items-center justify-center text-[#39313A]"
            aria-label="Kembali"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h1 className="text-base sm:text-lg font-bold text-[#39313A]">
            Kalender Konten
          </h1>

          <button
            type="button"
            onClick={() => onCreateForDate(selectedDate)}
            className="w-9 h-9 rounded-xl bg-[#F8DCE8] hover:bg-[#F4BFD3] flex items-center justify-center text-[#B55478]"
            title="Tambah jadwal baru"
            aria-label="Tambah jadwal baru"
          >
            <CalendarPlus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#FDF8FA] border border-[#F4BFD3] rounded-xl overflow-x-auto">
          {(['Semua', 'Instagram', 'TikTok', 'Facebook', 'YouTube'] as const).map(
            (plat) => (
              <button
                key={plat}
                type="button"
                onClick={() => setPlatformFilter(plat)}
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  platformFilter === plat
                    ? 'bg-[#B55478] text-white'
                    : 'text-[#39313A]/75 hover:bg-[#F8DCE8]/50'
                }`}
              >
                {plat}
              </button>
            )
          )}
        </div>

        <div className="flex items-center justify-between px-2">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-[#F8DCE8]/50 text-[#39313A]"
            aria-label="Bulan sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm sm:text-base font-bold text-[#39313A]">
            {MONTH_NAMES[month]} {year}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-[#F8DCE8]/50 text-[#39313A]"
            aria-label="Bulan berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-[#39313A]/65 pb-1">
            {WEEKDAY_HEADERS.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-2 justify-items-center">
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
                  className="flex flex-col items-center gap-1 group"
                >
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-mono tabular-nums transition-colors ${
                      isSelected
                        ? 'bg-[#B55478] text-white font-bold'
                        : hasScheduled
                          ? 'bg-[#F8DCE8] text-[#39313A] font-semibold group-hover:bg-[#F4BFD3]'
                          : 'text-[#39313A] hover:bg-[#FDF8FA]'
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
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-[11px] text-[#39313A]/75 border-t border-[#F4BFD3]/60">
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

        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#39313A]">
              Jadwal Tanggal {formatIndonesianDate(selectedDate)}
            </span>
            <button
              type="button"
              onClick={() => onCreateForDate(selectedDate)}
              className="font-semibold text-[#B55478] hover:text-[#9E3F63]"
            >
              + Tambah di Tanggal Ini
            </button>
          </div>

          {selectedDateItems.length === 0 ? (
            <div className="p-4 rounded-2xl border border-dashed border-[#F4BFD3] bg-[#FDF8FA] text-center text-xs text-[#39313A]/65">
              Belum ada konten dijadwalkan pada tanggal ini.
            </div>
          ) : (
            <div className="space-y-2">
              {selectedDateItems.map((item) => {
                const style = PLATFORM_PINK_STYLES[item.platform];
                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${style.surface} ${style.border} ${style.text}`}
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 text-[11px] font-mono opacity-90">
                        <PlatformGlyph platform={item.platform} className="w-3.5 h-3.5" />
                        <span>
                          {item.platform} · {item.format} · {item.scheduledTime} WIB
                        </span>
                      </div>
                      <p className="text-sm font-semibold truncate">{item.title}</p>
                      <div className="text-[11px] opacity-85">
                        <StatusLabel status={item.status} />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onEditSchedule(item.id)}
                        className="p-2 rounded-xl bg-white/85 text-[#39313A] hover:bg-white transition-colors"
                        title="Ubah hari & jam"
                        aria-label="Ubah jadwal"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteItem(item.id)}
                        className="p-2 rounded-xl bg-white/85 text-red-700 hover:bg-white transition-colors"
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
        </div>

        {primaryEvalItem ? (
          <button
            type="button"
            onClick={() => onSaveAndContinueToEvaluation(primaryEvalItem.id)}
            className="w-full py-3.5 px-6 text-sm sm:text-base font-semibold text-white bg-[#B55478] hover:bg-[#9E3F63] rounded-2xl transition-colors"
          >
            Simpan Jadwal &amp; Evaluasi
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onCreateForDate(selectedDate)}
            className="w-full py-3.5 px-6 text-sm sm:text-base font-semibold text-white bg-[#B55478] hover:bg-[#9E3F63] rounded-2xl transition-colors"
          >
            Tambah Jadwal Pertama
          </button>
        )}
      </div>
    </div>
  );
}
