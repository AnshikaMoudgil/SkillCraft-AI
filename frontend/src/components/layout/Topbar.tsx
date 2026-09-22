import React from 'react';
import { Bell, Sparkles, Menu, Calendar, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';

export interface TopbarProps {
  title?: string;
  subtitle?: string;
  onOpenMobileMenu?: () => void;
  onOpenAiArchitecture?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  title,
  subtitle,
  onOpenMobileMenu,
  onOpenAiArchitecture
}) => {
  const { user } = useAuth();
  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date());

  const displayName = user.name && user.name.trim() ? user.name : 'Candidate';

  return (
    <header className="h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile menu toggle & Title */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div>
          {title ? (
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-none">
                {title}
              </h2>
              {subtitle && (
                <span className="hidden md:inline text-xs text-slate-400 font-normal">
                  — {subtitle}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold text-slate-900">
                Welcome, {displayName}!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Date badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 text-slate-600 text-xs font-medium border border-slate-200/60 shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
          <span>{today}</span>
        </div>

        {/* AI System Architecture trigger */}
        <button
          onClick={onOpenAiArchitecture}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-700 border border-indigo-200/60 text-xs font-semibold transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>AI Architecture</span>
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white" />
        </button>

        {/* User preview */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <Avatar name={displayName} src={user.avatarUrl} size="sm" />
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">{displayName}</p>
            <p className="text-[10px] text-slate-400">{user.role || 'Candidate'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
