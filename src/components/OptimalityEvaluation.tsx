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
import { ChromeButterfly, ChromeSparkle, ChromeStar } from './Y2KDecorations';

interface OptimalityEvaluationProps {
  items: ContentItem[];
  focusedItemId: string | null;
  onBack: () => void;
  onStartNewPlan: () => void;
  onMarkNeedsRevision: (itemId: string, note: string) => void;
  onPublishContent: (itemId: string) => void;
}

export function OptimalityEvaluation({
  items,
  focusedItemId,
  onBack,
  onStartNewPlan,
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
    <div className="max-w-3xl mx-auto">
      <div className="y2k-glass-card border border-[#F4BFD3] rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#F8DCE8]/65 blur-2xl"
        />

        <div className="flex items-center justify-between relative z-10">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-full y2k-chrome-surface border border-slate-300/80 hover:border-[#D98EAA] flex items-center justify-center text-[#39313A]"
            aria-label="Kembali ke Kalender"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <ChromeStar className="w-4 h-4" />
            <h1 className="text-base sm:text-lg font-bold text-[#39313A]">
              Evaluasi Optimalitas Jadwal
            </h1>
          </div>

          <span className="w-10" aria-hidden="true" />
        </div>

        {queue.length > 1 && (
          <div className="space-y-1.5 relative z-10">
            <label htmlFor="eval-select" className="block text-xs font-semibold text-[#39313A]/70">
              Pilih Jadwal yang Dievaluasi
            </label>
            <select
              id="eval-select"
              value={currentItem?.id || ''}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full px-4 py-2.5 text-xs font-medium border border-[#F4BFD3] rounded-2xl bg-white text-[#39313A] focus:outline-none focus:border-[#B55478]"
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
          <div className="py-12 text-center space-y-4 relative z-10">
            <ChromeButterfly className="w-11 h-11 mx-auto y2k-float-slow" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-[#39313A]">
                Belum ada jadwal yang menunggu evaluasi
              </p>
              <p className="text-xs text-[#39313A]/70 max-w-sm mx-auto">
                Buat rencana konten terlebih dahulu untuk memeriksa apakah hari dan jam
                publikasinya sudah optimal.
              </p>
            </div>
            <button
              type="button"
              onClick={onStartNewPlan}
              className="y2k-glossy-pink text-white px-6 py-2.5 text-xs font-semibold rounded-full transition-all"
            >
              Buat Jadwal Baru
            </button>
          </div>
        ) : (
          <div className="space-y-6 relative z-10">
            <p className="text-center text-xs font-semibold tracking-wide text-[#B55478] inline-flex items-center justify-center gap-1.5 w-full">
              <ChromeSparkle className="w-3.5 h-3.5" />
              <span>Apakah Jadwal Sudah Optimal?</span>
            </p>

            {/* Centered Status Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white/85 border border-[#F4BFD3] text-center space-y-4">
              {optimality.isOptimal ? (
                <>
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-600 shadow-[0_8px_20px_-6px_rgba(5,150,105,0.45)] flex items-center justify-center text-white">
                    <Check className="w-8 h-8 stroke-[2.5]" />
                  </div>
                  <div className="space-y-1.5">
                    <h2 className="text-lg font-bold text-[#39313A]">
                      Jadwal Sudah Optimal!
                    </h2>
                    <p className="text-xs sm:text-sm text-[#39313A]/75 leading-relaxed max-w-md mx-auto">
                      Jadwal publikasi kamu sudah sesuai dengan analisis waktu aktif audiens dan
                      bebas bentrok jadwal.
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
                    <p className="text-xs sm:text-sm text-[#39313A]/75 leading-relaxed max-w-md mx-auto">
                      {optimality.recommendation}
                    </p>
                  </div>
                </>
              )}

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

            {optimality.isOptimal ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() =>
                    onMarkNeedsRevision(
                      currentItem.id,
                      'Pengguna memilih menyesuaikan ulang hari dan jam publikasi.'
                    )
                  }
                  className="flex-1 y2k-chrome-surface border border-slate-300/80 hover:border-[#D98EAA] text-[#39313A] py-3 px-5 text-xs sm:text-sm font-semibold rounded-full transition-all"
                >
                  Ubah Hari / Jam
                </button>
                <button
                  type="button"
                  onClick={() => onPublishContent(currentItem.id)}
                  className="flex-1 y2k-glossy-pink text-white py-3 px-6 text-xs sm:text-sm font-semibold rounded-full transition-all"
                >
                  Lanjutkan ke Publikasi
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() =>
                    onMarkNeedsRevision(currentItem.id, optimality.recommendation)
                  }
                  className="flex-1 y2k-glossy-pink text-white py-3 px-6 text-xs sm:text-sm font-semibold rounded-full inline-flex items-center justify-center gap-2 transition-all"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Perbaiki Jadwal Publikasi</span>
                </button>
                <button
                  type="button"
                  onClick={() => onPublishContent(currentItem.id)}
                  className="flex-1 y2k-chrome-surface border border-slate-300/80 hover:border-[#D98EAA] text-[#B55478] py-3 px-5 text-xs sm:text-sm font-semibold rounded-full transition-all"
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
