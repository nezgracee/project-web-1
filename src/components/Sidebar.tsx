import {
  BarChart3,
  CalendarDays,
  Compass,
  GitBranch,
  Home,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { ContentItem, FlowStep, TopNavTab } from '../types/content';
import {
  ChromeSparkle,
  ChromeStar,
  CuteSmiley,
  GlossyHeart,
  PinkBow,
  PinkFlower,
  StickerLabel,
  WashiTape,
} from './Y2KDecorations';

interface SidebarProps {
  activeNav: TopNavTab | 'planner' | 'evaluation';
  items: ContentItem[];
  onSelectTab: (tab: TopNavTab) => void;
  onOpenStep: (step: FlowStep) => void;
  onStartNow: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  activeNav,
  items,
  onSelectTab,
  onOpenStep,
  onStartNow,
  isOpenMobile,
  onCloseMobile,
}: SidebarProps) {
  const scheduledCount = items.filter((i) => i.status !== 'Dipublikasikan').length;
  const evalCount = items.filter(
    (i) => i.status === 'Terjadwal' || i.status === 'Perlu Perbaikan' || i.status === 'Siap Publikasi'
  ).length;
  const publishedCount = items.filter((i) => i.status === 'Dipublikasikan').length;

  const navItems: {
    id: TopNavTab | 'planner' | 'evaluation';
    label: string;
    icon: typeof Home;
    count?: number;
    onClick: () => void;
  }[] = [
    {
      id: 'beranda',
      label: 'Beranda',
      icon: Home,
      onClick: () => onSelectTab('beranda'),
    },
    {
      id: 'planner',
      label: 'Rencanakan Konten',
      icon: Compass,
      onClick: () => onOpenStep('goal'),
    },
    {
      id: 'kalender',
      label: 'Kalender',
      icon: CalendarDays,
      count: scheduledCount,
      onClick: () => onSelectTab('kalender'),
    },
    {
      id: 'evaluation',
      label: 'Evaluasi Jadwal',
      icon: GitBranch,
      count: evalCount,
      onClick: () => onOpenStep('evaluate_optimality'),
    },
    {
      id: 'analitik',
      label: 'Analitik & Hasil',
      icon: BarChart3,
      count: publishedCount,
      onClick: () => onSelectTab('analitik'),
    },
    {
      id: 'profil',
      label: 'Profil',
      icon: User,
      onClick: () => onSelectTab('profil'),
    },
  ];

  const sidebarBody = (
    <div className="w-64 h-full flex flex-col bg-gradient-to-b from-white/95 via-[#FFF6FA]/92 to-[#F8DCE8]/65 backdrop-blur-xl border-r-2 border-white shadow-[6px_0_26px_-12px_rgba(181,84,120,0.22)] relative overflow-hidden">
      {/* Subtle pink & silver ambient corners */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full bg-slate-200/45 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 -left-10 w-44 h-44 rounded-full bg-[#F4BFD3]/45 blur-2xl"
      />

      {/* Brand Zone */}
      <div className="px-5 h-16 flex items-center justify-between border-b border-[#F4BFD3]/70 relative z-10">
        <button
          type="button"
          onClick={() => {
            onSelectTab('beranda');
            onCloseMobile();
          }}
          className="flex items-center gap-2.5 text-left group relative"
        >
          <span className="relative w-9 h-9 rounded-full y2k-chrome-surface border-2 border-white flex items-center justify-center shrink-0">
            <ChromeStar className="w-5 h-5 y2k-twinkle" />
            <PinkBow className="w-6 h-5 absolute -bottom-2 -right-2.5 rotate-12 pointer-events-none" />
          </span>
          <span className="text-sm font-bold tracking-tight text-[#39313A] group-hover:text-[#B55478] transition-colors whitespace-nowrap pl-0.5">
            Konten Optimal
          </span>
        </button>

        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 text-[#39313A]/70 hover:text-[#39313A] rounded-full"
          aria-label="Tutup menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrapbook Sticker Tag Strip */}
      <div className="px-4 pt-4 pb-1 flex items-center justify-between relative z-10">
        <StickerLabel text="CREATIVE SPACE" variant="chrome" className="-rotate-2" />
        <ChromeSparkle className="w-5 h-5 y2k-twinkle rotate-6" />
      </div>

      {/* Primary Sidebar CTA Pill */}
      <div className="px-4 pt-2 pb-2 relative z-10">
        <button
          type="button"
          onClick={() => {
            onStartNow();
            onCloseMobile();
          }}
          className="w-full y2k-glossy-pink border-2 border-white text-white text-xs font-semibold py-2.5 px-4 rounded-full inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>Buat Jadwal Baru</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav
        aria-label="Navigasi utama"
        className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto relative z-10"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                item.onClick();
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-full text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#F8DCE8] via-[#F4BFD3]/80 to-white text-[#39313A] font-semibold border-2 border-white shadow-[0_6px_14px_-6px_rgba(181,84,120,0.35)]'
                  : 'text-[#39313A]/75 hover:bg-white/80 hover:text-[#39313A] border border-transparent hover:border-[#F4BFD3]/70'
              }`}
            >
              <span className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-[#B55478]' : 'text-[#B55478]/65'
                  }`}
                />
                <span className="text-xs sm:text-sm truncate">{item.label}</span>
              </span>

              {typeof item.count === 'number' && item.count > 0 && (
                <span
                  className={`text-xs font-mono tabular-nums ml-2 px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/90 text-[#B55478] font-bold'
                      : 'text-[#39313A]/55'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Scrapbook Sticker Footer Cluster */}
      <div className="p-4 pt-5 border-t border-[#F4BFD3]/70 relative z-10 bg-white/55">
        <WashiTape className="-top-2.5 left-5 -rotate-3 absolute" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-medium text-[#39313A]/75">
            <GlossyHeart className="w-5 h-5 shrink-0 sticker-interactive" />
            <span>Penyimpanan Lokal</span>
          </div>
          <div className="flex items-center -space-x-1">
            <CuteSmiley className="w-6 h-6 -rotate-6 sticker-interactive" />
            <PinkFlower className="w-6 h-6 rotate-12 sticker-interactive" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block h-screen sticky top-0 shrink-0">{sidebarBody}</aside>

      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#39313A]/25 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 h-full">{sidebarBody}</div>
        </div>
      )}
    </>
  );
}
