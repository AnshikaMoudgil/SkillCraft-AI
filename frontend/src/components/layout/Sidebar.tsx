import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Code2,
  MessageSquareText,
  FileText,
  BarChart3,
  BookOpen,
  Mic,
  TrendingUp,
  FileSpreadsheet,
  LogOut,
  Sparkles,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Avatar } from '../common/Avatar';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const displayName = user.name && user.name.trim() ? user.name : 'Candidate';

  const primaryNav = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/coding', label: 'Technical Sandbox', icon: Code2 },
    { to: '/interviews', label: 'Mock Interview', icon: MessageSquareText },
    { to: '/resume', label: 'Resume', icon: FileText },
    { to: '/interview/report', label: 'Reports', icon: BarChart3 },
    { to: '/learning', label: 'Learning Plan', icon: BookOpen }
  ];

  const secondaryNav = [
    { to: '/interview/voice', label: 'Voice Interview', icon: Mic },
    { to: '/interview/transcript', label: 'Transcript & AI', icon: FileSpreadsheet },
    { to: '/progress', label: 'Progress Stats', icon: TrendingUp }
  ];

  const handleLogout = () => {
    logout();
    showToast('Signed out successfully', 'info');
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-[#071A33] text-slate-300 flex flex-col shrink-0 h-screen sticky top-0 border-r border-slate-800/80 shadow-2xl z-30 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/60 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white tracking-tight leading-none">
            SkillCraft AI
          </h1>
          <p className="text-[11px] text-indigo-300/80 font-medium tracking-wide mt-1">
            Practice. Improve. Get Hired.
          </p>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Core Platform
        </div>
        {primaryNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#142948] text-white shadow-inner font-semibold border-l-4 border-indigo-500'
                    : 'text-slate-400 hover:text-white hover:bg-[#0E223F]'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {/* Live & Interactive Practice tools */}
        <div className="pt-6 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Interactive Sessions
        </div>
        {secondaryNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#142948] text-white shadow-inner font-semibold border-l-4 border-purple-500'
                    : 'text-slate-400 hover:text-white hover:bg-[#0E223F]'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* User profile footer matching reference */}
      <div className="p-4 border-t border-slate-800/80 bg-[#051428] flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={displayName} src={user.avatarUrl} size="md" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate leading-tight">
              {displayName}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-xs text-slate-400 truncate">{user.role || 'Candidate'}</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          title="Sign Out"
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-lg transition-colors"
          aria-label="Log out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
