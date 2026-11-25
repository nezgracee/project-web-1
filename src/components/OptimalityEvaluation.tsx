import { useState } from 'react';
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  SlidersHorizontal,
} from 'lucide-react';
import { ContentItem } from '../types/content';
import {
  evaluateScheduleOptimality,
  formatIndonesianDate,
  getDayOfWeekFromDate,
} from '../utils/scheduleEngine';
import { PlatformGlyph } from './PlatformIcon';

interface OptimalityEvaluationProps {
  items: ContentItem[];
  focusedItemId: string | null;
  onBack: () => void;
  onMarkNeedsRevision: (itemId: string, note: string) => void;
  onPublishContent: (itemId: string) => void;
}

export function OptimalityEvaluation({
  items,
  focusedItemId,
  onBack,
  onMarkNeedsRevision,
  onPublishContent,
}: OptimalityEvaluationProps) {
  const queue = items.filter((i) => i.status !== 'Dipublikasikan');
  const [selectedId, setSelectedId] = useState<string>(
    focusedItemId && queue.some((i) => i.id === focusedItemId)
      ? focusedItemId
      : queue[0]?.id || ''
  );

  const currentItem = queue.find((i) => i.id === selectedId) || queue[0] || null;
  const optimality = currentItem
    ? evaluateScheduleOptimality(currentItem, items)
    : null;

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white border border-[#F4BFD3] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header matching Screen 9 of Sketch */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-xl border border-[#F4BFD3] hover:bg-[#F8DCE8]/50 flex items-center justify-center text-[#39313A]"
            aria-label="Kembali ke Kalender"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h1 className="text-base sm:text-lg font-bold text-[#39313A]">
            Evaluasi Jadwal
          </h1>

          <span className="w-9" aria-hidden="true" />
        </div>

        {/* Item Switcher if multiple scheduled items exist */}
        {queue.length > 1 && (
          <div className="space-y-1.5">
            <label htmlFor="eval-select" className="block text-xs font-semibold text-[#39313A]/70">
              Pilih Jadwal yang Dievaluasi
            </label>
            <select
              id="eval-select"
              value={currentItem?.id || ''}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-[#F4BFD3] rounded-xl bg-[#FDF8FA] text-[#39313A] focus:outline-none focus:border-[#B55478]"
            >
              {queue.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title} ({item.platform} · {formatIndonesianDate(item.scheduledDate)}{' '}
                  {item.scheduledTime})
                </option>
              ))}
            </select>
          </div>
        )}

        {!currentItem || !optimality ? (
          <div className="py-10 text-center space-y-3">
            <p className="text-sm font-semibold text-[#39313A]">
              Tidak ada jadwal yang menunggu evaluasi
            </p>
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#B55478] rounded-xl"
            >
              Kembali ke Kalender
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-center text-xs font-semibold tracking-wide text-[#B55478]">
              Apakah Jadwal Sudah Optimal?
            </p>

            {/* Centered Status Card matching Screen 9 of Sketch */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#FDF8FA] border border-[#F4BFD3] text-center space-y-4">
              {optimality.isOptimal ? (
                <>
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-600 flex items-center justify-center text-white">
                    <Check className="w-8 h-8 stroke-[2.5]" />
                  </div>
                  <div className="space-y-1.5">
                    <h2 className="text-lg font-bold text-[#39313A]">
                      Jadwal Sudah Optimal!
                    </h2>
                    <p className="text-xs sm:text-sm text-[#39313A]/75 leading-relaxed max-w-sm mx-auto">
                      Jadwal publikasi kamu sudah sesuai dengan analisis audiens.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#F8DCE8] border border-[#D98EAA] flex items-center justify-center text-[#B55478]">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <h2 className="text-lg font-bold text-[#39313A]">
                      Jadwal Belum Optimal
                    </h2>
                    <p className="text-xs sm:text-sm text-[#39313A]/75 leading-relaxed max-w-sm mx-auto">
                      {optimality.recommendation}
                    </p>
                  </div>
                </>
              )}

              {/* Content Summary Line */}
              <div className="pt-3 border-t border-[#F4BFD3]/70 flex flex-wrap items-center justify-center gap-2 text-xs text-[#39313A]/80">
                <PlatformGlyph platform={currentItem.platform} className="w-3.5 h-3.5" />
                <span className="font-semibold">{currentItem.title}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">
                  {getDayOfWeekFromDate(currentItem.scheduledDate)},{' '}
                  {formatIndonesianDate(currentItem.scheduledDate)} {currentItem.scheduledTime}{' '}
                  WIB
                </span>
              </div>
            </div>

            {/* Decision Buttons */}
            {optimality.isOptimal ? (
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => onPublishContent(currentItem.id)}
                  className="w-full py-3.5 px-6 text-sm sm:text-base font-semibold text-white bg-[#B55478] hover:bg-[#9E3F63] rounded-2xl transition-colors"
                >
                  Lanjutkan ke Publikasi
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onMarkNeedsRevision(
                      currentItem.id,
                      'Pengguna memilih menyesuaikan ulang hari dan jam publikasi.'
                    )
                  }
                  className="w-full py-2.5 px-4 text-xs font-medium text-[#39313A]/75 hover:text-[#39313A] hover:bg-[#F8DCE8]/40 rounded-xl transition-colors"
                >
                  Belum Optimal? Perbaiki Jadwal Publikasi
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() =>
                    onMarkNeedsRevision(currentItem.id, optimality.recommendation)
                  }
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 text-sm sm:text-base font-semibold text-white bg-[#B55478] hover:bg-[#9E3F63] rounded-2xl transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Perbaiki Jadwal Publikasi
                </button>
                <button
                  type="button"
                  onClick={() => onPublishContent(currentItem.id)}
                  className="w-full py-2.5 px-4 text-xs font-medium text-[#B55478] hover:bg-[#F8DCE8]/40 rounded-xl transition-colors"
                >
                  Tetap Lanjutkan ke Publikasi
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
