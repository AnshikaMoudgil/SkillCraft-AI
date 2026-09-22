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
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Zap,
  Code2,
  Mic
} from 'lucide-react';

export const Login: React.FC = () => {
  const location = useLocation();
  const [isLoginTab, setIsLoginTab] = useState(location.pathname !== '/signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedName = name.trim();

    if (!trimmedEmail || !trimmedPassword || (!isLoginTab && !trimmedName)) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);

    try {
      let success = false;
      if (isLoginTab) {
        success = await login(trimmedEmail, trimmedPassword, trimmedName || undefined);
      } else {
        success = await signup(trimmedName, trimmedEmail, trimmedPassword);
      }

      setIsLoading(false);

      if (success) {
        const greetingName = trimmedName || trimmedEmail.split('@')[0];
        showToast(`Welcome to SkillCraft AI, ${greetingName}!`, 'success');
        navigate('/dashboard');
      } else {
        setError('Authentication failed. Please check your email and password.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || 'An error occurred during authentication. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F7F9FC]">
      {/* Left Visual AI Hero Panel */}
      <div className="lg:w-1/2 bg-[#061325] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#4F46E5] via-[#6366F1] to-[#9333EA] flex items-center justify-center text-white shadow-xl shadow-indigo-600/35 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white leading-none">
              SkillCraft AI
            </h1>
            <p className="text-xs text-indigo-300/90 font-medium tracking-wide mt-1">
              Practice. Improve. Get Hired.
            </p>
          </div>
        </div>

        {/* Hero Value Proposition */}
        <div className="relative z-10 my-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/25 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>AI-Driven Mock Interviews & Coding Sandbox</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            Master technical interviews with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300">
              real-time AI feedback.
            </span>
          </h2>

          <p className="text-slate-300/90 text-sm sm:text-base leading-relaxed">
            Prepare, practice, and excel in coding, system design, and behavioral interviews with tailored Microsoft Foundry AI agents and speech intelligence.
          </p>

          {/* Benefit Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { label: 'Live Coding IDE with Big-O Audits', icon: Code2 },
              { label: 'Neural Voice & Speech Interviews', icon: Mic },
              { label: 'Contextual Resume RAG Grounding', icon: CheckCircle2 },
              { label: 'Tailored Step-by-Step Learning Plans', icon: Bot }
            ].map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.label}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/[0.07] backdrop-blur-md border border-white/10 text-xs font-medium text-slate-200 shadow-sm hover:bg-white/[0.12] transition-colors"
                >
                  <Icon className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="truncate">{benefit.label}</span>
                </div>
              );
            })}
          </div>

          {/* Simulation Preview Card */}
          <div className="pt-2 relative">
            <div className="relative rounded-2xl bg-gradient-to-tr from-slate-900/95 to-[#0b1b36]/95 p-4 border border-indigo-500/25 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[11px] font-mono text-indigo-300 flex items-center gap-1.5 font-medium">
                  <Bot className="w-3.5 h-3.5 text-indigo-400" /> Foundry Agent Session
                </span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-500/20 text-indigo-200/90 leading-relaxed">
                  <span className="text-indigo-400 font-bold">Interviewer:</span> &ldquo;How would you structure a distributed rate limiter for millions of concurrent requests?&rdquo;
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/20 text-emerald-200/90 leading-relaxed">
                  <span className="text-emerald-400 font-bold">Candidate:</span> &ldquo;I would leverage Redis with Token Bucket / Sliding Window Log to ensure atomic increments...&rdquo;
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-400 flex items-center gap-2 pt-4 border-t border-white/10">
          <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Enterprise-Grade Security &bull; Powered by Microsoft Foundry &amp; Azure AI</span>
        </div>
      </div>

      {/* Right Login/Signup Card Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl shadow-slate-200/60 border border-slate-100">
          {/* Tab Switcher */}
          <div className="flex items-center p-1.5 bg-slate-100/90 rounded-2xl mb-8">
            <button
              type="button"
              onClick={() => {
                setIsLoginTab(true);
                setError('');
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 ${
                isLoginTab
                  ? 'bg-white text-indigo-600 shadow-md shadow-slate-200/50'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLoginTab(false);
                setError('');
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 ${
                !isLoginTab
                  ? 'bg-white text-indigo-600 shadow-md shadow-slate-200/50'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isLoginTab ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
              {isLoginTab
                ? 'Sign in to access your interview practice sessions and score history.'
                : 'Start your AI interview preparation journey today.'}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium animate-in fade-in duration-200 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>{error}</span>
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
                    placeholder="e.g. Alex Morgan"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
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
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
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
                    onClick={() => showToast('Password reset instructions will be sent to your email.', 'info')}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isLoginTab && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500/30"
                  />
                  <span className="text-xs font-medium text-slate-600">
                    Remember me on this device
                  </span>
                </label>
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                isLoading={isLoading}
                className="w-full font-bold shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                <span>{isLoginTab ? 'Sign In to SkillCraft' : 'Create Free Account'}</span>
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6 pt-5 border-t border-slate-100">
            {isLoginTab ? "Don't have an account yet? " : 'Already registered? '}
            <button
              type="button"
              onClick={() => {
                setIsLoginTab(!isLoginTab);
                setError('');
              }}
              className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              {isLoginTab ? 'Sign up here' : 'Sign in here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;
