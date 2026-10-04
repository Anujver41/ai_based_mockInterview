import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Loader2, WifiOff } from 'lucide-react';

import { signup } from '@/features/auth/api/authApi';
import { signupSchema, SignupData } from '@/features/auth/schemas/authSchemas';
import { setCredentials } from '@/store/slices/authSlice';

export const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [slowWarning, setSlowWarning] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  });

  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      queryClient.clear();
      setSlowWarning(false);
      dispatch(
        setCredentials({
          user: { id: data.id, email: data.email, role: data.role },
          token: data.token,
        })
      );
      toast.success('Account created successfully!');
      navigate('/dashboard', { replace: true });
    },
    onError: (error: any) => {
      setSlowWarning(false);
      const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
      toast.error(
        isTimeout
          ? 'Server is starting up (cold start). Please try again.'
          : (error.response?.data?.error || 'Failed to create account. Email might be in use.')
      );
    },
  });

  // Show "slow connection" warning after 3 seconds of pending
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (mutation.isPending) {
      timer = setTimeout(() => setSlowWarning(true), 3000);
    } else {
      setSlowWarning(false);
    }
    return () => clearTimeout(timer);
  }, [mutation.isPending]);

  const onSubmit = (data: SignupData) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-xl border border-border shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Create an account</h1>
          <p className="text-muted-foreground text-sm">Enter your details below to get started</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              {...register('email')}
              className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                errors.email ? 'border-destructive' : 'border-border'
              }`}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                errors.password ? 'border-destructive' : 'border-border'
              }`}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-2 px-4 bg-primary text-primary-foreground font-medium rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity flex justify-center items-center gap-2"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating account…</span>
              </>
            ) : 'Sign Up'}
          </button>
        </form>

        {/* Slow connection notice */}
        {slowWarning && (
          <div className="flex items-start gap-2 text-xs text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
            <WifiOff className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>
              Server is warming up (cold start). This may take a few more seconds — your account will be created automatically.
            </span>
          </div>
        )}

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
