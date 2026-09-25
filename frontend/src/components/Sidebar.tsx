import { useState } from 'react';
import {
  Compass, Clapperboard, FolderOpen, Shield, Bell, User, LogIn,
  Coins, Languages, LogOut, Menu, X, Sparkles,
} from 'lucide-react';
import { useI18n } from '@/i18nContext';
import { Logo } from './ui';
import type { TranslationKey } from '@/i18n';

export type PageKey = 'auth' | 'explore' | 'create' | 'assets' | 'admin' | 'notifications' | 'profile';

interface SidebarProps {
  current: PageKey;
  onNavigate: (page: PageKey) => void;
  credits: number;
  unreadNotifs: number;
}

export function Sidebar({ current, onNavigate, credits, unreadNotifs }: SidebarProps) {
  const { lang, toggleLang, t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: { key: PageKey; label: TranslationKey; icon: typeof Compass }[] = [
    { key: 'explore', label: 'explore', icon: Compass },
    { key: 'create', label: 'create', icon: Clapperboard },
    { key: 'assets', label: 'assets', icon: FolderOpen },
    { key: 'admin', label: 'admin', icon: Shield },
    { key: 'notifications', label: 'notifications', icon: Bell },
    { key: 'profile', label: 'profile', icon: User },
  ];

  const handleNav = (page: PageKey) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-strong px-4 h-16 flex items-center justify-between">
        <Logo size="sm" />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-white/5 text-white/70"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-ink-950/80 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[260px] z-50 transition-smooth
        glass-strong border-r border-white/5
        flex flex-col
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/5 hidden lg:flex">
          <Logo size="md" />
        </div>
        <div className="lg:hidden h-16 flex items-center px-6 border-b border-white/5">
          <Logo size="sm" />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto no-scrollbar">
          {/* Auth link */}
          <NavLink
            icon={LogIn}
            label={t('auth')}
            active={current === 'auth'}
            onClick={() => handleNav('auth')}
          />

          <div className="my-3 mx-3 border-t border-white/5" />

          {navItems.map((item) => (
            <NavLink
              key={item.key}
              icon={item.icon}
              label={t(item.label)}
              active={current === item.key}
              badge={item.key === 'notifications' ? unreadNotifs : undefined}
              onClick={() => handleNav(item.key)}
            />
          ))}
        </nav>

        {/* Credits card */}
        <div className="px-3 pb-3">
          <div className="glass rounded-xl p-4 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-teal/10 rounded-full blur-2xl" />
            <div className="flex items-center gap-2 mb-2">
              <Coins size={16} className="text-teal" />
              <span className="text-xs text-white/50 uppercase tracking-wider">{t('credits')}</span>
            </div>
            <div className="text-2xl font-bold text-white">{credits.toLocaleString()}</div>
            <div className="mt-2 h-1 bg-ink-700 rounded-full overflow-hidden">
              <div className="h-full w-[72%] bg-gradient-to-r from-teal to-teal-glow rounded-full" />
            </div>
            <button className="mt-3 w-full py-2 text-xs font-medium text-ink-950 bg-gradient-to-r from-teal to-teal-glow rounded-lg hover:brightness-110 transition-smooth">
              Top Up
            </button>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="px-3 pb-4 space-y-1">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-smooth"
          >
            <span className="flex items-center gap-2.5">
              <Languages size={18} />
              {lang === 'en' ? 'English' : 'Tiếng Việt'}
            </span>
            <span className="flex items-center gap-1">
              <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${lang === 'en' ? 'bg-teal/20 text-teal' : 'text-white/30'}`}>EN</span>
              <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${lang === 'vi' ? 'bg-violet/20 text-violet' : 'text-white/30'}`}>VI</span>
            </span>
          </button>

          <button
            onClick={() => handleNav('auth')}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-red-400 hover:bg-red-500/5 transition-smooth"
          >
            <LogOut size={18} />
            {t('logout')}
          </button>
        </div>

        {/* AI badge */}
        <div className="px-6 pb-4 flex items-center gap-1.5 text-[10px] text-white/20">
          <Sparkles size={10} className="text-teal" />
          Powered by Klink-V4 Cinema
        </div>
      </aside>
    </>
  );
}

function NavLink({
  icon: Icon,
  label,
  active,
  badge,
  onClick,
}: {
  icon: typeof Compass;
  label: string;
  active: boolean;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-smooth group relative
        ${active
          ? 'bg-gradient-to-r from-teal/15 to-transparent text-white'
          : 'text-white/50 hover:text-white hover:bg-white/5'
        }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal rounded-r-full" />
      )}
      <Icon size={18} className={active ? 'text-teal' : 'group-hover:text-teal transition-smooth'} />
      <span className="font-medium">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="ml-auto bg-flame text-ink-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
          {badge}
        </span>
      )}
    </button>
  );
}
