import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Moon, Sun, LayoutDashboard, Code2, History, BrainCircuit, 
  Mic, FileText, GitBranch, Map, Settings, Search, Bell, Menu, 
  X, LogOut, Link2
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { logout } from '../store/slices/authSlice';
import { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Problems', path: '/problems', icon: Code2 },
  { name: 'Submissions', path: '/submissions', icon: History },
  { name: 'AI Code Review', path: '/code-review', icon: BrainCircuit },
  { name: 'Mock Interview', path: '/interview', icon: Mic },
  { name: 'Resume Analyzer', path: '/resume', icon: FileText },
  { name: 'GitHub Analyzer', path: '/github', icon: GitBranch },
  { name: 'Platforms', path: '/platforms', icon: Link2 },
  { name: 'Roadmap', path: '/roadmap', icon: Map },
  { name: 'Settings', path: '/settings', icon: Settings },
];

import { useQueryClient } from '@tanstack/react-query';

export const MainLayout = () => {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    queryClient.clear();
    dispatch(logout());
  };

  const [unauthNavOpen, setUnauthNavOpen] = useState(false);

  const isFullBleed = (location.pathname.startsWith('/problems/') && location.pathname !== '/problems') ||
                      location.pathname.startsWith('/code-review') ||
                      location.pathname.startsWith('/interview/');

  // Close sidebar on route change on mobile
  useEffect(() => {
    setSidebarOpen(false);
    setUnauthNavOpen(false);
  }, [location.pathname]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
        <header className="border-b border-border/80 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-6 w-full">
            {/* Logo — always left */}
            <Link to="/" className="text-xl font-bold tracking-tight flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-primary flex items-center justify-center shadow-md shadow-violet-500/20">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold tracking-tight">AI<span className="text-violet-500">.</span>Platform</span>
            </Link>

            {/* Desktop Navigation — grows to fill space, centered */}
            <nav className="hidden md:flex flex-1 items-center justify-center gap-7 text-sm font-medium text-muted-foreground">
              <a href="/#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="/#interactive-demo" className="hover:text-foreground transition-colors">Live Demo</a>
              <a href="/#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
              <Link to="/problems" className="hover:text-foreground transition-colors flex items-center gap-1">
                <span>Problems</span>
                <span className="text-[10px] bg-violet-500/15 text-violet-500 px-1.5 py-0.5 rounded-full font-bold">500+</span>
              </Link>
              <a href="/#testimonials" className="hover:text-foreground transition-colors">Reviews</a>
              <a href="/#faq" className="hover:text-foreground transition-colors">FAQ</a>
            </nav>

            {/* Actions — always far right */}
            <div className="flex items-center gap-3 ml-auto shrink-0">
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
              </button>

              <Link 
                to="/login" 
                className="hidden sm:inline-flex px-4 py-2 rounded-lg text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Log In
              </Link>

              <Link 
                to="/signup" 
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-4 sm:px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-md shadow-violet-600/25 hover:shadow-violet-600/40 hover:-translate-y-0.5"
              >
                <span>Get Started</span>
              </Link>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setUnauthNavOpen(!unauthNavOpen)}
                className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {unauthNavOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown navigation */}
          {unauthNavOpen && (
            <div className="md:hidden border-b border-border bg-card/95 backdrop-blur-xl px-4 py-5 space-y-4 animate-fadeIn">
              <nav className="flex flex-col space-y-3 text-sm font-medium">
                <a 
                  href="/#features" 
                  onClick={() => setUnauthNavOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  Features
                </a>
                <a 
                  href="/#interactive-demo" 
                  onClick={() => setUnauthNavOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  Live Demo
                </a>
                <a 
                  href="/#how-it-works" 
                  onClick={() => setUnauthNavOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  How It Works
                </a>
                <Link 
                  to="/problems" 
                  onClick={() => setUnauthNavOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-muted transition-colors flex items-center justify-between"
                >
                  <span>Problems Arena</span>
                  <span className="text-[10px] bg-violet-500/15 text-violet-500 px-2 py-0.5 rounded-full font-bold">500+</span>
                </Link>
                <a 
                  href="/#testimonials" 
                  onClick={() => setUnauthNavOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  Reviews
                </a>
                <a 
                  href="/#faq" 
                  onClick={() => setUnauthNavOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  FAQ
                </a>
              </nav>

              <div className="pt-3 border-t border-border flex flex-col gap-2">
                <Link 
                  to="/login"
                  onClick={() => setUnauthNavOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg text-sm font-semibold border border-border hover:bg-muted transition-colors"
                >
                  Log In
                </Link>
                <Link 
                  to="/signup"
                  onClick={() => setUnauthNavOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 shadow-md shadow-violet-600/25 transition-all"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          )}
        </header>
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden font-sans">
      
      {/* ── Left Sidebar ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:static'}
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <Link to="/" className="text-xl font-bold tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span>AI.Platform</span>
          </Link>
          <button className="lg:hidden p-1 text-muted-foreground hover:text-foreground" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
          <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Menu</p>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                <span>{item.name}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Sticky Top Navbar */}
        <header className="h-16 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-40 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden md:block w-64 lg:w-96">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search problems, topics, interviews..." 
                className="w-full bg-muted/50 border border-border rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
            </button>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="w-px h-6 bg-border mx-1 hidden md:block" />
            <div className="flex items-center gap-3 cursor-pointer p-1 pr-2 rounded-full hover:bg-muted transition-colors border border-transparent hover:border-border">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-bold">{user?.email?.[0]?.toUpperCase() || 'U'}</span>
              </div>
              <span className="text-sm font-medium hidden sm:block truncate max-w-[120px]">{user?.email?.split('@')[0] || 'User'}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={`flex-1 ${isFullBleed ? 'flex flex-col min-h-0 overflow-hidden' : 'overflow-y-auto p-4 lg:p-8'} bg-background`}>
          {isFullBleed ? (
            <Outlet />
          ) : (
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          )}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;
