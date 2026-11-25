import { useEffect, useState } from 'react';
import { CheckCircle2, Menu, Sparkles, X } from 'lucide-react';
import { CalendarView } from './components/CalendarView';
import { ContentPlanner } from './components/ContentPlanner';
import { OptimalityEvaluation } from './components/OptimalityEvaluation';
import { OverviewDashboard } from './components/OverviewDashboard';
import { PerformanceMonitoring } from './components/PerformanceMonitoring';
import { ProfileView } from './components/ProfileView';
import { Sidebar } from './components/Sidebar';
import { ChromeSparkle, ChromeStar, StickerLabel } from './components/Y2KDecorations';
import { DEFAULT_USER_PROFILE, INITIAL_CONTENT_ITEMS } from './data/initialData';
import {
  ContentItem,
  FlowStep,
  PerformanceMetrics,
  TopNavTab,
  UserProfile,
} from './types/content';

const ITEMS_STORAGE_KEY = 'penjadwalan_konten_optimal_plain_items_v1';
const PROFILE_STORAGE_KEY = 'penjadwalan_konten_optimal_plain_profile_v1';

const STEP_BREADCRUMBS: Record<FlowStep, string> = {
  dashboard: 'Beranda',
  goal: 'Perencanaan · Tujuan Konten',
  audience: 'Perencanaan · Target Audiens',
  platform: 'Perencanaan · Platform',
  idea: 'Perencanaan · Ide & Jenis',
  active_time: 'Perencanaan · Waktu Aktif',
  schedule_time: 'Perencanaan · Hari & Jam',
  calendar: 'Kalender Publikasi',
  evaluate_optimality: 'Evaluasi Optimalitas',
  publish_monitoring: 'Analitik & Hasil Publikasi',
  evaluation_summary: 'Evaluasi Hasil Publikasi',
};

