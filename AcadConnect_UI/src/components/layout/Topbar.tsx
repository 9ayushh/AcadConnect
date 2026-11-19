import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Users,
  Search,
} from 'lucide-react';
import { DEMO_USERS } from '../../utils/constants';
import { initialUsers } from '../../mocks/mockData';

interface TopbarProps {
  onToggleSidebar?: () => void;
  onOpenMobileMenu?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar, onOpenMobileMenu }) => {
  const { user, role, logout, switchMockUser } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [demoSwitcherOpen, setDemoSwitcherOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const demoMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (demoMenuRef.current && !demoMenuRef.current.contains(e.target as Node)) {
        setDemoSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSwitch = (targetEmail: string) => {
    const found = initialUsers.find((u) => u.email === targetEmail);
    if (found) {
      switchMockUser(found);
      setDemoSwitcherOpen(false);
      if (found.role === 'ADMIN') navigate('/admin/dashboard');
      else if (found.role === 'TEACHER') navigate('/teacher/dashboard');
      else navigate('/student/dashboard');
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile hamburger & desktop toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={onToggleSidebar}
          className="hidden lg:flex p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          aria-label="Toggle sidebar collapse"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Contextual Search */}
        <div className="hidden md:flex items-center relative w-64 lg:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects, groups, resources..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Mock Mode Quick Role Switcher */}
        {import.meta.env.VITE_USE_MOCKS === 'true' && (
          <div className="relative" ref={demoMenuRef}>
            <button
              type="button"
              onClick={() => setDemoSwitcherOpen(!demoSwitcherOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
              title="Quickly switch between Student, Teacher, and Admin roles in Demo Mode"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Role: {role}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {demoSwitcherOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-lg border border-slate-200 py-1.5 z-40">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Demo Account
                </div>
                {DEMO_USERS.map((demo) => (
                  <button
                    key={demo.email}
                    type="button"
                    onClick={() => handleRoleSwitch(demo.email)}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex flex-col ${
                      user?.email === demo.email ? 'bg-indigo-50/50 font-semibold text-indigo-600' : 'text-slate-700'
                    }`}
                  >
                    <span>{demo.label}</span>
                    <span className="text-[10px] text-slate-400">{demo.email}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notifications Bell */}
        <Link
          to={role === 'STUDENT' ? '/student/notifications' : '#'}
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
        </Link>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="User menu"
            aria-expanded={profileOpen}
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-xs shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="hidden sm:inline text-sm font-medium text-slate-700 max-w-[120px] truncate">
              {user?.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-40 divide-y divide-slate-100">
              <div className="px-4 py-2.5">
                <p className="text-xs font-semibold text-slate-900 truncate">{user?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                <span className="mt-1 inline-block text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">
                  {role}
                </span>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>My Profile</span>
                </Link>
                <Link
                  to={`/${role?.toLowerCase()}/settings`}
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Settings</span>
                </Link>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
