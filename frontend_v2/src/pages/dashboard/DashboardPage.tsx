import { motion } from 'framer-motion';
import { 
  CheckCircle2, Code2, Brain, Activity, TrendingUp, Trophy, Target, 
  GitBranch, FileText, ChevronRight, Zap, ListTodo, Flame 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import { Link } from 'react-router-dom';

const statsData = [
  { label: 'Problems Solved', value: '142', change: '+12 this week', icon: Code2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Interview Sessions', value: '24', change: '+3 this week', icon: Brain, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  { label: 'Success Rate', value: '78%', change: '+5.4% overall', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { label: 'Coding Streak', value: '14 Days', change: 'Personal best!', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
];

const secondaryStats = [
  { label: 'Total Submissions', value: '845', icon: Activity, color: 'text-cyan-500' },
  { label: 'AI Reviews', value: '56', icon: Zap, color: 'text-yellow-500' },
  { label: 'Resume ATS Score', value: '84', icon: FileText, color: 'text-pink-500' },
  { label: 'GitHub Score', value: 'A-', icon: GitBranch, color: 'text-slate-400' },
];

const lineData = [
  { name: 'Mon', solved: 4 }, { name: 'Tue', solved: 7 }, { name: 'Wed', solved: 5 },
  { name: 'Thu', solved: 12 }, { name: 'Fri', solved: 8 }, { name: 'Sat', solved: 15 }, { name: 'Sun', solved: 10 },
];

const pieData = [
  { name: 'Easy', value: 85, color: '#10b981' }, // emerald-500
  { name: 'Medium', value: 45, color: '#eab308' }, // yellow-500
  { name: 'Hard', value: 12, color: '#ef4444' }, // red-500
];

const barData = [
  { name: 'Week 1', hours: 12 }, { name: 'Week 2', hours: 15 }, 
  { name: 'Week 3', hours: 10 }, { name: 'Week 4', hours: 22 },
];

const recentActivity = [
  { type: 'problem', title: 'Solved Two Sum', time: '2 hours ago', icon: CheckCircle2, color: 'text-emerald-500' },
  { type: 'interview', title: 'Completed System Design Mock', time: '5 hours ago', icon: Brain, color: 'text-violet-500' },
  { type: 'resume', title: 'Resume ATS improved to 84', time: '1 day ago', icon: TrendingUp, color: 'text-pink-500' },
];

const recommendations = [
  { title: 'Solve 2 Medium DP Problems', desc: 'Your DP success rate is below average.', icon: Code2 },
  { title: 'Practice Graph Interviews', desc: 'Recommended before your upcoming mock interview.', icon: Brain },
];

const roadmapTasks = [
  { title: 'Master Binary Search', completed: true },
  { title: 'Complete 5 Medium Arrays', completed: false },
  { title: 'Improve GitHub Commit Consistency', completed: false },
];

export const DashboardPage = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* ── 1. Welcome Hero Section ── */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-blue-500/5 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Welcome back, Anuj <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl">
              You are on a <strong className="text-orange-500">14-day streak</strong>! Keep up the momentum. You're 3 problems away from your weekly goal.
            </p>
          </div>
          <Link 
            to="/problems" 
            className="shrink-0 bg-primary text-primary-foreground hover:opacity-90 px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-primary/25 flex items-center gap-2"
          >
            Continue Practicing <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ── 2. Primary Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            key={i} 
            className="group p-5 bg-card border border-border rounded-2xl hover:border-primary/30 transition-all hover:shadow-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <h3 className="text-3xl font-bold mt-1 text-foreground">{stat.value}</h3>
              </div>
              <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3 text-emerald-500" /> {stat.change}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ── Secondary Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {secondaryStats.map((stat, i) => (
          <div key={i} className="p-4 bg-card border border-border rounded-2xl flex items-center gap-4">
            <div className="p-2 bg-muted/50 rounded-lg border border-border/50">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── 3. Line Chart Analytics ── */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Problems Solved</h3>
            <select className="bg-transparent border border-border rounded-lg text-sm px-3 py-1.5 outline-none text-muted-foreground">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{fontSize: 12}} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#666" tick={{fontSize: 12}} tickLine={false} axisLine={false} dx={-10} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e1e24', borderColor: '#333', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="solved" stroke="#8b5cf6" strokeWidth={3} dot={{r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#1a1b26'}} activeDot={{r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Bar Chart Analytics ── */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-6">Weekly Consistency</h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{fontSize: 12}} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#666" tick={{fontSize: 12}} tickLine={false} axisLine={false} dx={-10} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e1e24', borderColor: '#333', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{fill: '#333', opacity: 0.2}}
                />
                <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Difficulty Pie Chart ── */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col">
          <h3 className="font-semibold text-lg mb-2">Difficulty Distribution</h3>
          <p className="text-sm text-muted-foreground mb-6">Based on your total solved problems.</p>
          <div className="flex-1 min-h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e1e24', borderColor: '#333', borderRadius: '12px', padding: '8px 12px' }}
                  itemStyle={{ color: '#fff', fontSize: '14px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-foreground">142</span>
              <span className="text-xs text-muted-foreground">Solved</span>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                <span className="text-xs font-medium">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ── 5. Weak vs Strong Topics ── */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" /> Topic Analysis
          </h3>
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-emerald-400 mb-3 uppercase tracking-wider">Strong Topics</p>
              <div className="space-y-3">
                {[
                  { name: 'Arrays', val: 92 },
                  { name: 'Binary Search', val: 85 },
                  { name: 'Hash Maps', val: 80 }
                ].map((t, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{t.name}</span>
                      <span className="text-muted-foreground">{t.val}% Mastery</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${t.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full h-px bg-border/50" />
            <div>
              <p className="text-sm font-semibold text-red-400 mb-3 uppercase tracking-wider">Needs Improvement</p>
              <div className="space-y-3">
                {[
                  { name: 'Dynamic Programming', val: 35 },
                  { name: 'Graphs', val: 42 },
                  { name: 'Tries', val: 20 }
                ].map((t, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{t.name}</span>
                      <span className="text-muted-foreground">{t.val}% Mastery</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: `${t.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 6. AI Recommendations & Roadmap ── */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-6">
          
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-violet-500" /> AI Recommendations
            </h3>
            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-muted/40 border border-border/50 hover:bg-muted/60 transition-colors cursor-pointer group">
                  <div className="p-2 bg-background rounded-lg border border-border shrink-0 group-hover:border-violet-500/30 transition-colors">
                    <rec.icon className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{rec.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{rec.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-blue-500" /> Upcoming Roadmap
            </h3>
            <div className="space-y-2">
              {roadmapTasks.map((task, i) => (
                <div key={i} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer">
                  <div className={`w-4 h-4 rounded-full border ${task.completed ? 'bg-primary border-primary flex items-center justify-center' : 'border-muted-foreground'}`}>
                    {task.completed && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  <span className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.title}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── 4. Recent Activity ── */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" /> Recent Activity
            </h3>
            <button className="text-xs text-primary hover:underline">View All</button>
          </div>
          <div className="relative flex-1">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border/60" />
            <div className="space-y-6">
              {recentActivity.map((act, i) => (
                <div key={i} className="relative flex gap-4">
                  <div className="relative z-10 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center shrink-0">
                    <act.icon className={`w-3.5 h-3.5 ${act.color}`} />
                  </div>
                  <div className="pt-1.5">
                    <p className="text-sm font-medium">{act.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* ── 8. Mini Insights Previews ── */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            <Link to="/github" className="p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/50 transition-colors block">
              <div className="flex items-center gap-2 mb-2">
                <GitBranch className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-semibold">GitHub Insight</span>
              </div>
              <p className="text-lg font-bold text-foreground">Top 15%</p>
              <p className="text-[10px] text-muted-foreground">in active commits</p>
            </Link>
            <Link to="/resume" className="p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/50 transition-colors block">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-semibold">Resume ATS</span>
              </div>
              <p className="text-lg font-bold text-foreground">84 / 100</p>
              <p className="text-[10px] text-muted-foreground">+3 since last scan</p>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
