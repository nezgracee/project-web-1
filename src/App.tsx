import { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { CalendarView } from './components/CalendarView';
import { ContentPlanner } from './components/ContentPlanner';
import { OptimalityEvaluation } from './components/OptimalityEvaluation';
import { OverviewDashboard } from './components/OverviewDashboard';
import { PerformanceMonitoring } from './components/PerformanceMonitoring';
import { ProfileView } from './components/ProfileView';
import { TopNav } from './components/TopNav';
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

export default function App() {
  const [items, setItems] = useState<ContentItem[]>(() => {
    try {
      const raw = localStorage.getItem(ITEMS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback to empty array
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

  const currentNavTab: TopNavTab = (() => {
    if (isProfileView) return 'profil';
    if (activeStep === 'calendar') return 'kalender';
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

  const isPlannerStep =
    activeStep === 'goal' ||
    activeStep === 'audience' ||
    activeStep === 'platform' ||
    activeStep === 'idea' ||
    activeStep === 'active_time' ||
    activeStep === 'schedule_time';

  const editingItem = editingItemId
    ? items.find((item) => item.id === editingItemId) || null
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FDF8FA] via-[#FDF8FA] to-[#F8DCE8]/35 text-[#39313A] pb-20 md:pb-10">
      <TopNav
        activeTab={currentNavTab}
        onSelectTab={handleSelectNavTab}
        onStartNow={() => handleStartNow()}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
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
      </main>

      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-20 md:bottom-5 right-5 z-50 max-w-sm bg-[#39313A] text-white px-4 py-3 rounded-2xl shadow-lg border border-[#D98EAA]/40 flex items-center gap-3 text-xs"
        >
          <CheckCircle2 className="w-4 h-4 text-[#F4BFD3] shrink-0" />
          <span className="leading-snug">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-white/60 hover:text-white ml-1 shrink-0"
            aria-label="Tutup notifikasi"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
