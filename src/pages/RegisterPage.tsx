import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { getAllUsers, saveAllUsers, setCurrentUser, getCurrentUser } from '../services/cloudSync';
import { UserPlus, User as UserIcon, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';

interface RegisterPageProps {
  onRegisterSuccess: (user: User) => void;
  onNavigate: (page: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess, onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false);

  useEffect(() => {
    const existing = getCurrentUser();
    if (existing) {
      setAlreadyLoggedIn(true);
      onRegisterSuccess(existing);
    }
  }, [onRegisterSuccess]);

  if (alreadyLoggedIn) {
    return (
      <div className="py-24 px-4 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] font-mono animate-fade-in text-center">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 shadow-lg shadow-cyan-500/10">
          <CheckCircle2 className="w-8 h-8 animate-pulse" />
        </div>
        <h2 className="text-xl font-bold text-slate-100 font-heading mb-2">Account Already Registered</h2>
        <p className="text-xs text-slate-400 max-w-sm mb-6">
          Your CrowdMine investor profile is already active on this terminal.
        </p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-lg shadow-cyan-500/20 flex items-center gap-2"
        >
          <span>Return to Mining Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const getPasswordStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getPasswordStrength();
  const strengthColors = ['bg-slate-800', 'bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password || !confirmPassword) {
      setError('Please complete all security fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setError('You must accept the Cloud Mining Terms of Service.');
      return;
    }

    setLoading(true);

    const users = getAllUsers();
    if (users.some(u => u && u.email && u.email.toLowerCase() === cleanEmail)) {
      setLoading(false);
      setError('An account with this email address already exists. Please sign in.');
      return;
    }

    const newUser: User = {
      name: cleanName,
      email: cleanEmail,
      password: password,
      balance: 0,
      withdrawalFee: 5000,
      joined: new Date().toLocaleDateString('en-US'),
      hashrate: '0.0 TH/s'
    };

    users.push(newUser);
    saveAllUsers(users);
    setCurrentUser(newUser);

    setLoading(false);
    onRegisterSuccess(newUser);
  };

  return (
    <div className="py-16 px-4 flex items-center justify-center min-h-[calc(100vh-200px)] font-mono animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 sm:p-10 rounded-2xl shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center text-xl mb-3">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-100 font-heading">
            Deploy Investor Account
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Join 50,000+ miners earning daily cryptographic yields
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">
              Full Legal Name
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:border-cyan-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:border-cyan-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">
              Master Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:border-cyan-500 outline-none font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {password.length > 0 && (
              <div className="mt-2">
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden flex gap-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-full flex-1 transition-all ${
                        strength >= step ? strengthColors[strength] : 'bg-transparent'
                      }`}
                    ></div>
                  ))}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                  <span>Entropy Level:</span>
                  <span className="text-slate-300 font-bold">{strengthLabels[strength]}</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:border-cyan-500 outline-none font-sans"
              />
            </div>
          </div>

          <div className="flex items-start gap-2 pt-1 text-xs text-slate-400">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 accent-emerald-500 cursor-pointer"
            />
            <label htmlFor="terms" className="leading-tight cursor-pointer">
              I agree to the CrowdMine Cloud Mining Service Agreement and AML protocol disclosures.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span>Deploying Account...</span>
            ) : (
              <>
                <span>Register Mining Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Already registered?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-cyan-400 font-bold hover:underline cursor-pointer"
            >
              Sign In here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
