import { useEffect, useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  Pencil,
  Plus,
  Save,
} from 'lucide-react';
import { ContentItem, PerformanceMetrics } from '../types/content';
import {
  calculateEngagementRate,
  formatIndonesianDate,
} from '../utils/scheduleEngine';
import { PlatformGlyph } from './PlatformIcon';
import {
  AbstractFlower,
  ChromeSparkle,
  ChromeStar,
  GlossyHeart,
} from './Y2KDecorations';

interface PerformanceMonitoringProps {
  items: ContentItem[];
  focusedItemId?: string | null;
  onBack: () => void;
  onStartNewPlan: () => void;
  onUpdatePerformance: (itemId: string, metrics: PerformanceMetrics) => void;
  onSaveEvaluationNote: (itemId: string, note: string) => void;
  onFinish: () => void;
}

function formatCompactMetric(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return num.toLocaleString('id-ID');
}

export function PerformanceMonitoring({
  items,
  focusedItemId,
  onBack,
  onStartNewPlan,
  onUpdatePerformance,
  onSaveEvaluationNote,
  onFinish,
}: PerformanceMonitoringProps) {
  const publishedItems = items.filter((i) => i.status === 'Dipublikasikan');
  const [selectedId, setSelectedId] = useState<string>(
    focusedItemId && publishedItems.some((i) => i.id === focusedItemId)
      ? focusedItemId
      : publishedItems[0]?.id || ''
  );

  const currentItem =
    publishedItems.find((i) => i.id === selectedId) || publishedItems[0] || null;

  const [isEditing, setIsEditing] = useState(false);
  const [views, setViews] = useState<number>(currentItem?.performance.views || 0);
  const [likes, setLikes] = useState<number>(currentItem?.performance.likes || 0);
  const [comments, setComments] = useState<number>(
    currentItem?.performance.comments || 0
  );
  const [shares, setShares] = useState<number>(currentItem?.performance.shares || 0);
  const [note, setNote] = useState<string>(currentItem?.evaluationNote || '');
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (currentItem) {
      setViews(currentItem.performance.views);
      setLikes(currentItem.performance.likes);
      setComments(currentItem.performance.comments);
      setShares(currentItem.performance.shares);
      setNote(currentItem.evaluationNote || '');
      if (currentItem.performance.views === 0 && !currentItem.performance.recordedAt) {
        setIsEditing(true);
      }
    }
  }, [currentItem?.id]);

  const engagementRate = currentItem
    ? calculateEngagementRate(
        isEditing ? { views, likes, comments, shares } : currentItem.performance
      )
    : 0;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem) return;
    onUpdatePerformance(currentItem.id, {
      views: Math.max(0, Number(views) || 0),
      likes: Math.max(0, Number(likes) || 0),
      comments: Math.max(0, Number(comments) || 0),
      shares: Math.max(0, Number(shares) || 0),
      recordedAt: '2026-11-24',
    });
    onSaveEvaluationNote(currentItem.id, note.trim());
    setIsEditing(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2200);
  };

  const chartBase = currentItem ? Math.max(currentItem.performance.views, 100) : 100;
  const hasRealData = currentItem ? currentItem.performance.views > 0 : false;
  const wavePoints = hasRealData
    ? [
        Math.round(chartBase * 0.22),
        Math.round(chartBase * 0.45),
        Math.round(chartBase * 0.38),
        Math.round(chartBase * 0.68),
        Math.round(chartBase * 0.56),
        Math.round(chartBase * 0.88),
        chartBase,
      ]
    : [0, 0, 0, 0, 0, 0, 0];

  const maxPoint = Math.max(...wavePoints, 1);
  const coords = wavePoints.map((val, idx) => {
    const x = idx * 60;
    const y = hasRealData ? 95 - (val / maxPoint) * 75 : 95;
    return { x, y };
  });
  const linePath = coords
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');
  const areaPath = `${linePath} L 360 110 L 0 110 Z`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-full y2k-chrome-surface border border-slate-300/80 hover:border-[#D98EAA] flex items-center justify-center text-[#39313A]"
            aria-label="Kembali"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#39313A] inline-flex items-center gap-2">
              <span>Monitoring &amp; Hasil Publikasi</span>
              <ChromeSparkle className="w-4 h-4" />
            </h1>
            <p className="text-xs sm:text-sm text-[#39313A]/65">
              Catat performa konten dan evaluasi hasil publikasi untuk siklus berikutnya.
            </p>
          </div>
        </div>

        {currentItem && (
          <button
            type="button"
            onClick={() => setIsEditing((v) => !v)}
            className="y2k-chrome-surface border border-slate-300/80 hover:border-[#D98EAA] text-[#39313A] px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            <Pencil className="w-3.5 h-3.5 text-[#B55478]" />
            <span>{isEditing ? 'Tutup Editor' : 'Catat Metrik'}</span>
          </button>
        )}
      </div>

      {!currentItem ? (
        <div className="y2k-glass-card border border-[#F4BFD3] rounded-3xl p-12 text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <AbstractFlower className="w-8 h-8" />
            <span className="w-12 h-12 rounded-full y2k-chrome-surface border border-slate-300/80 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-[#B55478]" />
            </span>
            <ChromeStar className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-[#39313A]">
              Belum ada konten yang dipublikasikan
            </p>
            <p className="text-xs text-[#39313A]/70 max-w-sm mx-auto leading-relaxed">
              Buat rencana konten, jadwalkan di kalender, dan lanjutkan ke publikasi untuk
              mencatat performa konten Anda di sini.
            </p>
          </div>
          <button
            type="button"
            onClick={onStartNewPlan}
            className="y2k-glossy-pink text-white px-6 py-2.5 text-xs font-semibold rounded-full inline-flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Jadwal Konten</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Content Selector */}
          <div className="y2k-glass-card border border-[#F4BFD3] rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#39313A]">
              <GlossyHeart className="w-4 h-4 shrink-0" />
              <span>Konten Terpublikasi ({publishedItems.length})</span>
            </div>
            <select
              aria-label="Pilih konten terpublikasi"
              value={currentItem.id}
              onChange={(e) => {
                setSelectedId(e.target.value);
                setIsEditing(false);
              }}
              className="sm:w-80 px-4 py-2 text-xs font-medium border border-[#F4BFD3] rounded-full bg-white text-[#39313A] focus:outline-none focus:border-[#B55478]"
            >
              {publishedItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title} ({item.platform} · {formatIndonesianDate(item.scheduledDate)})
                </option>
              ))}
            </select>
          </div>

          {/* Chart & Metrics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <section className="lg:col-span-7 y2k-glass-card border border-[#F4BFD3] rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#39313A]">Performa Konten</h2>
                <span className="inline-flex items-center gap-1.5 text-xs text-[#39313A]/75">
                  <PlatformGlyph platform={currentItem.platform} className="w-3.5 h-3.5" />
                  {currentItem.platform} · {currentItem.format}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/85 border border-[#F4BFD3]">
                <svg
                  viewBox="0 0 360 110"
                  className="w-full h-36 overflow-visible"
                  role="img"
                  aria-label="Grafik performa konten"
                >
                  <defs>
                    <linearGradient id="pinkAreaY2K" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D98EAA" stopOpacity="0.45" />
                      <stop offset="65%" stopColor="#F4BFD3" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  <path d={areaPath} fill="url(#pinkAreaY2K)" />
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#B55478"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {coords.map((pt, idx) => (
                    <circle
                      key={idx}
                      cx={pt.x}
                      cy={pt.y}
                      r={idx === coords.length - 1 ? 5 : 3}
                      fill={idx === coords.length - 1 ? '#B55478' : '#FFFFFF'}
                      stroke="#B55478"
                      strokeWidth="2"
                    />
                  ))}
                </svg>
                <div className="flex justify-between text-[10px] font-mono text-[#39313A]/55 pt-1">
                  <span>Hari 1</span>
                  <span>Hari 3</span>
                  <span>Hari 5</span>
                  <span>Hari 7</span>
                </div>
              </div>
            </section>

            {/* Right Metrics Column */}
            <section className="lg:col-span-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="y2k-glass-card border border-[#F4BFD3] rounded-3xl p-4 text-center">
                  <p className="text-2xl font-bold font-mono tabular-nums text-[#39313A]">
                    {formatCompactMetric(currentItem.performance.views)}
                  </p>
                  <p className="text-xs text-[#39313A]/65 mt-0.5">Views</p>
                </div>
                <div className="y2k-glass-card border border-[#F4BFD3] rounded-3xl p-4 text-center">
                  <p className="text-2xl font-bold font-mono tabular-nums text-[#39313A]">
                    {formatCompactMetric(currentItem.performance.likes)}
                  </p>
                  <p className="text-xs text-[#39313A]/65 mt-0.5">Likes</p>
                </div>
                <div className="y2k-glass-card border border-[#F4BFD3] rounded-3xl p-4 text-center">
                  <p className="text-2xl font-bold font-mono tabular-nums text-[#39313A]">
                    {formatCompactMetric(currentItem.performance.comments)}
                  </p>
                  <p className="text-xs text-[#39313A]/65 mt-0.5">Comments</p>
                </div>
                <div className="y2k-glass-card border border-[#F4BFD3] rounded-3xl p-4 text-center">
                  <p className="text-2xl font-bold font-mono tabular-nums text-[#39313A]">
                    {formatCompactMetric(currentItem.performance.shares)}
                  </p>
                  <p className="text-xs text-[#39313A]/65 mt-0.5">Shares</p>
                </div>
              </div>

              <div className="p-4 rounded-3xl bg-gradient-to-r from-[#F8DCE8] to-white border border-[#D98EAA] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#39313A] inline-flex items-center gap-1.5">
                  <ChromeStar className="w-4 h-4" />
                  Engagement Rate
                </span>
                <span className="text-xl font-bold font-mono tabular-nums text-[#B55478]">
                  {engagementRate}%
                </span>
              </div>
            </section>
          </div>

          {isEditing && (
            <form
              onSubmit={handleSave}
              className="y2k-glass-card border border-[#D98EAA] rounded-3xl p-6 space-y-4"
            >
              <p className="text-xs font-bold text-[#39313A]">
                Input Data Performa Konten
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label htmlFor="in-views" className="block text-[11px] text-[#39313A]/70 mb-1">
                    Views
                  </label>
                  <input
                    id="in-views"
                    type="number"
                    min={0}
                    value={views}
                    onChange={(e) => setViews(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono border border-[#F4BFD3] rounded-2xl bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="in-likes" className="block text-[11px] text-[#39313A]/70 mb-1">
                    Likes
                  </label>
                  <input
                    id="in-likes"
                    type="number"
                    min={0}
                    value={likes}
                    onChange={(e) => setLikes(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono border border-[#F4BFD3] rounded-2xl bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="in-comm" className="block text-[11px] text-[#39313A]/70 mb-1">
                    Comments
                  </label>
                  <input
                    id="in-comm"
                    type="number"
                    min={0}
                    value={comments}
                    onChange={(e) => setComments(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono border border-[#F4BFD3] rounded-2xl bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="in-shares" className="block text-[11px] text-[#39313A]/70 mb-1">
                    Shares
                  </label>
                  <input
                    id="in-shares"
                    type="number"
                    min={0}
                    value={shares}
                    onChange={(e) => setShares(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono border border-[#F4BFD3] rounded-2xl bg-white"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="in-note" className="block text-[11px] text-[#39313A]/70 mb-1">
                  Kesimpulan Evaluasi
                </label>
                <input
                  id="in-note"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Tulis kesimpulan performa kontenmu di sini..."
                  className="w-full px-4 py-2 text-xs border border-[#F4BFD3] rounded-2xl bg-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-medium text-[#39313A] bg-white border border-[#F4BFD3] rounded-full"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="y2k-glossy-pink text-white px-5 py-2 text-xs font-semibold rounded-full inline-flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Simpan
                </button>
              </div>
            </form>
          )}

          {savedNotice && (
            <p className="text-xs font-semibold text-emerald-700 text-center">
              Statistik &amp; kesimpulan evaluasi berhasil disimpan!
            </p>
          )}

          {/* Kesimpulan & Selesai */}
          <section className="y2k-glass-card border border-[#F4BFD3] rounded-3xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-[#39313A]">Kesimpulan Evaluasi</h2>
            <div className="p-4 rounded-2xl bg-[#F8DCE8]/45 border border-[#F4BFD3] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs text-[#39313A] leading-relaxed">
                <p className="font-semibold">
                  {currentItem.evaluationNote ||
                    (currentItem.performance.views === 0
                      ? 'Belum ada data metrik. Klik Catat Metrik di kanan atas untuk memasukkan hasil Views, Likes, Comments, dan Shares.'
                      : engagementRate >= 5
                        ? 'Kontenmu mendapatkan engagement yang baik!'
                        : 'Konten telah dipublikasikan. Evaluasi jam tayang atau format untuk peningkatan berikutnya.')}
                </p>
                <p className="text-[#39313A]/70 mt-1">
                  Dipublikasikan pada {formatIndonesianDate(currentItem.scheduledDate)} pukul{' '}
                  {currentItem.scheduledTime} WIB di {currentItem.platform}.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onFinish}
              className="w-full y2k-glossy-pink text-white py-3.5 px-6 text-sm font-semibold rounded-full transition-all cursor-pointer"
            >
              Selesai
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
