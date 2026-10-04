import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BrainCircuit, Code2, Mic, FileText, GitBranch, Sparkles, 
  CheckCircle2, ArrowRight, Terminal, Zap, BarChart3, Target, 
  ShieldCheck, Star, ChevronDown, ChevronUp, Play, Users, 
  Award, Cpu, Layers, Check, ExternalLink, HelpCircle,
  MessageSquare, TrendingUp, Compass, ArrowUpRight
} from 'lucide-react';

export const LandingPage = () => {
  const [activeTab, setActiveTab] = useState<'interview' | 'code' | 'resume' | 'github'>('interview');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-background text-foreground">
      
      {/* ── Background Glow Effects ── */}
      <div className="relative isolate overflow-hidden">
        <div 
          className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl opacity-30 dark:opacity-20 pointer-events-none"
          style={{ width: '80rem', height: '35rem' }}
        >
          <div 
            className="w-full h-full bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400"
            style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}
          />
        </div>

        {/* ── HERO SECTION ── */}
        <section className="container mx-auto px-4 pt-12 pb-20 md:pt-20 md:pb-28 text-center max-w-6xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-300 text-xs sm:text-sm font-medium mb-8 backdrop-blur-md hover:border-violet-500/50 transition-all cursor-default shadow-sm">
            <Sparkles className="w-4 h-4 text-violet-500 animate-pulse" />
            <span>Next-Gen AI Mock Interviews & Coding Suite</span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span className="hidden sm:inline text-xs opacity-80">v2.0 Beta Live</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.15] mb-6">
            Master Technical Interviews <br className="hidden sm:inline" />
            With <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">Real-Time AI Coaching</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10">
            Practice realistic AI-driven voice & technical mock interviews, receive instant line-by-line code optimizations, fine-tune your resume with ATS scoring, and benchmark your GitHub portfolio for top-tier software engineering roles.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all text-base"
            >
              <span>Start Free Practice</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/problems"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold bg-card hover:bg-muted text-foreground border border-border hover:border-primary/40 shadow-sm transition-all text-base"
            >
              <Terminal className="w-4 h-4 text-primary" />
              <span>Explore Coding Arena</span>
            </Link>

            <a
              href="#interactive-demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors text-base"
            >
              <Play className="w-4 h-4 fill-current opacity-70" />
              <span>View Interactive Demo</span>
            </a>
          </div>

          {/* Social Proof Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-muted-foreground pt-4 border-t border-border/50 max-w-4xl mx-auto">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>500+ Curated DSA & System Design</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Realistic FAANG-style personas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="font-semibold text-foreground">4.9/5</span>
              <span>by 15k+ engineers</span>
            </div>
          </div>
        </section>

        {/* ── INTERACTIVE LIVE SHOWCASE TABS ── */}
        <section id="interactive-demo" className="container mx-auto px-4 pb-24 max-w-6xl">
          <div className="text-center mb-8">
            <span className="text-xs uppercase font-bold tracking-widest text-violet-500 mb-2 block">Live Product Preview</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Experience The Platform in Action</h2>
          </div>

          {/* Demo Container */}
          <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
            {/* Tab Header */}
            <div className="flex flex-wrap items-center justify-between border-b border-border bg-muted/30 px-4 py-3 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-xs font-mono text-muted-foreground ml-2 hidden sm:inline">ai-platform://interactive-suite</span>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => setActiveTab('interview')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    activeTab === 'interview'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>AI Mock Interview</span>
                </button>

                <button
                  onClick={() => setActiveTab('code')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    activeTab === 'code'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Code Review</span>
                </button>

                <button
                  onClick={() => setActiveTab('resume')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    activeTab === 'resume'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Resume ATS</span>
                </button>

                <button
                  onClick={() => setActiveTab('github')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    activeTab === 'github'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>GitHub Insights</span>
                </button>
              </div>
            </div>

            {/* Tab Body */}
            <div className="p-5 sm:p-8 bg-card/70 min-h-[420px] flex flex-col justify-center">
              
              {/* TAB 1: AI MOCK INTERVIEW */}
              {activeTab === 'interview' && (
                <div className="space-y-6 max-w-4xl mx-auto w-full animate-fadeIn">
                  {/* Interviewer Profile Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-muted/40 border border-border">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                          AI
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm">Interviewer: Alex (Senior Engineering Lead)</h4>
                          <span className="text-[10px] uppercase font-bold bg-violet-500/10 text-violet-500 px-2 py-0.5 rounded-full border border-violet-500/20">
                            System Design & DSA
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Simulation: Distributed Caching & Rate Limiting • 25 min elapsed</p>
                      </div>
                    </div>

                    {/* Audio Waveform Animation simulation */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-border">
                      <Mic className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                      <span className="text-xs text-muted-foreground mr-1">Voice active:</span>
                      <div className="flex items-end gap-1 h-4">
                        <span className="w-1 bg-violet-500 rounded-full animate-bounce h-2" style={{ animationDelay: '0.1s' }} />
                        <span className="w-1 bg-indigo-500 rounded-full animate-bounce h-4" style={{ animationDelay: '0.2s' }} />
                        <span className="w-1 bg-cyan-500 rounded-full animate-bounce h-3" style={{ animationDelay: '0.15s' }} />
                        <span className="w-1 bg-violet-500 rounded-full animate-bounce h-4" style={{ animationDelay: '0.3s' }} />
                        <span className="w-1 bg-indigo-500 rounded-full animate-bounce h-2" style={{ animationDelay: '0.25s' }} />
                      </div>
                    </div>
                  </div>

                  {/* Chat Dialogue */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-600/10 text-violet-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-violet-500/20">
                        AI
                      </div>
                      <div className="bg-muted/60 border border-border p-4 rounded-2xl rounded-tl-sm text-sm text-foreground space-y-1.5 max-w-2xl">
                        <p className="font-medium text-xs text-violet-500">Alex • AI Interviewer</p>
                        <p>
                          "That sliding window approach for rate limiting is clean. However, if your API experiences 100,000 requests/sec across 20 distributed gateway nodes, how would you synchronize token counts without incurring database locking latency?"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 justify-end">
                      <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl rounded-tr-sm text-sm text-foreground space-y-1.5 max-w-2xl text-right">
                        <p className="font-medium text-xs text-primary">You (Candidate)</p>
                        <p>
                          "I would offload state to an in-memory Redis cluster with Redis cell / Lua scripts to atomically execute the token bucket algorithm in O(1) time without distributed locks."
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        ME
                      </div>
                    </div>
                  </div>

                  {/* Real-time AI Rubric Assessment */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3.5 rounded-xl bg-background border border-border flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs text-muted-foreground">Technical Depth</span>
                        <div className="text-base font-bold text-emerald-500 flex items-center gap-1.5">
                          <span>94%</span>
                          <span className="text-[11px] font-normal text-muted-foreground">Exceptional</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Check className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-background border border-border flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs text-muted-foreground">Communication & Clarity</span>
                        <div className="text-base font-bold text-indigo-500 flex items-center gap-1.5">
                          <span>91%</span>
                          <span className="text-[11px] font-normal text-muted-foreground">Structured</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-background border border-border flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs text-muted-foreground">System Scalability</span>
                        <div className="text-base font-bold text-violet-500 flex items-center gap-1.5">
                          <span>88%</span>
                          <span className="text-[11px] font-normal text-muted-foreground">Strong</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-500">
                        <Cpu className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CODE REVIEW */}
              {activeTab === 'code' && (
                <div className="space-y-6 max-w-4xl mx-auto w-full animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-indigo-500" />
                      <span className="font-semibold text-sm">TwoSum_Optimized.ts</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono">Passed 48/48 Test Cases</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2.5 py-1 rounded-md bg-muted border border-border font-mono">
                        Time: <strong className="text-emerald-500">O(N)</strong>
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-md bg-muted border border-border font-mono">
                        Space: <strong className="text-indigo-400">O(N)</strong>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Code Snippet */}
                    <div className="lg:col-span-7 bg-background rounded-xl p-4 font-mono text-xs text-foreground border border-border overflow-x-auto space-y-1">
                      <div className="text-muted-foreground">// Optimized Hash Map Implementation</div>
                      <div><span className="text-violet-500">function</span> <span className="text-indigo-400">twoSum</span>(nums: <span className="text-cyan-500">number[]</span>, target: <span className="text-cyan-500">number</span>): <span className="text-cyan-500">number[]</span> &#123;</div>
                      <div className="pl-4"><span className="text-violet-500">const</span> map = <span className="text-violet-500">new</span> <span className="text-yellow-500">Map</span>&lt;<span className="text-cyan-500">number</span>, <span className="text-cyan-500">number</span>&gt;();</div>
                      <div className="pl-4"><span className="text-violet-500">for</span> (<span className="text-violet-500">let</span> i = 0; i &lt; nums.length; i++) &#123;</div>
                      <div className="pl-8"><span className="text-violet-500">const</span> complement = target - nums[i];</div>
                      <div className="pl-8"><span className="text-violet-500">if</span> (map.has(complement)) &#123;</div>
                      <div className="pl-12"><span className="text-violet-500">return</span> [map.get(complement)!, i];</div>
                      <div className="pl-8">&#125;</div>
                      <div className="pl-8">map.set(nums[i], i);</div>
                      <div className="pl-4">&#125;</div>
                      <div className="pl-4"><span className="text-violet-500">return</span> [];</div>
                      <div>&#125;</div>
                    </div>

                    {/* AI Feedback Card */}
                    <div className="lg:col-span-5 space-y-3">
                      <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs space-y-2">
                        <div className="flex items-center gap-2 font-semibold text-violet-600 dark:text-violet-400">
                          <Zap className="w-4 h-4" />
                          <span>AI Senior Reviewer Feedback</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          Clean linear time solution! You avoided the naive <code className="text-rose-400 font-mono">O(N²)</code> nested loop by leveraging a single-pass hash lookup.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-muted/40 border border-border text-xs space-y-2">
                        <span className="font-semibold text-foreground flex items-center gap-2">
                          <Target className="w-3.5 h-3.5 text-emerald-500" />
                          Next Interview Follow-up
                        </span>
                        <p className="text-muted-foreground leading-relaxed">
                          "What if the input array is already sorted? Can you achieve <code className="font-mono text-emerald-400">O(1)</code> auxiliary space without the hash map?"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: RESUME ATS */}
              {activeTab === 'resume' && (
                <div className="space-y-6 max-w-4xl mx-auto w-full animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* ATS Score Gauge */}
                    <div className="p-5 rounded-xl bg-background border border-border flex flex-col items-center justify-center text-center space-y-2">
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        <div className="w-full h-full rounded-full border-4 border-muted border-t-emerald-500 border-r-emerald-500 rotate-45" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-extrabold text-foreground">92</span>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold">ATS Score</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-500">Tier 1: Top 5% Applicant</span>
                    </div>

                    {/* Matched Keywords */}
                    <div className="md:col-span-2 p-5 rounded-xl bg-background border border-border space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Role: Senior Full-Stack Engineer (FAANG)</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20 flex items-center gap-1">
                          <Check className="w-3 h-3" /> TypeScript / Node.js
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20 flex items-center gap-1">
                          <Check className="w-3 h-3" /> System Architecture
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Redis Caching
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Docker & Kubernetes
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-500 text-xs font-medium border border-amber-500/20 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Missing: GraphQL
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground pt-1">
                        <strong>Recruiter Insight:</strong> Adding 1 quantifiable bullet on latency reduction will increase callback chances by +28%.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: GITHUB INSIGHTS */}
              {activeTab === 'github' && (
                <div className="space-y-6 max-w-4xl mx-auto w-full animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-4 rounded-xl bg-background border border-border">
                      <span className="text-xs text-muted-foreground">Repo Architecture</span>
                      <div className="text-lg font-bold text-foreground mt-1">Production Ready</div>
                      <span className="text-[11px] text-emerald-500">CI/CD & Modular Clean Architecture</span>
                    </div>

                    <div className="p-4 rounded-xl bg-background border border-border">
                      <span className="text-xs text-muted-foreground">Commit Cadence</span>
                      <div className="text-lg font-bold text-foreground mt-1">426 Commits</div>
                      <span className="text-[11px] text-indigo-400">Consistent 52-week streak</span>
                    </div>

                    <div className="p-4 rounded-xl bg-background border border-border">
                      <span className="text-xs text-muted-foreground">Test Coverage</span>
                      <div className="text-lg font-bold text-foreground mt-1">87.4%</div>
                      <span className="text-[11px] text-emerald-500">Unit & E2E Suites active</span>
                    </div>

                    <div className="p-4 rounded-xl bg-background border border-border">
                      <span className="text-xs text-muted-foreground">Generated Questions</span>
                      <div className="text-lg font-bold text-foreground mt-1">14 Questions</div>
                      <span className="text-[11px] text-violet-400">Tailored to your actual PRs</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/40 border border-border text-xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GitBranch className="w-4 h-4 text-primary" />
                      <span><strong>AI Analysis:</strong> Your repos exhibit strong typing and microservices design. We auto-prepared 5 system questions based on your backend caching layers.</span>
                    </div>
                    <Link to="/github" className="text-primary hover:underline font-semibold shrink-0 ml-4 hidden sm:inline">
                      Analyze My GitHub →
                    </Link>
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>
      </div>

      {/* ── STATS BAR ── */}
      <section className="border-y border-border bg-card/40 backdrop-blur-md py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
                15,000+
              </div>
              <div className="text-sm text-muted-foreground font-medium">Mock Interviews Conducted</div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                94.8%
              </div>
              <div className="text-sm text-muted-foreground font-medium">Offer Acceptance Rate</div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                500+
              </div>
              <div className="text-sm text-muted-foreground font-medium">Curated Technical Challenges</div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-500 to-violet-600 bg-clip-text text-transparent">
                &lt; 2s
              </div>
              <div className="text-sm text-muted-foreground font-medium">Real-Time AI Response Latency</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPREHENSIVE FEATURES GRID ── */}
      <section id="features" className="py-24 container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase font-bold tracking-widest text-violet-500">Comprehensive Toolkit</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Everything You Need To <br />
            <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              Crack Top Tech Offers
            </span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Say goodbye to fragmented preparation. We combined speech AI, Monaco code execution, ATS parsing, and portfolio analysis into one cohesive platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Feature 1 */}
          <div className="p-7 rounded-2xl bg-card border border-border hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/5 transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">AI Voice & Chat Interviews</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Realistic mock interviews simulating FAANG behavioral, system design, and coding rounds. Conversational speech with live probing questions.
              </p>
            </div>
            <div className="pt-6 border-t border-border/50 mt-6 flex items-center justify-between text-xs font-semibold text-violet-500">
              <span>Simulate Real Hiring Managers</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 2 */}
          <div className="p-7 rounded-2xl bg-card border border-border hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">Interactive Monaco IDE</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Solve DSA problems in real-time with multi-language syntax highlighting, automated test runners, edge-case evaluation, and memory profilers.
              </p>
            </div>
            <div className="pt-6 border-t border-border/50 mt-6 flex items-center justify-between text-xs font-semibold text-indigo-500">
              <span>500+ Curated Problems</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 3 */}
          <div className="p-7 rounded-2xl bg-card border border-border hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/5 transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">Instant AI Code Review</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Receive senior-engineer-level critiques on your solutions. Uncover time/space complexity bottlenecks, hidden bugs, and idiomatic improvements.
              </p>
            </div>
            <div className="pt-6 border-t border-border/50 mt-6 flex items-center justify-between text-xs font-semibold text-cyan-500">
              <span>Automated Complexity Analysis</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 4 */}
          <div className="p-7 rounded-2xl bg-card border border-border hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">Resume ATS Scoring</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Scan your resume against job specifications. Pinpoint missing industry keywords, quantify accomplishments, and beat automated recruiter filters.
              </p>
            </div>
            <div className="pt-6 border-t border-border/50 mt-6 flex items-center justify-between text-xs font-semibold text-emerald-500">
              <span>Instant Recruiter Benchmark</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 5 */}
          <div className="p-7 rounded-2xl bg-card border border-border hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/5 transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <GitBranch className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">GitHub Portfolio Analyzer</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Audits your open-source repositories and commits. Identifies your strongest architectural patterns and crafts interview talking points around them.
              </p>
            </div>
            <div className="pt-6 border-t border-border/50 mt-6 flex items-center justify-between text-xs font-semibold text-purple-500">
              <span>Repo Architecture Grading</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 6 */}
          <div className="p-7 rounded-2xl bg-card border border-border hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/5 transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">Progress & Platform Sync</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Connect external accounts like LeetCode, HackerRank, and CodeChef. Track your cumulative interview readiness score on an intuitive dashboard.
              </p>
            </div>
            <div className="pt-6 border-t border-border/50 mt-6 flex items-center justify-between text-xs font-semibold text-amber-500">
              <span>All-In-One Tech Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* ── HOW IT WORKS (4-STEP PIPELINE) ── */}
      <section id="how-it-works" className="py-24 bg-muted/20 border-t border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest text-violet-500">Seamless Workflow</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">How AI.Platform Works</h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              From day one of prep to your final executive round, follow our proven 4-step path to interview mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-card border border-border space-y-4">
              <div className="w-10 h-10 rounded-full bg-violet-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-violet-600/30">
                1
              </div>
              <h3 className="text-lg font-bold">Connect & Calibrate</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Upload your resume, sync your GitHub, and set your target seniority level (Junior to Principal).
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-card border border-border space-y-4">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-indigo-600/30">
                2
              </div>
              <h3 className="text-lg font-bold">Select Role & Domain</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Choose Frontend, Backend, Fullstack, DSA algorithms, or Distributed System Design.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-card border border-border space-y-4">
              <div className="w-10 h-10 rounded-full bg-cyan-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-cyan-600/30">
                3
              </div>
              <h3 className="text-lg font-bold">Simulate Real Rounds</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Face dynamic AI interviewers that adapt in real time, ask follow-up questions, and evaluate live code.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative p-6 rounded-2xl bg-card border border-border space-y-4">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-emerald-600/30">
                4
              </div>
              <h3 className="text-lg font-bold">Iterate & Land Offers</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Review full transcripts, line-by-line feedback, rubric scorecards, and celebrate your job offers.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="py-24 container mx-auto px-4 max-w-5xl">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase font-bold tracking-widest text-violet-500">Why Choose Us</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">The Modern Standard For Interview Prep</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            See how AI.Platform compares to conventional mock interviews and generic course portals.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-lg">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-foreground font-semibold">
                <th className="p-4 sm:p-5">Feature</th>
                <th className="p-4 sm:p-5 text-violet-500 font-bold">AI.Platform</th>
                <th className="p-4 sm:p-5 text-muted-foreground">Human Mocks ($200/hr)</th>
                <th className="p-4 sm:p-5 text-muted-foreground">Traditional Courses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-muted-foreground">
              <tr>
                <td className="p-4 sm:p-5 font-medium text-foreground">24/7 Unlimited Practice</td>
                <td className="p-4 sm:p-5 text-emerald-500 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Instant On-Demand
                </td>
                <td className="p-4 sm:p-5">Requires Booking</td>
                <td className="p-4 sm:p-5">Self-paced (Static)</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-medium text-foreground">Adaptive Follow-up Questions</td>
                <td className="p-4 sm:p-5 text-emerald-500 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Real-time Probing
                </td>
                <td className="p-4 sm:p-5">Yes</td>
                <td className="p-4 sm:p-5">No (Pre-recorded)</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-medium text-foreground">Personalized to Your Resume & GitHub</td>
                <td className="p-4 sm:p-5 text-emerald-500 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Automatic Sync
                </td>
                <td className="p-4 sm:p-5">Varies widely</td>
                <td className="p-4 sm:p-5">No</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-medium text-foreground">Instant Line-by-Line Code Review</td>
                <td className="p-4 sm:p-5 text-emerald-500 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Sub-second Feedback
                </td>
                <td className="p-4 sm:p-5">Manual / Delayed</td>
                <td className="p-4 sm:p-5">Static solution tab</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-medium text-foreground">Affordability</td>
                <td className="p-4 sm:p-5 text-emerald-500 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Free Tier Available
                </td>
                <td className="p-4 sm:p-5">$150 - $350 / session</td>
                <td className="p-4 sm:p-5">$40 - $100 / month</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── TESTIMONIALS / SOCIAL PROOF ── */}
      <section id="testimonials" className="py-24 bg-muted/20 border-t border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest text-violet-500">Candidate Success</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Loved by Engineers Worldwide</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              See how developers used AI.Platform to land senior and staff engineering roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Review 1 */}
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed italic">
                  "The real-time voice follow-ups caught me completely off guard in the best way possible. It felt exactly like my Google L5 system design round. Landed the offer two weeks ago!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                  DK
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Devin K.</h4>
                  <p className="text-xs text-muted-foreground">Software Engineer @ Google</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed italic">
                  "The Resume ATS optimizer is pure gold. It highlighted 4 missing critical keywords for a Staff Backend role and gave me actionable phrases that tripled my recruiter reply rate."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                  SL
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Sarah L.</h4>
                  <p className="text-xs text-muted-foreground">Senior Backend Eng @ Stripe</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed italic">
                  "Having the Monaco editor with immediate AI code critiques helped me stop writing unoptimized nested loops. The time/space complexity breakdown teaches you how to think aloud."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xs">
                  AR
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Arjun R.</h4>
                  <p className="text-xs text-muted-foreground">Full-Stack Engineer @ Amazon</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION ── */}
      <section id="faq" className="py-24 container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs uppercase font-bold tracking-widest text-violet-500">Got Questions?</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Everything you need to know about preparing with AI.Platform.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "How realistic is the AI interview experience?",
              a: "Our AI is trained on thousands of authentic interview rubrics from Tier-1 tech companies. It listens to your audio, transcribes your answers in real time, and responds conversationally with tough follow-ups when your design is ambiguous or suboptimal."
            },
            {
              q: "Can I practice coding problems and run test cases?",
              a: "Yes! The platform includes a complete browser-based Monaco code editor supporting JavaScript, TypeScript, Python, C++, and Java with instant test execution and automated complexity reviews."
            },
            {
              q: "How does the ATS Resume Analyzer work?",
              a: "You upload your resume (PDF or DOCX), and our system parses your bullet points against real-world recruiter ATS filters, highlighting keyword omissions, weak verbs, and quantifiable impact opportunities."
            },
            {
              q: "Can I connect my existing LeetCode and GitHub profiles?",
              a: "Absolutely. Under Connected Platforms, you can link your GitHub, LeetCode, and HackerRank to sync your solved questions and give the AI context on your actual code style and projects."
            },
            {
              q: "Is there a free plan available?",
              a: "Yes, you can register for free and start practicing coding problems and taking baseline mock interviews immediately with no credit card required."
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="border border-border rounded-xl bg-card overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left font-semibold text-base sm:text-lg flex items-center justify-between gap-4 hover:bg-muted/40 transition-colors"
              >
                <span>{item.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-5 h-5 text-violet-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-sm sm:text-base text-muted-foreground border-t border-border/40 animate-fadeIn">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA BANNER ── */}
      <section className="py-20 container mx-auto px-4 max-w-6xl">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 p-8 sm:p-14 text-white text-center shadow-2xl">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs sm:text-sm font-semibold tracking-wide uppercase">
              Start Free Today
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to Land Your Dream Software Engineering Role?
            </h2>
            <p className="text-base sm:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
              Join thousands of engineers who leveled up their coding, system design, and communication skills with AI.Platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-white text-violet-950 hover:bg-slate-100 shadow-xl hover:-translate-y-0.5 transition-all text-base"
              >
                Get Started for Free
              </Link>
              <Link
                to="/problems"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all text-base"
              >
                Explore Practice Problems
              </Link>
            </div>
          </div>

          {/* Decorative circles */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        </div>
      </section>

      {/* ── RICH FOOTER ── */}
      <footer className="border-t border-border bg-card/60 pt-16 pb-12 mt-auto">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            
            {/* Col 1: Brand */}
            <div className="col-span-2 space-y-4">
              <Link to="/" className="text-xl font-bold tracking-tight flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-primary flex items-center justify-center shadow-md">
                  <BrainCircuit className="w-5 h-5 text-white" />
                </div>
                <span className="font-extrabold">AI.Platform</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                The all-in-one AI engineering interview intelligence platform. Realistic speech simulation, algorithmic problem solving, automated code reviews, and resume optimization.
              </p>
              <div className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} AI.Platform. Built for ambitious software engineers.
              </div>
            </div>

            {/* Col 2: Products */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/interview" className="hover:text-primary transition-colors">AI Mock Interview</Link></li>
                <li><Link to="/problems" className="hover:text-primary transition-colors">Coding Arena</Link></li>
                <li><Link to="/code-review" className="hover:text-primary transition-colors">Code Reviewer</Link></li>
                <li><Link to="/resume" className="hover:text-primary transition-colors">Resume ATS</Link></li>
                <li><Link to="/github" className="hover:text-primary transition-colors">GitHub Insights</Link></li>
              </ul>
            </div>

            {/* Col 3: Resources */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
                <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><Link to="/problems" className="hover:text-primary transition-colors">DSA Problem Library</Link></li>
                <li><Link to="/platforms" className="hover:text-primary transition-colors">Supported Platforms</Link></li>
              </ul>
            </div>

            {/* Col 4: Account */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Get Started</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/signup" className="hover:text-primary transition-colors">Create Free Account</Link></li>
                <li><Link to="/login" className="hover:text-primary transition-colors">Log In</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary transition-colors">Candidate Dashboard</Link></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
            <div className="flex items-center gap-6">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Security</span>
            </div>
            <p>Designed with excellence for modern technical hiring.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
