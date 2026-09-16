import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Code2,
  MessageSquareText,
  FileText,
  BarChart3,
  BookOpen,
  X,
  Sparkles,
  LogOut,
  Mic,
  Video,
  FileSpreadsheet,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common/Avatar';

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileNavigationProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/coding', label: 'Technical Sandbox', icon: Code2 },
    { to: '/interviews', label: 'Mock Interview', icon: MessageSquareText },
    { to: '/resume', label: 'Resume', icon: FileText },
    { to: '/interview/voice', label: 'Voice Interview', icon: Mic },
    { to: '/interview/live', label: 'Live Interview', icon: Video },
    { to: '/interview/transcript', label: 'Transcript & AI', icon: FileSpreadsheet },
    { to: '/interview/report', label: 'Reports', icon: BarChart3 },
    { to: '/progress', label: 'Progress Stats', icon: TrendingUp },
    { to: '/learning', label: 'Learning Plan', icon: BookOpen }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-xs bg-[#071A33] text-white h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-200">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm">SkillCraft AI</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800 bg-[#051428] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Avatar name={user.name} src={user.avatarUrl} size="sm" />
            <div>
              <p className="text-xs font-bold text-white leading-tight">{user.name}</p>
              <p className="text-[10px] text-slate-400">{user.role}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-rose-400"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const MobileBottomBar: React.FC = () => {
  const items = [
    { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/coding', label: 'Sandbox', icon: Code2 },
    { to: '/interviews', label: 'Interview', icon: MessageSquareText },
    { to: '/interview/report', label: 'Reports', icon: BarChart3 },
    { to: '/learning', label: 'Plan', icon: BookOpen }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex justify-around items-center">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
