import { BarChart3, CalendarDays, Home, User } from 'lucide-react';
import { TopNavTab } from '../types/content';

interface TopNavProps {
  activeTab: TopNavTab;
  onSelectTab: (tab: TopNavTab) => void;
  onStartNow: () => void;
}

export function TopNav({ activeTab, onSelectTab, onStartNow }: TopNavProps) {
  const navLinks: { id: TopNavTab; label: string; icon: typeof Home }[] = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'kalender', label: 'Kalender', icon: CalendarDays },
    { id: 'analitik', label: 'Analitik', icon: BarChart3 },
    { id: 'profil', label: 'Profil', icon: User },
  ];

  return (
    <>
      {/* Clean Desktop Header */}
      <header className="hidden md:block sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[#F4BFD3]">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          <button
            type="button"
            onClick={() => onSelectTab('beranda')}
            className="text-base font-bold tracking-tight text-[#39313A] hover:text-[#B55478] transition-colors whitespace-nowrap shrink-0"
          >
            Penjadwalan Konten Optimal
          </button>

          <nav className="flex items-center gap-7" aria-label="Navigasi utama">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => onSelectTab(link.id)}
                  className={`inline-flex items-center gap-1.5 py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-[#B55478] font-semibold'
                      : 'text-[#39313A]/70 hover:text-[#39313A]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={onStartNow}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#B55478] hover:bg-[#9E3F63] rounded-xl transition-colors whitespace-nowrap shrink-0"
          >
            Mulai Sekarang
          </button>
        </div>
      </header>

      {/* Bottom Tab Navigation matching Sketch on Mobile & Tablet */}
      <nav
        aria-label="Navigasi bawah"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#F4BFD3] grid grid-cols-4 h-16"
      >
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              type="button"
              onClick={() => onSelectTab(link.id)}
              className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                isActive ? 'text-[#B55478] font-semibold' : 'text-[#39313A]/65'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
