import React, { useState } from 'react';
import { User } from '../types';
import { Radio, Wallet, Zap, Activity, HardDrive, Layers, BarChart3, Plus, ArrowDownRight, Menu, X, LogOut, LogIn, UserPlus, Info, Mail, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  balanceUSD: number;
  totalHashrate: string;
  unit: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onNavigate,
  currentUser,
  onLogout,
  balanceUSD,
  totalHashrate,
  unit
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tickerCoins = [
    { symbol: 'BTC', name: 'Bitcoin', price: '$68,420.50', change: '+2.41%', up: true, hashrate: '652 EH/s' },
    { symbol: 'ETC', name: 'Ethereum Classic', price: '$28.40', change: '+1.82%', up: true, hashrate: '980 TH/s' },
    { symbol: 'KAS', name: 'Kaspa', price: '$0.175', change: '+12.4%', up: true, hashrate: '240 PH/s' },
    { symbol: 'SOL', name: 'Solana', price: '$178.40', change: '+4.12%', up: true, hashrate: 'High Yield' },
    { symbol: 'LTC', name: 'Litecoin', price: '$84.10', change: '+1.85%', up: true, hashrate: '950 TH/s' },
    { symbol: 'DOGE', name: 'Dogecoin', price: '$0.142', change: '+5.80%', up: true, hashrate: '1.2 PH/s' },
    { symbol: 'XMR', name: 'Monero', price: '$165.80', change: '+0.78%', up: true, hashrate: 'RandomX' },
  ];

  const handleNav = (tab: string) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Live Hashrate Ticker Stream */}
      <div className="ticker-banner w-full text-slate-300 text-xs select-none">
        <div className="flex items-center w-full px-4 overflow-hidden">
          <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] tracking-wider px-2 py-0.5 rounded flex-shrink-0 uppercase mr-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            CLUSTER POOL
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="ticker-items">
              {[...tickerCoins, ...tickerCoins].map((c, i) => (
                <div key={i} className="inline-flex items-center gap-2 text-xs font-mono text-slate-300">
                  <span className="font-bold text-slate-100">{c.symbol}</span>
                  <span className="text-slate-400">{c.price}</span>
                  <span className={`text-[11px] font-semibold ${c.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {c.up ? '▲' : '▼'} {c.change}
                  </span>
                  <span className="text-[10px] text-cyan-400/90 bg-cyan-950/60 border border-cyan-800/40 px-1.5 py-0.2 rounded">
                    {c.hashrate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleNav(currentUser ? 'dashboard' : 'landing')}
            className="flex items-center space-x-3 text-left border-none bg-transparent cursor-pointer group"
          >
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 group-hover:border-emerald-400/60 transition-colors">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg lg:text-xl font-bold tracking-wider bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent font-heading">
                  CROWDMINE INVESTING
                </h1>
                <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  ENTERPRISE HASH
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                Autonomous Cloud Mining & Hashrate Deployment Infrastructure
              </p>
            </div>
          </button>
        </div>

        {/* Global Wallet Summary Pill */}
        <div className="hidden md:flex items-center space-x-3 bg-slate-950/90 border border-slate-800 rounded-2xl p-1.5 px-4 shadow-inner">
          <div className="flex items-center space-x-2">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-400 font-mono">Fiat Cash:</span>
            <span className="font-mono text-emerald-400 font-bold">
              ${balanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-400 font-mono">Hash Rate:</span>
            <span className="font-mono text-cyan-400 font-bold">
              {totalHashrate} {unit}
            </span>
          </div>
          
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => handleNav('deposit')}
              className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 font-mono font-bold text-xs rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Deposit</span>
            </button>
            <button
              onClick={() => handleNav('withdraw')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono font-semibold text-xs rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>Withdraw</span>
            </button>
          </div>
        </div>

        {/* User Session Info / Auth Buttons */}
        <div className="hidden lg:flex items-center space-x-3">
          {currentUser ? (
            <div className="flex items-center space-x-3 bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-1.5">
              <div className="text-right">
                <div className="text-xs font-bold text-slate-200 font-mono">{currentUser.name}</div>
                <div className="text-[10px] text-emerald-400 font-mono">{currentUser.email}</div>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleNav('login')}
                className="px-3.5 py-1.5 text-xs font-semibold font-mono text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNav('register')}
                className="px-4 py-1.5 text-xs font-bold font-mono bg-emerald-500 text-slate-950 hover:bg-emerald-400 rounded-lg shadow-md transition-all cursor-pointer"
              >
                Open Account
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex lg:hidden items-center space-x-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 rounded-xl cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Primary Navigation Tabs */}
      <nav className="bg-slate-900/60 border-b border-slate-800 px-4 lg:px-8 flex overflow-x-auto scrollbar-none sticky top-[57px] z-40 backdrop-blur">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: Activity },
          { id: 'explainer', label: '3D Explainer', icon: Sparkles },
          { id: 'rigs', label: 'Hardware & Rig Shop', icon: HardDrive },
          { id: 'pools', label: 'Pools & Strategy', icon: Layers },
          { id: 'wallet', label: 'Wallet & Yield', icon: Wallet },
          { id: 'market', label: 'Market Analytics', icon: BarChart3 },
          { id: 'deposit', label: 'Deposit', icon: Plus },
          { id: 'withdraw', label: 'Withdraw', icon: ArrowDownRight },
          { id: 'about', label: 'About Us', icon: Info },
          { id: 'contact', label: 'Contact', icon: Mail }
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleNav(tab.id)}
              className={`flex items-center space-x-2 py-3 px-4 sm:px-5 border-b-2 font-mono text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                active 
                  ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5' 
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-3 z-50">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center font-mono">
            <div>
              <div className="text-[10px] text-slate-400">Total Balance:</div>
              <div className="text-emerald-400 font-bold">${balanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Cluster Hashrate:</div>
              <div className="text-cyan-400 font-bold">{totalHashrate} {unit}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNav('deposit')}
              className="py-2.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Deposit Funds
            </button>
            <button
              onClick={() => handleNav('withdraw')}
              className="py-2.5 bg-slate-800 text-slate-200 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5"
            >
              <ArrowDownRight className="w-3.5 h-3.5" /> Withdraw
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            {currentUser ? (
              <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-xs font-mono text-slate-300 font-bold">{currentUser.name}</span>
                <button
                  onClick={onLogout}
                  className="text-xs font-mono text-rose-400 hover:text-rose-300"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="py-2 bg-slate-800 text-slate-200 rounded-xl text-xs font-mono font-semibold"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="py-2 bg-emerald-500 text-slate-950 rounded-xl text-xs font-mono font-bold"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
