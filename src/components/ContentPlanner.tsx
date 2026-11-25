import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  Film,
  GraduationCap,
  Image as ImageIcon,
  Layers,
  Lightbulb,
  Plus,
  Smile,
  Tag,
  TrendingUp,
  Video,
  Clock,
  X,
} from 'lucide-react';
import {
  AGE_RANGE_OPTIONS,
  GOAL_OPTIONS,
  HABIT_OPTIONS,
  INTEREST_OPTIONS,
} from '../data/initialData';
import {
  ContentFormat,
  ContentGoal,
  ContentItem,
  DayOfWeek,
  FlowStep,
  SocialPlatform,
} from '../types/content';
import {
  DAYS_OF_WEEK,
  PLATFORM_FORMATS,
  PLATFORM_PEAK_DEFAULTS,
  PRESET_TIMES,
  TIME_WINDOWS,
  getAudienceActivityScores,
  getDayOfWeekFromDate,
  getNextDateForDay,
  getSuggestedAudienceWindows,
  suggestTimeFromWindows,
} from '../utils/scheduleEngine';
import { PlatformGlyph } from './PlatformIcon';

interface ContentPlannerProps {
  currentStep: FlowStep;
  onChangeStep: (step: FlowStep) => void;
  existingItems: ContentItem[];
  editingItem: ContentItem | null;
  prefilledDate?: string;
  onSaveDraftAndGoCalendar: (item: ContentItem, isEdit: boolean) => void;
  onBackToHome: () => void;
}

const STEP_SEQUENCE: FlowStep[] = [
  'goal',
  'audience',
  'platform',
  'idea',
  'active_time',
  'schedule_time',
];

const STEP_TITLES: Record<string, string> = {
  goal: 'Tujuan Konten',
  audience: 'Target Audiens',
  platform: 'Platform',
  idea: 'Ide Konten',
  active_time: 'Waktu Aktif Audiens',
  schedule_time: 'Jadwal Publikasi',
};

const GOAL_ICONS: Record<ContentGoal, typeof GraduationCap> = {
  Edukasi: GraduationCap,
  Promosi: Tag,
  Hiburan: Smile,
  'Meningkatkan Engagement': TrendingUp,
};

const FORMAT_ITEMS: { id: ContentFormat; icon: typeof ImageIcon }[] = [
  { id: 'Foto', icon: ImageIcon },
  { id: 'Video', icon: Video },
  { id: 'Reels', icon: Film },
  { id: 'Carousel', icon: Layers },
  { id: 'Story', icon: Clock },
];

