import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeftRight,
  Bell,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Layers,
  Sparkles,
  Search,
  MessageSquare,
  Repeat,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout, notifications, unreadCount, markNotificationRead, markAllNotificationsRead, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleDemoSwitch = async (email: string) => {
    setDemoDropdownOpen(false);
    await login(email, 'password123');
    navigate('/dashboard');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Sparkles },
    { name: 'Find Partners', path: '/explore', icon: Search },
    { name: 'My Skills', path: '/skills', icon: Layers },
    { name: 'Requests', path: '/requests', icon: MessageSquare },
    { name: 'My Exchanges', path: '/exchanges', icon: Repeat },
    { name: 'Profile', path: '/profile', icon: UserIcon },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <ArrowLeftRight className="w-5 h-5 transition-transform group-hover:rotate-180 duration-500" />
            </div>
            <div>
              <span className="text-xl font-bold font-['Outfit'] tracking-tight brand-text-gradient">
                SkillSwap
              </span>
              <span className="hidden sm:block text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                Peer Learning Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'bg-sky-50 text-sky-700 font-semibold shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-sky-600' : 'text-slate-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher (Crucial for evaluation/demo) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100 transition shadow-sm"
                title="Switch demo student accounts instantly"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>Demo Switcher</span>
              </button>

              {demoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-700">Quick Switch Student Account</p>
                    <p className="text-[11px] text-slate-500">Test complementary matching scenario</p>
                  </div>
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => handleDemoSwitch('arun@skillswap.edu')}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-semibold text-slate-800">Arun Kumar</span>
                        <p className="text-[11px] text-slate-500">Teaches Python • Wants UI/UX</p>
                      </div>
                      {user?.email === 'arun@skillswap.edu' && (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoSwitch('priya@skillswap.edu')}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-semibold text-slate-800">Priya Sharma</span>
                        <p className="text-[11px] text-slate-500">Teaches UI/UX • Wants Python</p>
                      </div>
                      {user?.email === 'priya@skillswap.edu' && (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoSwitch('rahul@skillswap.edu')}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-semibold text-slate-800">Rahul Verma</span>
                        <p className="text-[11px] text-slate-500">Teaches Java • Wants React</p>
                      </div>
                      {user?.email === 'rahul@skillswap.edu' && (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {user ? (
              <>
                {/* Notification Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setNotifDropdownOpen(!notifDropdownOpen);
                      setDemoDropdownOpen(false);
                    }}
                    className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-800">
                          Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
                        </span>
                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={() => markAllNotificationsRead()}
                            className="text-xs text-sky-600 hover:text-sky-800 font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 py-1">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center text-slate-400 text-xs">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => {
                                markNotificationRead(notif.id);
                                if (notif.link) {
                                  navigate(notif.link);
                                  setNotifDropdownOpen(false);
                                }
                              }}
                              className={`px-4 py-3 text-xs cursor-pointer transition hover:bg-slate-50 flex items-start gap-3 ${
                                !notif.isRead ? 'bg-sky-50/50' : ''
                              }`}
                            >
                              <div
                                className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                                  !notif.isRead ? 'bg-sky-500' : 'bg-transparent'
                                }`}
                              />
                              <div className="flex-1">
                                <p className="text-slate-800 leading-snug font-medium">
                                  {notif.message}
                                </p>
                                <span className="text-[10px] text-slate-400 mt-1 block">
                                  {new Date(notif.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Avatar & Logout */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <Link to="/profile" className="flex items-center gap-2 group">
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-sky-400 group-hover:border-sky-600 transition"
                    />
                    <div className="hidden lg:block text-left">
                      <span className="text-xs font-semibold text-slate-800 block leading-tight">
                        {user.name.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {user.department.slice(0, 16)}...
                      </span>
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition"
                    title="Log Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/explore"
                  className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
                >
                  Explore Skills
                </Link>
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 rounded-lg border border-slate-300 hover:bg-slate-50 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white brand-gradient rounded-lg shadow-sm hover:opacity-95 transition"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            {user && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {user && mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  active ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-sky-600' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Signed in as {user.name}</span>
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-rose-600 font-medium flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" /> Log Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
