import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { createProblem, ProblemCreateRequest, TestCase } from '../../api/problemApi';
import { Plus, Trash2, Save, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ProblemCreatePage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<ProblemCreateRequest>({
    title: '',
    description: '',
    difficulty: 'EASY',
    tags: [],
    constraints: [],
    testCases: [{ input: '', expectedOutput: '', isHidden: false }]
  });

  const [tagInput, setTagInput] = useState('');
  const [constraintInput, setConstraintInput] = useState('');

  const mutation = useMutation({
    mutationFn: createProblem,
    onSuccess: () => {
      toast.success('Problem created successfully!');
      navigate('/problems');
    },
    onError: (error) => {
      toast.error('Failed to create problem. Please try again.');
      console.error(error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Title and description are required.');
      return;
    }
    mutation.mutate(formData);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleAddConstraint = () => {
    if (constraintInput.trim()) {
      setFormData({ ...formData, constraints: [...formData.constraints, constraintInput.trim()] });
      setConstraintInput('');
    }
  };

  const handleAddTestCase = () => {
    setFormData({
      ...formData,
      testCases: [...formData.testCases, { input: '', expectedOutput: '', isHidden: false }]
    });
  };

  const updateTestCase = (index: number, field: keyof TestCase, value: any) => {
    const updatedTestCases = [...formData.testCases];
    updatedTestCases[index] = { ...updatedTestCases[index], [field]: value };
    setFormData({ ...formData, testCases: updatedTestCases });
  };

  const removeTestCase = (index: number) => {
    const updatedTestCases = formData.testCases.filter((_, i) => i !== index);
    setFormData({ ...formData, testCases: updatedTestCases });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/problems')} className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Problem</h1>
          <p className="text-muted-foreground mt-1">Add a new coding problem to the platform.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-card p-8 rounded-xl border border-border shadow-sm">
        
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Basic Information</h2>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">Problem Title</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary/50 outline-none"
              placeholder="e.g. Two Sum"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Description (Markdown supported)</label>
            <textarea 
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary/50 outline-none min-h-[150px]"
              placeholder="Explain the problem clearly..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Difficulty</label>
            <select 
              className="w-full md:w-1/3 px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary/50 outline-none"
              value={formData.difficulty}
              onChange={e => setFormData({ ...formData, difficulty: e.target.value as any })}
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
        </div>

        {/* Metadata */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Metadata</h2>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                className="flex-1 px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary/50 outline-none"
                placeholder="e.g. Array, Hash Table"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <button type="button" onClick={handleAddTag} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">Add</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                  {tag}
                  <button type="button" onClick={() => setFormData({...formData, tags: formData.tags.filter(t => t !== tag)})}>
                    <Trash2 className="w-3 h-3 hover:text-destructive" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Constraints</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                className="flex-1 px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary/50 outline-none font-mono text-sm"
                placeholder="e.g. 2 <= nums.length <= 10^4"
                value={constraintInput}
                onChange={e => setConstraintInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddConstraint())}
              />
              <button type="button" onClick={handleAddConstraint} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">Add</button>
            </div>
            <ul className="list-disc list-inside mt-2 space-y-1">
              {formData.constraints.map((constraint, i) => (
                <li key={i} className="text-sm font-mono flex items-center gap-2 group">
                  <span className="flex-1">{constraint}</span>
                  <button type="button" onClick={() => setFormData({...formData, constraints: formData.constraints.filter((_, idx) => idx !== i)})} className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Test Cases */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="text-xl font-semibold">Test Cases</h2>
            <button type="button" onClick={handleAddTestCase} className="flex items-center gap-1 text-sm bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md hover:bg-secondary/80 transition-colors">
              <Plus className="w-4 h-4" /> Add Test Case
            </button>
          </div>
          
          <div className="space-y-6">
            {formData.testCases.map((tc, index) => (
              <div key={index} className="p-4 bg-muted/30 border border-border rounded-lg relative group">
                <button type="button" onClick={() => removeTestCase(index)} className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <h4 className="font-medium mb-4">Test Case {index + 1}</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Input</label>
                    <textarea 
                      className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary/50 outline-none font-mono text-sm min-h-[80px]"
                      value={tc.input}
                      onChange={e => updateTestCase(index, 'input', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Expected Output</label>
                    <textarea 
                      className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary/50 outline-none font-mono text-sm min-h-[80px]"
                      value={tc.expectedOutput}
                      onChange={e => updateTestCase(index, 'expectedOutput', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id={`hidden-${index}`}
                    className="rounded border-input text-primary focus:ring-primary"
                    checked={tc.isHidden}
                    onChange={e => updateTestCase(index, 'isHidden', e.target.checked)}
                  />
                  <label htmlFor={`hidden-${index}`} className="text-sm font-medium cursor-pointer">
                    Hidden Test Case (Used for evaluation, not shown to user)
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-border flex justify-end">
          <button 
            type="submit" 
            disabled={mutation.isPending}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70 font-medium"
          >
            {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {mutation.isPending ? 'Saving...' : 'Save Problem'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ProblemCreatePage;
