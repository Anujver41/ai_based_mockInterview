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

export const MainLayout = () => {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
        <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="text-xl font-bold tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Code2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span>AI.Platform</span>
            </Link>
            <div className="flex items-center gap-4">
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-md hover:bg-muted transition-colors">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link to="/login" className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-all shadow-md shadow-primary/20">
                Login
              </Link>
            </div>
          </div>
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
            onClick={() => dispatch(logout())}
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
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-background">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
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