export function ContentPlanner({
  currentStep,
  onChangeStep,
  editingItem,
  prefilledDate,
  onSaveDraftAndGoCalendar,
  onBackToHome,
}: ContentPlannerProps) {
  const [goal, setGoal] = useState<ContentGoal>('Edukasi');
  const [ageRange, setAgeRange] = useState<string>(AGE_RANGE_OPTIONS[0]);
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState<string>('');
  const [usageHabit, setUsageHabit] = useState<string>(HABIT_OPTIONS[0]);
  const [platform, setPlatform] = useState<SocialPlatform>('Instagram');
  const [title, setTitle] = useState<string>('');
  const [ideaDescription, setIdeaDescription] = useState<string>('');
  const [format, setFormat] = useState<ContentFormat>('Carousel');
  const [activeDays, setActiveDays] = useState<DayOfWeek[]>(['Selasa', 'Rabu', 'Kamis']);
  const [activeTimeWindows, setActiveTimeWindows] = useState<string[]>([
    '11:30 - 13:30',
    '19:00 - 21:00',
  ]);
  const [scheduledDate, setScheduledDate] = useState<string>(prefilledDate || '2026-11-24');
  const [scheduledTime, setScheduledTime] = useState<string>('19:00');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (editingItem) {
      setGoal(editingItem.goal);
      setAgeRange(editingItem.audience.ageRange);
      setInterests(editingItem.audience.interests);
      setUsageHabit(editingItem.audience.usageHabit);
      setPlatform(editingItem.platform);
      setTitle(editingItem.title);
      setIdeaDescription(editingItem.ideaDescription);
      setFormat(editingItem.format);
      setActiveDays(editingItem.audience.activeDays);
      setActiveTimeWindows(editingItem.audience.activeTimeWindows);
      setScheduledDate(editingItem.scheduledDate);
      setScheduledTime(editingItem.scheduledTime);
    } else if (prefilledDate) {
      setScheduledDate(prefilledDate);
    }
    setErrorMsg('');
  }, [editingItem, prefilledDate]);

  const stepIndex = Math.max(0, STEP_SEQUENCE.indexOf(currentStep));

  const handleBack = () => {
    setErrorMsg('');
    if (stepIndex === 0) {
      onBackToHome();
    } else {
      onChangeStep(STEP_SEQUENCE[stepIndex - 1]);
    }
  };

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const addCustomInterest = () => {
    const val = customInterest.trim();
    if (!val) return;
    if (!interests.includes(val)) setInterests((prev) => [...prev, val]);
    setCustomInterest('');
  };

  const handlePlatformSelect = (selected: SocialPlatform) => {
    setPlatform(selected);
    if (!PLATFORM_FORMATS[selected].includes(format)) {
      setFormat(PLATFORM_FORMATS[selected][0]);
    }
    if (!editingItem) {
      const suggested = getSuggestedAudienceWindows(selected, usageHabit);
      setActiveDays(suggested.days);
      setActiveTimeWindows(suggested.windows);
      setScheduledDate(getNextDateForDay(suggested.days[0] || 'Selasa'));
      setScheduledTime(suggestTimeFromWindows(suggested.windows));
    }
  };

  const toggleActiveDay = (day: DayOfWeek) => {
    setActiveDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const activityScores = getAudienceActivityScores(platform, usageHabit, activeDays);
  const topActivity = [...activityScores].sort((a, b) => b.score - a.score)[0];
  const peakTimeRange =
    activeTimeWindows.find((w) => w.includes('19:00')) ||
    activeTimeWindows[0] ||
    PLATFORM_PEAK_DEFAULTS[platform].peakHour;

  const selectedDayName = getDayOfWeekFromDate(scheduledDate);

  const handleContinue = () => {
    setErrorMsg('');

    if (currentStep === 'audience' && interests.length === 0) {
      setErrorMsg('Pilih minimal 1 minat audiens.');
      return;
    }

    if (currentStep === 'idea' && !title.trim()) {
      setErrorMsg('Masukkan ide atau judul konten terlebih dahulu.');
      return;
    }

    if (currentStep === 'schedule_time') {
      const item: ContentItem = {
        id: editingItem ? editingItem.id : `cnt-${Date.now()}`,
        title: title.trim() || 'Konten Baru',
        ideaDescription:
          ideaDescription.trim() || `Konten ${format} untuk tujuan ${goal} di ${platform}.`,
        goal,
        audience: {
          ageRange,
          interests: interests.length ? interests : ['Teknologi'],
          usageHabit,
          activeDays: activeDays.length ? activeDays : [topActivity.day],
          activeTimeWindows: activeTimeWindows.length
            ? activeTimeWindows
            : [peakTimeRange],
        },
        platform,
        format,
        scheduledDate,
        scheduledTime,
        status: 'Terjadwal',
        revisionCount: editingItem ? editingItem.revisionCount + 1 : 0,
        revisionNote: undefined,
        performance: editingItem?.performance || {
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
        },
        createdAt: editingItem?.createdAt || '2026-11-24',
      };
      onSaveDraftAndGoCalendar(item, Boolean(editingItem));
      return;
    }

    onChangeStep(STEP_SEQUENCE[stepIndex + 1]);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white border border-[#F4BFD3] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Sketch-Style Header: < Back + Centered Title + Progress */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="w-9 h-9 rounded-xl border border-[#F4BFD3] hover:bg-[#F8DCE8]/50 flex items-center justify-center text-[#39313A] transition-colors"
            aria-label="Kembali"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h1 className="text-base sm:text-lg font-bold text-[#39313A]">
            {STEP_TITLES[currentStep]}
          </h1>

          <span className="text-xs font-mono font-semibold text-[#B55478] tabular-nums w-9 text-right">
            {stepIndex + 1}/6
          </span>
        </div>

        {/* Subtle Progress Line */}
        <div className="w-full h-1.5 bg-[#F8DCE8] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#B55478] rounded-full transition-all duration-300"
            style={{ width: `${((stepIndex + 1) / 6) * 100}%` }}
          />
        </div>

        {editingItem?.revisionNote && currentStep === 'schedule_time' && (
          <div className="p-3.5 bg-[#F8DCE8] border border-[#D98EAA] rounded-2xl flex items-start gap-2.5 text-xs text-[#39313A]">
            <AlertTriangle className="w-4 h-4 text-[#B55478] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Perbaikan Jadwal Publikasi</p>
              <p className="mt-0.5">{editingItem.revisionNote}</p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-[#F8DCE8]/80 border border-[#B55478] rounded-xl text-xs text-[#39313A] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#B55478] shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* SCREEN 2: TUJUAN KONTEN */}
        {currentStep === 'goal' && (
          <div className="space-y-4">
            <p className="text-sm text-[#39313A]/80">
              Apa tujuan utama dari konten ini?
            </p>
            <div className="space-y-3">
              {GOAL_OPTIONS.map((opt) => {
                const Icon = GOAL_ICONS[opt.value];
                const selected = goal === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setGoal(opt.value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-colors ${
                      selected
                        ? 'border-[#B55478] bg-[#F8DCE8]/55'
                        : 'border-[#F4BFD3] bg-white hover:bg-[#FDF8FA]'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        selected ? 'bg-[#B55478] text-white' : 'bg-[#F8DCE8] text-[#B55478]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#39313A]">{opt.value}</p>
                      <p className="text-xs text-[#39313A]/65 mt-0.5">{opt.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SCREEN 3: TARGET AUDIENS */}
        {currentStep === 'audience' && (
          <div className="space-y-4">
            <p className="text-sm text-[#39313A]/80">Siapa target audiens kamu?</p>

            <div className="space-y-1.5">
              <label htmlFor="usia-select" className="block text-xs font-semibold text-[#39313A]">
                Usia
              </label>
              <select
                id="usia-select"
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-[#F4BFD3] rounded-xl bg-white text-[#39313A] focus:outline-none focus:border-[#B55478]"
              >
                {AGE_RANGE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#39313A]">Minat</label>
              <div className="p-3 border border-[#F4BFD3] rounded-xl bg-[#FDF8FA] flex flex-wrap gap-2">
                {interests.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleInterest(item)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-[#F8DCE8] text-[#39313A] border border-[#D98EAA] rounded-lg"
                  >
                    <span>{item}</span>
                    <X className="w-3 h-3 text-[#B55478]" />
                  </button>
                ))}
                {interests.length === 0 && (
                  <span className="text-xs text-[#39313A]/50">Pilih minat di bawah...</span>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {INTEREST_OPTIONS.filter((opt) => !interests.includes(opt)).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleInterest(opt)}
                    className="px-2.5 py-1 text-[11px] text-[#39313A]/80 border border-[#F4BFD3] rounded-lg hover:bg-[#F8DCE8]/50 transition-colors"
                  >
                    + {opt}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomInterest();
                    }
                  }}
                  placeholder="Tambah minat lain..."
                  className="flex-1 px-3 py-2 text-xs border border-[#F4BFD3] rounded-xl focus:outline-none focus:border-[#B55478]"
                />
                <button
                  type="button"
                  onClick={addCustomInterest}
                  className="px-3 py-2 text-xs font-medium text-[#39313A] bg-[#F8DCE8] hover:bg-[#F4BFD3] rounded-xl inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="habit-select" className="block text-xs font-semibold text-[#39313A]">
                Kebiasaan Penggunaan
              </label>
              <select
                id="habit-select"
                value={usageHabit}
                onChange={(e) => setUsageHabit(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-[#F4BFD3] rounded-xl bg-white text-[#39313A] focus:outline-none focus:border-[#B55478]"
              >
                {HABIT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* SCREEN 4: PLATFORM MEDIA SOSIAL */}
        {currentStep === 'platform' && (
          <div className="space-y-4">
            <p className="text-sm text-[#39313A]/80">
              Di platform mana kamu akan mempublikasikan?
            </p>
            <div className="space-y-3">
              {(['Instagram', 'TikTok', 'Facebook', 'YouTube'] as SocialPlatform[]).map(
                (plat) => {
                  const selected = platform === plat;
                  return (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => handlePlatformSelect(plat)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-colors ${
                        selected
                          ? 'border-[#B55478] bg-[#F8DCE8]/55'
                          : 'border-[#F4BFD3] bg-white hover:bg-[#FDF8FA]'
                      }`}
                    >
                      <span className="flex items-center gap-3.5">
                        <span className="w-10 h-10 rounded-xl bg-[#F8DCE8] flex items-center justify-center">
                          <PlatformGlyph platform={plat} className="w-5 h-5" />
                        </span>
                        <span className="text-sm font-bold text-[#39313A]">{plat}</span>
                      </span>
                      <span className="text-xs font-mono text-[#B55478]">
                        {PLATFORM_PEAK_DEFAULTS[plat].peakHour}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* SCREEN 5: IDE & JENIS KONTEN */}
        {currentStep === 'idea' && (
          <div className="space-y-4">
            <p className="text-sm text-[#39313A]/80">
              Masukkan ide konten atau pilih jenisnya.
            </p>

            <div className="space-y-1.5">
              <label htmlFor="idea-title" className="block text-xs font-semibold text-[#39313A]">
                Ide / Judul Konten
              </label>
              <input
                id="idea-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Tips belajar efektif..."
                className="w-full px-3.5 py-2.5 text-sm border border-[#F4BFD3] rounded-xl focus:outline-none focus:border-[#B55478]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="idea-desc" className="block text-xs font-semibold text-[#39313A]">
                Deskripsi Konten
              </label>
              <textarea
                id="idea-desc"
                rows={3}
                value={ideaDescription}
                onChange={(e) => setIdeaDescription(e.target.value)}
                placeholder="Tuliskan deskripsi singkat atau alur konten..."
                className="w-full px-3.5 py-2.5 text-sm border border-[#F4BFD3] rounded-xl focus:outline-none focus:border-[#B55478]"
              />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#39313A]">Jenis Konten:</p>
              <div className="grid grid-cols-5 gap-2">
                {FORMAT_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const selected = format === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormat(item.id)}
                      className={`py-3 px-1 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-colors ${
                        selected
                          ? 'border-[#B55478] bg-[#F8DCE8]/70 text-[#39313A]'
                          : 'border-[#F4BFD3] bg-white text-[#39313A]/75 hover:bg-[#FDF8FA]'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          selected ? 'text-[#B55478]' : 'text-[#D98EAA]'
                        }`}
                      />
                      <span className="text-[11px] font-medium">{item.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 6: WAKTU AKTIF AUDIENS */}
        {currentStep === 'active_time' && (
          <div className="space-y-5">
            <p className="text-sm text-[#39313A]/80">
              Kapan audiens kamu paling aktif?
            </p>

            {/* Bar Chart matching Screen 6 of Sketch */}
            <div className="p-4 sm:p-5 bg-[#FDF8FA] border border-[#F4BFD3] rounded-2xl space-y-4">
              <div className="grid grid-cols-7 gap-2 items-end h-40 pt-3">
                {activityScores.map((bar) => {
                  const isTop = bar.day === topActivity.day;
                  const isActive = activeDays.includes(bar.day);
                  return (
                    <button
                      key={bar.day}
                      type="button"
                      onClick={() => toggleActiveDay(bar.day)}
                      className="h-full flex flex-col items-center justify-end gap-2"
                      title={`Klik untuk pilih ${bar.day}`}
                    >
                      <span className="text-[10px] font-mono tabular-nums text-[#39313A]/65">
                        {bar.score}%
                      </span>
                      <div className="w-full max-w-[32px] h-24 bg-[#F8DCE8]/60 rounded-t-lg flex items-end overflow-hidden">
                        <div
                          className={`w-full rounded-t-lg transition-all duration-300 ${
                            isTop
                              ? 'bg-[#B55478]'
                              : isActive
                                ? 'bg-[#D98EAA]'
                                : 'bg-[#F4BFD3]'
                          }`}
                          style={{ height: `${bar.score}%` }}
                        />
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          isTop || isActive ? 'text-[#B55478] font-bold' : 'text-[#39313A]/70'
                        }`}
                      >
                        {bar.day.slice(0, 3)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Highlight Callout Box matching Sketch */}
            <div className="p-4 bg-[#F8DCE8]/75 border border-[#D98EAA] rounded-2xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0">
                <Lightbulb className="w-4 h-4 text-[#B55478]" />
              </div>
              <div className="text-xs text-[#39313A] space-y-0.5">
                <p className="font-semibold">Puncak aktivitas tertinggi:</p>
                <p className="font-bold text-sm text-[#B55478]">
                  {topActivity.day}, {peakTimeRange} WIB
                </p>
              </div>
            </div>

            {/* Adjustable Active Windows */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#39313A]">
                Rentang Jam Aktif ({platform}):
              </p>
              <div className="flex flex-wrap gap-2">
                {TIME_WINDOWS.map((win) => {
                  const selected = activeTimeWindows.includes(win);
                  return (
                    <button
                      key={win}
                      type="button"
                      onClick={() =>
                        setActiveTimeWindows((prev) =>
                          prev.includes(win)
                            ? prev.filter((w) => w !== win)
                            : [...prev, win]
                        )
                      }
                      className={`px-3 py-1.5 text-xs font-mono rounded-xl border transition-colors ${
                        selected
                          ? 'bg-[#B55478] border-[#B55478] text-white'
                          : 'bg-white border-[#F4BFD3] text-[#39313A]'
                      }`}
                    >
                      {win}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 7: JADWAL PUBLIKASI (HARI & JAM) */}
        {currentStep === 'schedule_time' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-[#39313A]/80">Pilih hari dan jam terbaik:</p>
              <button
                type="button"
                onClick={() => {
                  setScheduledDate(getNextDateForDay(topActivity.day));
                  setScheduledTime(suggestTimeFromWindows([peakTimeRange]));
                }}
                className="text-xs font-semibold text-[#B55478] hover:text-[#9E3F63]"
              >
                Pakai Rekomendasi ({topActivity.day})
              </button>
            </div>

            {/* 7 Circular Day Buttons matching Screen 7 of Sketch */}
            <div className="grid grid-cols-7 gap-2 justify-items-center">
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = selectedDayName === day;
                const isPeak = activeDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setScheduledDate(getNextDateForDay(day))}
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full text-xs font-semibold transition-colors flex items-center justify-center border ${
                      isSelected
                        ? 'bg-[#B55478] border-[#B55478] text-white'
                        : isPeak
                          ? 'bg-[#F8DCE8] border-[#D98EAA] text-[#39313A]'
                          : 'bg-white border-[#F4BFD3] text-[#39313A]/75 hover:bg-[#FDF8FA]'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="sched-date" className="block text-xs font-semibold text-[#39313A]">
                  Tanggal ({selectedDayName})
                </label>
                <input
                  id="sched-date"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm font-mono border border-[#F4BFD3] rounded-xl focus:outline-none focus:border-[#B55478]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="sched-time" className="block text-xs font-semibold text-[#39313A]">
                  Jam:
                </label>
                <select
                  id="sched-time"
                  value={PRESET_TIMES.includes(scheduledTime) ? scheduledTime : 'custom'}
                  onChange={(e) => {
                    if (e.target.value !== 'custom') {
                      setScheduledTime(e.target.value);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 text-sm font-mono border border-[#F4BFD3] rounded-xl bg-white focus:outline-none focus:border-[#B55478]"
                >
                  {PRESET_TIMES.map((t) => (
                    <option key={t} value={t}>
                      {t} WIB
                    </option>
                  ))}
                  {!PRESET_TIMES.includes(scheduledTime) && (
                    <option value="custom">{scheduledTime} WIB</option>
                  )}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="exact-time" className="block text-xs font-semibold text-[#39313A]">
                Atau atur jam spesifik:
              </label>
              <input
                id="exact-time"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3.5 py-2 text-sm font-mono border border-[#F4BFD3] rounded-xl focus:outline-none focus:border-[#B55478]"
              />
            </div>

            <div className="p-3.5 bg-[#F8DCE8]/55 border border-[#F4BFD3] rounded-xl text-xs text-[#39313A]">
              Rekomendasi waktu terbaik berdasarkan analisis audiens:{' '}
              <strong className="text-[#B55478]">
                {topActivity.day}, {peakTimeRange} WIB
              </strong>
            </div>
          </div>
        )}

        {/* Full-width Primary Button matching Sketch */}
        <button
          type="button"
          onClick={handleContinue}
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 text-sm sm:text-base font-semibold text-white bg-[#B55478] hover:bg-[#9E3F63] rounded-2xl transition-colors"
        >
          <span>Lanjutkan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