export default function App() {
  const [items, setItems] = useState<ContentItem[]>(() => {
    try {
      const raw = localStorage.getItem(ITEMS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_CONTENT_ITEMS;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // Fallback
    }
    return DEFAULT_USER_PROFILE;
  });

  const [activeStep, setActiveStep] = useState<FlowStep>('dashboard');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [prefilledDate, setPrefilledDate] = useState<string | undefined>(undefined);
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);
  const [isProfileView, setIsProfileView] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore
    }
  }, [profile]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const isPlannerStep =
    activeStep === 'goal' ||
    activeStep === 'audience' ||
    activeStep === 'platform' ||
    activeStep === 'idea' ||
    activeStep === 'active_time' ||
    activeStep === 'schedule_time';

  const activeSidebarKey: TopNavTab | 'planner' | 'evaluation' = (() => {
    if (isProfileView) return 'profil';
    if (isPlannerStep) return 'planner';
    if (activeStep === 'calendar') return 'kalender';
    if (activeStep === 'evaluate_optimality') return 'evaluation';
    if (
      activeStep === 'publish_monitoring' ||
      activeStep === 'evaluation_summary'
    ) {
      return 'analitik';
    }
    return 'beranda';
  })();

  const handleSelectNavTab = (tab: TopNavTab) => {
    if (tab === 'profil') {
      setIsProfileView(true);
      return;
    }
    setIsProfileView(false);
    setEditingItemId(null);
    if (tab === 'beranda') setActiveStep('dashboard');
    if (tab === 'kalender') setActiveStep('calendar');
    if (tab === 'analitik') setActiveStep('publish_monitoring');
  };

  const handleStartNow = (dateStr?: string) => {
    setIsProfileView(false);
    setEditingItemId(null);
    setPrefilledDate(dateStr);
    setActiveStep('goal');
  };

  const handleOpenStep = (step: FlowStep, itemId?: string) => {
    setIsProfileView(false);
    if (itemId) {
      if (step === 'schedule_time') {
        setEditingItemId(itemId);
      } else {
        setFocusedItemId(itemId);
      }
    } else {
      setEditingItemId(null);
    }
    setActiveStep(step);
  };

  const handleSaveDraftAndGoCalendar = (savedItem: ContentItem, isEdit: boolean) => {
    setItems((prev) => {
      if (isEdit) {
        return prev.map((item) => (item.id === savedItem.id ? savedItem : item));
      }
      return [savedItem, ...prev];
    });
    setEditingItemId(null);
    setPrefilledDate(undefined);
    setFocusedItemId(savedItem.id);
    setActiveStep('calendar');
    showToast(
      isEdit
        ? `Jadwal "${savedItem.title}" diperbarui.`
        : `"${savedItem.title}" ditambahkan ke kalender.`
    );
  };

  const handleMarkNeedsRevision = (itemId: string, note: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: 'Perlu Perbaikan',
              revisionNote: note,
            }
          : item
      )
    );
    setEditingItemId(itemId);
    setActiveStep('schedule_time');
    showToast('Silakan perbaiki hari dan jam publikasi.');
  };

  const handlePublishContent = (itemId: string) => {
    const target = items.find((i) => i.id === itemId);
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: 'Dipublikasikan',
              publishedAt: `${item.scheduledDate} ${item.scheduledTime}`,
            }
          : item
      )
    );
    setFocusedItemId(itemId);
    setActiveStep('publish_monitoring');
    showToast(
      target
        ? `"${target.title}" dipublikasikan! Masukkan data performa secara manual.`
        : 'Konten dipublikasikan!'
    );
  };

  const handleDeleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Jadwal dihapus.');
  };

  const handleUpdatePerformance = (itemId: string, metrics: PerformanceMetrics) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, performance: metrics } : item
      )
    );
  };

  const handleSaveEvaluationNote = (itemId: string, note: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, evaluationNote: note } : item
      )
    );
  };

  const handleClearAllData = () => {
    setItems([]);
    setProfile(DEFAULT_USER_PROFILE);
    setEditingItemId(null);
    setFocusedItemId(null);
    setIsProfileView(false);
    setActiveStep('dashboard');
    showToast('Seluruh jadwal dan data telah dikosongkan.');
  };

  const editingItem = editingItemId
    ? items.find((item) => item.id === editingItemId) || null
    : null;

  return (
    <div className="min-h-screen flex scrapbook-canvas text-[#39313A] relative">
      {/* Soft paper grain overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 paper-grain-overlay z-0"
      />

      <Sidebar
        activeNav={activeSidebarKey}
        items={items}
        onSelectTab={handleSelectNavTab}
        onOpenStep={(step) => handleOpenStep(step)}
        onStartNow={() => handleStartNow()}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Clean Contextual Top Bar with Y2K Sticker Accents */}
        <header className="sticky top-0 z-30 h-16 bg-white/85 backdrop-blur-lg border-b-2 border-white shadow-[0_4px_18px_-10px_rgba(181,84,120,0.2)] px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-9 h-9 rounded-full y2k-chrome-surface border-2 border-white ring-1 ring-slate-300/80 flex items-center justify-center text-[#39313A]"
              aria-label="Buka navigasi"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-sm min-w-0">
              <ChromeSparkle className="w-5 h-5 shrink-0 y2k-twinkle" />
              <span className="text-[#39313A]/60 hidden sm:inline whitespace-nowrap">
                Penjadwalan Konten Optimal
              </span>
              <span className="text-[#D98EAA] hidden sm:inline" aria-hidden="true">
                /
              </span>
              <span className="font-semibold text-[#39313A] truncate">
                {isProfileView ? 'Profil Pengguna' : STEP_BREADCRUMBS[activeStep]}
              </span>
              <ChromeStar className="w-4 h-4 hidden md:inline-block y2k-twinkle shrink-0" />
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <StickerLabel
              text="Y2K STUDIO"
              variant="chrome"
              className="hidden md:inline-flex -rotate-2"
            />
            <button
              type="button"
              onClick={() => handleStartNow()}
              className="y2k-glossy-pink border-2 border-white text-white px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Mulai Sekarang</span>
            </button>
          </div>
        </header>

        {/* Spacious Main Viewport with Smooth Page Transitions */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
          <div
            key={isProfileView ? 'profil' : activeStep}
            className="y2k-page-enter"
          >
            {isProfileView ? (
              <ProfileView
                profile={profile}
                onSaveProfile={(next) => {
                  setProfile(next);
                  showToast('Profil tersimpan.');
                }}
                onClearAllData={handleClearAllData}
              />
            ) : (
              <>
                {activeStep === 'dashboard' && (
                  <OverviewDashboard
                    items={items}
                    onStartNow={() => handleStartNow()}
                    onNavigateTab={handleSelectNavTab}
                    onOpenStep={handleOpenStep}
                  />
                )}

                {isPlannerStep && (
                  <ContentPlanner
                    currentStep={activeStep}
                    onChangeStep={setActiveStep}
                    existingItems={items}
                    editingItem={editingItem}
                    prefilledDate={prefilledDate}
                    onSaveDraftAndGoCalendar={handleSaveDraftAndGoCalendar}
                    onBackToHome={() => {
                      setEditingItemId(null);
                      setActiveStep('dashboard');
                    }}
                  />
                )}

                {activeStep === 'calendar' && (
                  <CalendarView
                    items={items}
                    highlightedItemId={focusedItemId}
                    onBack={() => setActiveStep('dashboard')}
                    onCreateForDate={(dateStr) => handleStartNow(dateStr)}
                    onEditSchedule={(id) => handleOpenStep('schedule_time', id)}
                    onDeleteItem={handleDeleteItem}
                    onSaveAndContinueToEvaluation={(id) =>
                      handleOpenStep('evaluate_optimality', id)
                    }
                  />
                )}

                {activeStep === 'evaluate_optimality' && (
                  <OptimalityEvaluation
                    items={items}
                    focusedItemId={focusedItemId}
                    onBack={() => setActiveStep('calendar')}
                    onStartNewPlan={() => handleStartNow()}
                    onMarkNeedsRevision={handleMarkNeedsRevision}
                    onPublishContent={handlePublishContent}
                  />
                )}

                {(activeStep === 'publish_monitoring' ||
                  activeStep === 'evaluation_summary') && (
                  <PerformanceMonitoring
                    items={items}
                    focusedItemId={focusedItemId}
                    onBack={() => setActiveStep('dashboard')}
                    onStartNewPlan={() => handleStartNow()}
                    onUpdatePerformance={handleUpdatePerformance}
                    onSaveEvaluationNote={handleSaveEvaluationNote}
                    onFinish={() => {
                      setActiveStep('dashboard');
                      showToast('Evaluasi selesai! Kembali ke Beranda.');
                    }}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 max-w-sm bg-[#39313A] text-white px-4 py-3 rounded-full shadow-lg border-2 border-white ring-1 ring-[#D98EAA] flex items-center gap-3 text-xs"
        >
          <CheckCircle2 className="w-4 h-4 text-[#F4BFD3] shrink-0" />
          <span className="leading-snug">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-white/60 hover:text-white ml-1 shrink-0 cursor-pointer"
            aria-label="Tutup notifikasi"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
