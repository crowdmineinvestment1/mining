import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { getAllUsers, DEFAULT_PRESEEDED_USER, cloudFetch, getCurrentUser } from '../services/cloudSync';
import { LogIn, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, Info, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false);

  // Check if session already exists on mount and auto-route
  useEffect(() => {
    const existing = getCurrentUser();
    if (existing) {
      setAlreadyLoggedIn(true);
      onLogin(existing);
    }
  }, [onLogin]);

  if (alreadyLoggedIn) {
    return (
      <div className="py-24 px-4 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] font-mono animate-fade-in text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-8 h-8 animate-pulse" />
        </div>
        <h2 className="text-xl font-bold text-slate-100 font-heading mb-2">Authenticated Session Active</h2>
        <p className="text-xs text-slate-400 max-w-sm mb-6">
          Cryptographic token validated. Connecting to CrowdMine Autonomous Hash Core...
        </p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center gap-2"
        >
          <span>Open Mining Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please provide your registered email and password.');
      return;
    }

    setLoading(true);

    try {
      let foundUser: User | null = null;
      try {
        const cloudData = await cloudFetch();
        if (cloudData && Array.isArray(cloudData.ocio_users)) {
          foundUser = cloudData.ocio_users.find(
            (u: User) => u && u.email && u.email.toLowerCase() === cleanEmail
          );
        }
      } catch {}

      if (!foundUser) {
        const localUsers = getAllUsers();
        foundUser = localUsers.find(
          u => u && u.email && u.email.toLowerCase() === cleanEmail
        ) || null;
      }

      if (cleanEmail === DEFAULT_PRESEEDED_USER.email.toLowerCase() && cleanPassword === DEFAULT_PRESEEDED_USER.password) {
        const userToLogin = foundUser || DEFAULT_PRESEEDED_USER;
        onLogin(userToLogin);
        setLoading(false);
        return;
      }

      if (foundUser && foundUser.password === cleanPassword) {
        onLogin(foundUser);
        setLoading(false);
        return;
      }

      setLoading(false);
      setError('Invalid cryptographic credentials. Please verify your email and password.');
    } catch (err: any) {
      setLoading(false);
      setError('Network synchronization failure. Please verify connection.');
    }
  };

  return (
    <div className="py-16 px-4 flex items-center justify-center min-h-[calc(100vh-200px)] font-mono animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 sm:p-10 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-xl mb-3">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-100 font-heading">
            Authenticate to Cluster
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access your CrowdMine cloud hashrates and balances
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
            {error}
          </div>
        )}

        {infoMessage && (
          <div className="mb-6 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-300 text-xs flex items-start gap-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-cyan-400" />
            <span>{infoMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">
              Account Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@crowdmine.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold">
                Security Password
              </label>
              <button
                type="button"
                onClick={() => setInfoMessage('For security, password resets require manual cryptographic verification. Please reach out to operations at support@crowdmineinvesting.com or click the 24/7 AI Concierge.')}
                className="text-[11px] text-cyan-400 hover:underline cursor-pointer bg-transparent border-none p-0"
              >
                Forgot key?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:border-emerald-500 outline-none font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Mining Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Need an investor account?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-emerald-400 font-bold hover:underline cursor-pointer"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
