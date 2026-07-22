import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud, FileText, CheckCircle2, AlertCircle, 
  ArrowLeft, RefreshCw, Sparkles, AlertTriangle, 
  Plus, Check, Briefcase, Award, ArrowUpRight
} from 'lucide-react';
import toast from 'react-hot-toast';

// Color themes based on score
const getScoreTheme = (score: number) => {
  if (score >= 80) return { color: 'text-green-500', stroke: '#10b981', bg: 'bg-green-500/10', border: 'border-green-500/20' };
  if (score >= 50) return { color: 'text-yellow-500', stroke: '#f59e0b', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
  return { color: 'text-red-500', stroke: '#ef4444', bg: 'bg-red-500/10', border: 'border-red-500/20' };
};

export const ResumePage = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  
  // Analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analysisSteps = [
    'Reading PDF contents...',
    'Extracting sections (Experience, Skills, Education)...',
    'Analyzing text with ATS parsing guidelines...',
    'Matching keywords against industry job roles...',
    'Generating layout and formatting score...',
    'Compiling suggestions and missing skills...'
  ];

  // Load saved analysis from localStorage on mount
  useEffect(() => {
    try {
      const savedScore = localStorage.getItem('resumeScore');
      const savedAnalysis = localStorage.getItem('resumeAnalysis');
      if (savedAnalysis) {
        setAnalysisResult(JSON.parse(savedAnalysis));
      } else if (savedScore) {
        // Fallback default structure if only score was saved
        setAnalysisResult({
          score: parseInt(savedScore, 10),
          metrics: { keywords: 63, formatting: 78, structure: 70, experienceMatch: 56 },
          missingKeywords: [
            { name: 'Kubernetes', priority: 'high' },
            { name: 'System Design', priority: 'high' },
            { name: 'CI/CD Pipelines', priority: 'high' },
            { name: 'Redis Caching', priority: 'medium' },
            { name: 'Microservices', priority: 'medium' },
            { name: 'Unit Testing', priority: 'medium' },
            { name: 'AWS Cloud', priority: 'medium' },
            { name: 'Kafka', priority: 'low' },
            { name: 'Agile/Scrum', priority: 'low' },
          ],
          suggestions: [
            {
              id: 1,
              category: 'Experience & Impact',
              title: 'Quantify your achievements with metrics',
              description: 'Rewrite bullet points to follow the Google X-Y-Z formula (e.g. Accomplished [X] as measured by [Y], by doing [Z]). Add concrete percentages or cost savings.',
              impact: '+12 ATS Points',
              type: 'high'
            }
          ]
        });
      }
    } catch (e) {
      console.error('Failed to load stored resume analysis', e);
    }
  }, []);

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      toast.error('Only PDF files are supported for resume analysis.');
      return;
    }
    
    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File is too large. Maximum size is 10MB.');
      return;
    }

    setFile(selectedFile);
    
    // Revoke old URL if exists
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(URL.createObjectURL(selectedFile));
    toast.success(`Loaded ${selectedFile.name}`);
  };

  const startAnalysis = () => {
    if (!file) {
      toast.error('Please upload a resume first.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStep(0);
    setAnalysisResult(null);

    // Simulate step-by-step progress
    const interval = setInterval(() => {
      setAnalysisStep((prev) => {
        if (prev < analysisSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          finishAnalysis();
          return prev;
        }
      });
    }, 1200);
  };

  const finishAnalysis = () => {
    // Generate beautiful mock results depending slightly on file name and JD
    const baseScore = file?.name.toLowerCase().includes('senior') ? 82 : 68;
    const jdMatchBonus = jobDescription.trim().length > 20 ? 8 : 0;
    const finalScore = Math.min(Math.max(baseScore + jdMatchBonus, 35), 98);

    const resultObj = {
      score: finalScore,
      fileName: file?.name || 'Anuj_Resume.pdf',
      metrics: {
        keywords: Math.min(finalScore - 5, 95),
        formatting: Math.min(finalScore + 10, 98),
        structure: Math.min(finalScore + 2, 96),
        experienceMatch: Math.min(finalScore - 12, 92),
      },
      missingKeywords: [
        { name: 'Kubernetes', priority: 'high' },
        { name: 'System Design', priority: 'high' },
        { name: 'CI/CD Pipelines', priority: 'high' },
        { name: 'Redis Caching', priority: 'medium' },
        { name: 'Microservices', priority: 'medium' },
        { name: 'Unit Testing', priority: 'medium' },
        { name: 'AWS Cloud', priority: 'medium' },
        { name: 'Kafka', priority: 'low' },
        { name: 'Agile/Scrum', priority: 'low' },
      ],
      suggestions: [
        {
          id: 1,
          category: 'Experience & Impact',
          title: 'Quantify your achievements with metrics',
          description: 'Rewrite bullet points to follow the Google X-Y-Z formula (e.g. Accomplished [X] as measured by [Y], by doing [Z]). Add concrete percentages or cost savings.',
          impact: '+12 ATS Points',
          type: 'high'
        },
        {
          id: 2,
          category: 'Keywords & Skills',
          title: 'Incorporate missing cloud & devops skills',
          description: 'Your resume is missing modern orchestration and devops concepts like Kubernetes or Docker which were highly mentioned in common backend profiles.',
          impact: '+8 ATS Points',
          type: 'high'
        },
        {
          id: 3,
          category: 'Formatting',
          title: 'Avoid double-column layouts',
          description: 'ATS parsers sometimes scan columns horizontally rather than vertically. Consider switching to a single-column clean format for maximum compliance.',
          impact: '+5 ATS Points',
          type: 'medium'
        },
        {
          id: 4,
          category: 'Section Organization',
          title: 'Rename "Tech Stack" to "Technical Skills"',
          description: 'Standard section titles make it easier for legacy systems to extract and map your proficiency correctly.',
          impact: '+3 ATS Points',
          type: 'low'
        }
      ]
    };

    setAnalysisResult(resultObj);
    localStorage.setItem('resumeScore', finalScore.toString());
    localStorage.setItem('resumeAnalysis', JSON.stringify(resultObj));
    if (file?.name) localStorage.setItem('resumeFileName', file.name);

    setIsAnalyzing(false);
    toast.success('Resume analysis completed successfully!');
  };

  const handleReset = () => {
    setFile(null);
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
    setAnalysisResult(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            Resume ATS Optimizer
          </h1>
          <p className="text-muted-foreground mt-1.5">
            Compare your resume against industry benchmarks and get instant feedback to bypass automated parsers.
          </p>
        </div>
        {analysisResult && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-border bg-card rounded-md hover:bg-muted transition-colors text-sm font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            Analyze Another
          </button>
        )}
      </div>

      {/* Main Container */}
      {!analysisResult && !isAnalyzing ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Area (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div
              className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 flex flex-col items-center justify-center min-h-[350px] bg-card/50 backdrop-blur-sm
                ${dragActive ? 'border-primary bg-primary/5 scale-[0.99]' : 'border-border hover:border-primary/50'}`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="application/pdf"
                onChange={handleFileChange}
              />

              {!file ? (
                <div className="text-center space-y-4">
                  <div className="p-4 bg-muted rounded-full inline-flex text-muted-foreground">
                    <UploadCloud className="w-12 h-12" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-semibold">
                      Drag & drop your resume PDF here, or{' '}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-primary hover:underline font-bold"
                      >
                        browse files
                      </button>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Only PDF formats are supported. Maximum size 10MB.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="p-4 bg-primary/10 rounded-full inline-flex text-primary">
                    <FileText className="w-12 h-12" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • PDF Document
                    </p>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 border border-border bg-card rounded-md hover:bg-muted text-sm font-semibold transition-colors"
                    >
                      Replace File
                    </button>
                    <button
                      onClick={startAnalysis}
                      className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:opacity-90 text-sm shadow-md transition-opacity"
                    >
                      Start Optimization
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Optional Job Description Match */}
            <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-base">Target Job Description (Optional)</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Paste the job description you are targeting. We will run custom semantic matching to show exact keyword gaps.
              </p>
              <textarea
                placeholder="Paste responsibilities, requirements, and tech stack here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all"
              />
            </div>
          </div>

          {/* Quick Info Sidebar */}
          <div className="space-y-6">
            <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Why Optimize Resume?
              </h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <div className="w-5 h-5 shrink-0 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mt-0.5">
                    ✓
                  </div>
                  <p>Over 75% of resumes are discarded by ATS software before reaching a hiring manager.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 shrink-0 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mt-0.5">
                    ✓
                  </div>
                  <p>Mismatching section headings or complex columns can render your CV unreadable.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 shrink-0 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mt-0.5">
                    ✓
                  </div>
                  <p>Tailoring keywords raises interview request rates by up to 3x.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : isAnalyzing ? (
        /* Processing / Loading Steps State */
        <div className="max-w-xl mx-auto p-8 bg-card border border-border rounded-2xl flex flex-col items-center justify-center min-h-[400px] shadow-lg">
          <div className="relative w-24 h-24 mb-8">
            <div className="w-24 h-24 border-4 border-primary/20 rounded-full" />
            <div className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-foreground mb-2">Analyzing Resume</h2>
          <p className="text-sm text-muted-foreground mb-6 text-center">
            Extracting components and comparing against role models...
          </p>

          <div className="w-full space-y-3 bg-muted/40 p-4 rounded-xl border border-border">
            {analysisSteps.map((step, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 text-sm transition-all duration-300
                  ${idx < analysisStep ? 'text-green-500' : idx === analysisStep ? 'text-primary font-medium' : 'text-muted-foreground/50'}`}
              >
                {idx < analysisStep ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : idx === analysisStep ? (
                  <RefreshCw className="w-4 h-4 shrink-0 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-border shrink-0" />
                )}
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Analysis Results Dashboard */
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Resume Preview (4 cols) */}
          <div className="xl:col-span-4 flex flex-col space-y-4">
            <div className="p-4 border border-border bg-card rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-bold text-sm truncate max-w-[200px]">{file?.name}</h3>
                  <p className="text-xs text-muted-foreground">Previewing Document</p>
                </div>
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-primary hover:underline font-bold"
              >
                Change
              </button>
            </div>
            
            <div className="border border-border rounded-2xl overflow-hidden bg-muted/40 h-[650px] shadow-sm relative flex flex-col justify-between">
              {pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  className="w-full h-full border-none"
                  title="Resume PDF Preview"
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mb-3" />
                  <p className="text-sm">Preview Unavailable</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Optimization Feedback Dashboard (8 cols) */}
          <div className="xl:col-span-8 space-y-8">
            
            {/* ATS Score & Quick Metrics Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-card border border-border rounded-2xl p-6 shadow-sm">
              
              {/* Animated Circular Progress Gauge */}
              <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-border pb-6 md:pb-0 md:pr-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                  Overall ATS Score
                </h4>
                
                {/* SVG Gauge */}
                <div className="relative w-36 h-36">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background Track */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="transparent"
                      stroke="currentColor"
                      className="text-border"
                      strokeWidth="8"
                    />
                    {/* Animated Fill Path */}
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="transparent"
                      stroke={getScoreTheme(analysisResult.score).stroke}
                      strokeWidth="8"
                      strokeDasharray="263.89"
                      initial={{ strokeDashoffset: 263.89 }}
                      animate={{ strokeDashoffset: 263.89 - (263.89 * analysisResult.score) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold tracking-tight">{analysisResult.score}</span>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">out of 100</span>
                  </div>
                </div>

                <span className={`mt-4 px-3 py-1 rounded-full text-xs font-bold border ${getScoreTheme(analysisResult.score).bg} ${getScoreTheme(analysisResult.score).color} ${getScoreTheme(analysisResult.score).border}`}>
                  {analysisResult.score >= 80 ? 'Excellent Match' : analysisResult.score >= 50 ? 'Needs Improvement' : 'Critical Action Needed'}
                </span>
              </div>

              {/* Horizontal Bar Breakdown Charts */}
              <div className="md:col-span-2 flex flex-col justify-center space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Score Breakdown Analysis
                </h4>
                
                <div className="space-y-3">
                  {[
                    { label: 'Keyword Compliance', val: analysisResult.metrics.keywords },
                    { label: 'Formatting & Layout', val: analysisResult.metrics.formatting },
                    { label: 'Structure & Sections', val: analysisResult.metrics.structure },
                    { label: 'Experience Alignment', val: analysisResult.metrics.experienceMatch },
                  ].map((m, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-muted-foreground">{m.label}</span>
                        <span>{m.val}%</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${m.val}%` }}
                          transition={{ duration: 1.2, delay: idx * 0.1, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    Missing Critical Keywords
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Adding these skills dynamically bumps your score. Click any keyword to copy to clipboard.
                  </p>
                </div>
                <span className="text-xs text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full font-bold">
                  {analysisResult.missingKeywords.length} Gaps Found
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {analysisResult.missingKeywords.map((kw: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => {
                      navigator.clipboard.writeText(kw.name);
                      toast.success(`Copied "${kw.name}"`);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95
                      ${kw.priority === 'high' 
                        ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20' 
                        : kw.priority === 'medium'
                        ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20'
                        : 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20'}`}
                  >
                    <Plus className="w-3 h-3" />
                    {kw.name}
                    <span className="opacity-60 text-[9px] uppercase tracking-wider">
                      ({kw.priority})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Suggestions list */}
            <div className="space-y-4">
              <h3 className="font-bold text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Actionable Optimization Suggestions
              </h3>

              <div className="space-y-3">
                {analysisResult.suggestions.map((s: any) => (
                  <div
                    key={s.id}
                    className="p-5 bg-card border border-border rounded-xl space-y-2 flex flex-col md:flex-row items-start gap-4 transition-all hover:border-border/80"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-muted text-muted-foreground rounded-full border border-border">
                          {s.category}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border
                          ${s.type === 'high' ? 'bg-red-500/10 border-red-500/20 text-red-400' : s.type === 'medium' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                          {s.type.toUpperCase()} PRIORITY
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-foreground pt-1">{s.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                    </div>
                    
                    <div className="shrink-0 flex md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 md:pl-4 border-border">
                      <span className="text-xs font-extrabold text-green-500 flex items-center gap-0.5">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        {s.impact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePage;
