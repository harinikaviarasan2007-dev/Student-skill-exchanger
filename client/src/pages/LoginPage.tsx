import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftRight, LogIn, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setLoading(true);
    try {
      await login(demoEmail, 'password123');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        {/* Brand Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl brand-gradient flex items-center justify-center text-white mx-auto shadow-md shadow-sky-500/20">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 font-['Outfit']">
            Welcome back to SkillSwap
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Sign in to access your skills dashboard and matches
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Student Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. arun@skillswap.edu"
              required
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <span className="text-[11px] text-slate-400">Demo password: password123</span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-xs font-bold text-white brand-gradient rounded-xl shadow-md shadow-sky-500/20 hover:opacity-95 transition disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            <LogIn className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Demo Accounts */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Quick Demo Login (1-Click):
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('arun@skillswap.edu')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition text-left group"
            >
              <span className="text-xs font-bold text-slate-800 group-hover:text-sky-700 block">
                Arun Kumar
              </span>
              <span className="text-[10px] text-slate-500 block">Python → Wants UI/UX</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('priya@skillswap.edu')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50/50 transition text-left group"
            >
              <span className="text-xs font-bold text-slate-800 group-hover:text-violet-700 block">
                Priya Sharma
              </span>
              <span className="text-[10px] text-slate-500 block">UI/UX → Wants Python</span>
            </button>
          </div>
        </div>

        {/* Register footer link */}
        <p className="text-center text-xs text-slate-500 pt-2">
          New to SkillSwap?{' '}
          <Link to="/register" className="font-semibold text-sky-600 hover:text-sky-800">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
