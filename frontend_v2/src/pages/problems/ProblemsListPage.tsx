import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProblems, Problem } from '../../api/problemApi';
import { getUserSubmissions } from '../../api/submissionApi';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

const ProblemsListPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['problems', page],
    queryFn: () => getProblems(page, 10),
  });

  const { data: submissions } = useQuery({
    queryKey: ['userSubmissions', user?.id],
    queryFn: () => getUserSubmissions(user?.id!),
    enabled: !!user?.id,
  });

  const solvedProblemIds = useMemo(() => {
    if (!submissions) return new Set<string>();
    return new Set(submissions.filter(s => s.status === 'PASSED').map(s => s.problemId));
  }, [submissions]);

  // Client side filtering for demo since backend doesn't support it in this endpoint
  const filteredProblems = data?.content.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesDiff = difficultyFilter === 'ALL' || p.difficulty === difficultyFilter;
    return matchesSearch && matchesDiff;
  }) || [];

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'EASY': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'MEDIUM': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'HARD': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coding Problems</h1>
          <p className="text-muted-foreground mt-1">Practice and improve your coding skills.</p>
        </div>
        
        <Link to="/problems/new" className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Create Problem</span>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-lg border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search problems or tags..." 
            className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select 
            className="bg-background border border-input px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="ALL">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
      </div>

      {error ? (
        <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3 text-destructive">
          <AlertCircle className="w-6 h-6" />
          <p>Failed to load problems. Please try again later.</p>
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-card rounded-lg border border-border animate-pulse" />
          ))}
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <p className="text-muted-foreground">No problems found matching your criteria.</p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium w-32">Difficulty</th>
                <th className="p-4 font-medium hidden md:table-cell">Tags</th>
                <th className="p-4 font-medium w-24 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((problem) => (
                <tr key={problem.id} className="border-b border-border hover:bg-muted/30 transition-colors group">
                  <td className="p-4 font-medium group-hover:text-primary transition-colors">
                    <Link to={`/problems/${problem.id}`} className="flex items-center gap-2">
                      {solvedProblemIds.has(problem.id) && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      )}
                      <span>{problem.title}</span>
                    </Link>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full border ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {problem.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                      {(problem.tags?.length || 0) > 3 && (
                        <span className="text-xs text-muted-foreground px-1">+{problem.tags.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <Link to={`/problems/${problem.id}`} className="text-sm text-primary hover:underline">
                      Solve
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-4">
          <button 
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-2 border border-input bg-background rounded-md disabled:opacity-50 hover:bg-muted"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {data.totalPages}
          </span>
          <button 
            onClick={() => setPage(p => Math.min(data.totalPages - 1, p + 1))}
            disabled={page >= data.totalPages - 1}
            className="p-2 border border-input bg-background rounded-md disabled:opacity-50 hover:bg-muted"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProblemsListPage;
