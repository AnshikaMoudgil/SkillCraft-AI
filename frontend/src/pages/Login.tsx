import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import {
  Sparkles,
  CheckCircle2,
  Mail,
  Lock,
  User,
  Bot,
  Laptop,
  Terminal,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const Login: React.FC = () => {
  const location = useLocation();
  const [isLoginTab, setIsLoginTab] = useState(location.pathname !== '/signup');
  const [email, setEmail] = useState('devansh.sharma@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Devansh Sharma');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (!isLoginTab && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);

    try {
      let success = false;
      if (isLoginTab) {
        success = await login(email, password, name);
      } else {
        success = await signup(name, email, password);
      }

      setIsLoading(false);

      if (success) {
        showToast(`Welcome back, ${name.split(' ')[0]}!`, 'success');
        navigate('/dashboard');
      } else {
        setError('Authentication failed. Please check your details.');
      }
    } catch {
      setIsLoading(false);
      setError('An error occurred during authentication.');
    }
  };

  const handleOAuth = async (provider: string) => {
    await login(email, 'oauth_pass', name);
    showToast(`Signed in with ${provider}`, 'success');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F7F9FC]">
      {/* Left Visual AI Hero Panel (Dark Navy & Purple - matching reference) */}
      <div className="lg:w-1/2 bg-[#071A33] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">
              SkillCraft AI
            </h1>
            <p className="text-xs text-indigo-300 font-medium tracking-wide mt-1">
              Practice. Improve. Get Hired.
            </p>
          </div>
        </div>

        {/* Hero Value Proposition */}
        <div className="relative z-10 my-12 space-y-6 max-w-lg">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Your personal AI-powered <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
              interview preparation partner.
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Practice real interviews, get instant AI feedback, and build the confidence to land your dream job with personalized technical & behavioral mock sessions.
          </p>

          {/* 4 Benefit Pills (as in reference image) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              'Practice Real Interviews',
              'Get AI Feedback',
              'Build Your Confidence',
              'Land Your Dream Job'
            ].map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-white shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* Isometric AI Character Illustration Card */}
          <div className="pt-4 relative">
            <div className="relative mx-auto max-w-sm rounded-2xl bg-gradient-to-tr from-slate-900/90 to-indigo-950/90 p-3.5 border border-indigo-500/30 shadow-2xl backdrop-blur-md overflow-hidden">
              <div className="rounded-xl overflow-hidden mb-3 border border-indigo-500/20 shadow-inner">
                <img
                  src="/images/auth-hero.jpg"
                  alt="SkillCraft AI Interview Coaching"
                  className="w-full h-36 object-cover object-center transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[11px] font-mono text-indigo-300 flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5" /> SkillCraft AI Simulation
                </span>
              </div>
              <div className="py-2.5 space-y-1.5 text-[11px] font-mono">
                <div className="p-2 rounded-lg bg-indigo-900/40 border border-indigo-500/20 text-indigo-200">
                  <span className="text-indigo-400 font-bold">AI:</span> "Explain how you optimize SQL queries using B-Tree indexing."
                </div>
                <div className="p-2 rounded-lg bg-emerald-900/30 border border-emerald-500/20 text-emerald-200">
                  <span className="text-emerald-400 font-bold">Candidate:</span> "By leveraging covering indexes to prevent random I/O lookups..."
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>Enterprise-grade security • Powered by Azure AI & Foundry</span>
        </div>
      </div>

      {/* Right Login/Signup Card Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100">
          {/* Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl mb-8">
            <button
              type="button"
              onClick={() => {
                setIsLoginTab(true);
                setError('');
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                isLoginTab
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLoginTab(false);
                setError('');
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                !isLoginTab
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isLoginTab ? 'Welcome Back, Devansh Sharma!' : 'Create an Account'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isLoginTab
                ? 'Sign in to continue your interview journey.'
                : 'Join thousands of candidates preparing with AI.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginTab && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Devansh Sharma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="devansh.sharma@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                {isLoginTab && (
                  <button
                    type="button"
                    onClick={() => showToast('Password reset link sent to email', 'info')}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>
            </div>

            {isLoginTab && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="rememberMe" className="ml-2 text-xs font-medium text-slate-600">
                  Remember me for 30 days
                </label>
              </div>
            )}

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              isLoading={isLoading}
              className="w-full font-bold"
            >
              {isLoginTab ? 'Sign In' : 'Create Free Account'}
            </Button>
          </form>

          {/* Social Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative px-3 bg-white text-[11px] font-bold tracking-wider uppercase text-slate-400">
              Or continue with
            </span>
          </div>

          {/* Social OAuth Buttons */}
          <div>
            <button
              type="button"
              onClick={() => handleOAuth('Google')}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-bold text-slate-700 shadow-xs"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            {isLoginTab ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setIsLoginTab(!isLoginTab)}
              className="font-bold text-indigo-600 hover:underline"
            >
              {isLoginTab ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

