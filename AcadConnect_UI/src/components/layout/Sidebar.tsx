import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  FolderGit2,
  FileCheck2,
  MessageSquareQuote,
  Bell,
  Settings,
  Megaphone,
  BookOpen,
  FileSpreadsheet,
  GraduationCap,
  ShieldCheck,
  Building2,
  CheckSquare,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onCloseMobile }) => {
  const { role, logout, user } = useAuth();

  const studentNav = [
    { label: 'Overview', to: '/student/dashboard', icon: LayoutDashboard },
    { label: 'My Group', to: '/student/group', icon: Users },
    { label: 'My Project', to: '/student/project', icon: FolderGit2 },
    { label: 'Submissions', to: '/student/submission', icon: FileCheck2 },
    { label: 'Feedback', to: '/student/feedback', icon: MessageSquareQuote },
    { label: 'Announcements', to: '/student/announcements', icon: Megaphone },
    { label: 'Resources', to: '/student/resources', icon: BookOpen },
    { label: 'Assignments', to: '/student/assignments', icon: CheckSquare },
    { label: 'Notifications', to: '/student/notifications', icon: Bell },
    { label: 'Settings', to: '/student/settings', icon: Settings },
  ];

  const teacherNav = [
    { label: 'Overview', to: '/teacher/dashboard', icon: LayoutDashboard },
    { label: 'My Students', to: '/teacher/students', icon: GraduationCap },
    { label: 'Groups', to: '/teacher/groups', icon: Users },
    { label: 'Projects', to: '/teacher/projects', icon: FolderGit2 },
    { label: 'Submissions', to: '/teacher/submissions', icon: FileCheck2 },
    { label: 'Evaluations', to: '/teacher/evaluations', icon: MessageSquareQuote },
    { label: 'Announcements', to: '/teacher/announcements', icon: Megaphone },
    { label: 'Resources', to: '/teacher/resources', icon: BookOpen },
    { label: 'Assignments', to: '/teacher/assignments', icon: CheckSquare },
    { label: 'Reports & Export', to: '/teacher/reports', icon: FileSpreadsheet },
    { label: 'Settings', to: '/teacher/settings', icon: Settings },
  ];

  const adminNav = [
    { label: 'Overview', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users', to: '/admin/users', icon: ShieldCheck },
    { label: 'Teachers', to: '/admin/teachers', icon: GraduationCap },
    { label: 'Students', to: '/admin/students', icon: Users },
    { label: 'Departments', to: '/admin/departments', icon: Building2 },
    { label: 'Groups', to: '/admin/groups', icon: Users },
    { label: 'Projects', to: '/admin/projects', icon: FolderGit2 },
    { label: 'Submissions', to: '/admin/submissions', icon: FileCheck2 },
    { label: 'Reports', to: '/admin/reports', icon: FileSpreadsheet },
    { label: 'Settings', to: '/admin/settings', icon: Settings },
  ];

  const navItems =
    role === 'ADMIN' ? adminNav : role === 'TEACHER' ? teacherNav : studentNav;

  return (
    <aside
      className={`h-full flex flex-col bg-[#111827] text-slate-300 border-r border-slate-800 transition-all duration-200 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
          AC
        </div>
        {!collapsed && (
          <div className="overflow-hidden truncate">
            <h1 className="font-bold text-white text-base tracking-tight leading-tight">
              AcadConnect
            </h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
              {role || 'WORKSPACE'}
            </span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                } ${collapsed ? 'justify-center' : ''}`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer Profile & Logout */}
      <div className="p-3 border-t border-slate-800">
        <div
          className={`flex items-center gap-3 p-2 rounded-lg bg-slate-900/60 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-semibold text-xs shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          {!collapsed && (
            <div className="flex-1 truncate">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => logout()}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
