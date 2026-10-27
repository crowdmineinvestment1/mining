import React, { useState } from 'react';
import { User, DepositRequest, WithdrawalRequest } from '../types';
import {
  getUserBalance,
  getAllDeposits,
  getAllWithdrawals,
  saveAllUsers,
  getAllUsers,
  setCurrentUser
} from '../services/cloudSync';

interface DashboardPageProps {
  currentUser: User;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentUser,
  onNavigate,
  onLogout,
  onUpdateUser
}) => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'transactions' | 'settings'>('portfolio');
  const [chartTimeframe, setChartTimeframe] = useState<'1W' | '1M' | '3M' | '1Y'>('1W');
  const [nameInput, setNameInput] = useState(currentUser.name);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Fetch live balance
  const balance = getUserBalance(currentUser.email);
  const formattedBalance = '$' + balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Get user transactions
  const deposits = getAllDeposits().filter(d => d.email.toLowerCase() === currentUser.email.toLowerCase());
  const withdrawals = getAllWithdrawals().filter(w => w.email.toLowerCase() === currentUser.email.toLowerCase());

  interface CombinedTx {
    id: string;
    type: 'Deposit' | 'Withdrawal';
    title: string;
    amount: number;
    date: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    timestamp: number;
    isPositive: boolean;
  }

  const allTxs: CombinedTx[] = [
    ...deposits.map(d => ({
      id: d.id,
      type: 'Deposit' as const,
      title: d.method === 'Direct Credit' ? 'Direct Credit Payout' : `${d.method} Mining Deposit`,
      amount: d.amount,
      date: d.date,
      status: d.status,
      timestamp: new Date(d.date).getTime() || 0,
      isPositive: true
    })),
    ...withdrawals.map(w => ({
      id: w.id,
      type: 'Withdrawal' as const,
      title: `Bank Withdrawal (${w.bank})`,
      amount: typeof w.amount === 'number' ? w.amount : parseFloat(w.amount as string) || 0,
      date: w.date,
      status: w.status,
      timestamp: new Date(w.date).getTime() || 0,
      isPositive: false
    }))
  ].sort((a, b) => b.timestamp - a.timestamp);

  // Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = currentUser.name.split(' ')[0] || 'Investor';

  const tier = balance >= 100000 ? 'Gold' : balance >= 10000 ? 'Silver' : 'Standard';
  const pnl = balance * 0.005;

  // Handle avatar upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const updated = { ...currentUser, profilePic: base64 };
        const users = getAllUsers();
        const idx = users.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
        if (idx >= 0) {
          users[idx].profilePic = base64;
          saveAllUsers(users);
        }
        setCurrentUser(updated);
        onUpdateUser(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle name update
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    const updated = { ...currentUser, name: nameInput.trim() };
    const users = getAllUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
    if (idx >= 0) {
      users[idx].name = nameInput.trim();
      saveAllUsers(users);
    }
    setCurrentUser(updated);
    onUpdateUser(updated);
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 4000);
  };

  const getInitials = (n: string) => {
    const parts = n.trim().split(' ');
    return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  return (
    <div className="min-h-screen bg-slate-50 relative z-10">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sticky top-[72px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-700 to-amber-500 p-0.5 shadow">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-white overflow-hidden text-sm font-bold">
                {currentUser.profilePic ? (
                  <img src={currentUser.profilePic} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{getInitials(currentUser.name)}</span>
                )}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-heading leading-tight">
                {greeting}, {firstName}!
              </h2>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span>{currentUser.email}</span>
                <span className="text-slate-300">·</span>
                <span className="text-blue-700 font-semibold">{tier} Miner Tier</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate('deposit')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fas fa-plus"></i>
              <span>Deposit Funds</span>
            </button>
            <button
              onClick={() => onNavigate('withdraw')}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-300 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fas fa-money-bill-transfer text-blue-600"></i>
              <span>Withdraw</span>
            </button>
            <button
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="Logout"
            >
              <i className="fas fa-right-from-bracket"></i>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs Bar */}
        <div className="max-w-7xl mx-auto flex items-center gap-1 mt-4 pt-3 border-t border-slate-100 overflow-x-auto">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'portfolio'
                ? 'bg-blue-50 text-blue-700 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <i className="fas fa-chart-pie"></i>
            <span>Mining Portfolio</span>
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'transactions'
                ? 'bg-blue-50 text-blue-700 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <i className="fas fa-arrow-right-arrow-left"></i>
            <span>Transaction History ({allTxs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-blue-50 text-blue-700 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <i className="fas fa-gear"></i>
            <span>Account Settings</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* ================= PORTFOLIO TAB ================= */}
        {activeTab === 'portfolio' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Balance</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm">
                    <i className="fas fa-wallet"></i>
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                  {formattedBalance}
                </div>
                <div className="mt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <i className="fas fa-arrow-trend-up"></i>
                  <span>Active Mining Escrow</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Today's Mining Yield</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm">
                    <i className="fas fa-arrow-trend-up"></i>
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-heading">
                  {balance > 0 ? `+$${pnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00'}
                </div>
                <div className="mt-2 text-xs font-semibold text-slate-500">
                  {balance > 0 ? '+0.5% 24h Yield Rate' : 'Deposit to activate yields'}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Hashrate</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-sm">
                    <i className="fas fa-server"></i>
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                  {balance > 0 ? '142.5 TH/s' : '0.0 TH/s'}
                </div>
                <div className="mt-2 text-xs font-semibold text-slate-500">
                  {balance > 0 ? '4 Active Rigs Operational' : 'Zero hardware online'}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Account Tier</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-sm">
                    <i className="fas fa-star"></i>
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                  {tier}
                </div>
                <div className="mt-2 text-xs font-semibold text-slate-500">
                  Withdrawal Fee: ${currentUser.withdrawalFee !== undefined ? currentUser.withdrawalFee.toLocaleString() : '5,000'}
                </div>
              </div>
            </div>

            {/* If balance is 0, show empty state prompt */}
            {balance <= 0 ? (
              <div className="bg-white rounded-3xl p-10 sm:p-14 border border-slate-200 text-center max-w-2xl mx-auto shadow-sm">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl mb-4">
                  <i className="fas fa-cubes-stacked"></i>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-heading mb-2">
                  No Active Mining Rigs Yet
                </h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
                  Your current balance is $0.00. Make a cryptocurrency deposit to deploy your dedicated cloud hashrate and start receiving automated daily payouts.
                </p>
                <button
                  onClick={() => onNavigate('deposit')}
                  className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <i className="fas fa-plus"></i>
                  <span>Make Your First Deposit</span>
                </button>
              </div>
            ) : (
              /* Funded State: Chart + Holdings */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Performance Chart Card */}
                <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-heading">
                        Hashrate & Yield Performance
                      </h3>
                      <p className="text-xs text-slate-500">Cumulative satoshi yield & asset valuation</p>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                      {(['1W', '1M', '3M', '1Y'] as const).map(tf => (
                        <button
                          key={tf}
                          onClick={() => setChartTimeframe(tf)}
                          className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                            chartTimeframe === tf
                              ? 'bg-white text-blue-700 shadow-sm'
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-60 w-full rounded-2xl bg-gradient-to-b from-blue-50/50 to-transparent p-4 border border-slate-100 flex items-end">
                    <svg viewBox="0 0 600 200" preserveAspectRatio="none" className="w-full h-full">
                      <defs>
                        <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,160 C40,150 80,140 120,120 S200,80 260,90 S350,60 420,50 S510,70 560,40 S590,30 600,20"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M0,160 C40,150 80,140 120,120 S200,80 260,90 S350,60 420,50 S510,70 560,40 S590,30 600,20 V200 H0Z"
                        fill="url(#dashGrad)"
                      />
                    </svg>
                  </div>
                </div>

                {/* Active Mining Holdings */}
                <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-slate-900 font-heading">
                      Allocated Mining Rigs
                    </h3>
                    <button
                      onClick={() => onNavigate('markets')}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-base">
                          <i className="fab fa-bitcoin"></i>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">Bitcoin Antminer S21</div>
                          <div className="text-xs text-slate-500">45% Allocation · 80 TH/s</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-900">
                          ${(balance * 0.45).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs font-semibold text-emerald-600">+2.4% Yield</div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-base">
                          <i className="fab fa-ethereum"></i>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">Ethereum Staking Pool</div>
                          <div className="text-xs text-slate-500">25% Allocation · 32 TH/s</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-900">
                          ${(balance * 0.25).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs font-semibold text-emerald-600">+1.8% Yield</div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-base">
                          <i className="fas fa-coins"></i>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">Kaspa / Doge AuxPoW</div>
                          <div className="text-xs text-slate-500">18% Allocation · 20 TH/s</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-900">
                          ${(balance * 0.18).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs font-semibold text-emerald-600">+5.6% Yield</div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-base">
                          <i className="fas fa-bolt"></i>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">Solana Validator Node</div>
                          <div className="text-xs text-slate-500">12% Allocation · High Yield</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-900">
                          ${(balance * 0.12).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs font-semibold text-emerald-600">+4.1% Yield</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Transactions Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  Recent Mining Transactions
                </h3>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  View All History ({allTxs.length})
                </button>
              </div>

              {allTxs.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  <i className="fas fa-receipt text-3xl mb-2 text-slate-300 block"></i>
                  No transactions recorded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {allTxs.slice(0, 5).map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3.5 bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-2xl flex items-center justify-between border border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                          tx.isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          <i className={`fas fa-${tx.isPositive ? 'plus' : 'minus'}`}></i>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <span>{tx.title}</span>
                            {tx.status === 'Pending' && (
                              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Pending
                              </span>
                            )}
                            {tx.status === 'Approved' && (
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Confirmed
                              </span>
                            )}
                            {tx.status === 'Rejected' && (
                              <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Declined
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400">{tx.date}</div>
                        </div>
                      </div>
                      <div className={`text-base font-extrabold font-heading ${
                        tx.isPositive ? 'text-emerald-600' : 'text-slate-900'
                      }`}>
                        {tx.isPositive ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TRANSACTIONS TAB ================= */}
        {activeTab === 'transactions' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-heading">
                  Complete Transaction History
                </h3>
                <p className="text-xs text-slate-500">Record of all deposits, mining credits, and withdrawals</p>
              </div>
            </div>

            {allTxs.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <i className="fas fa-receipt text-4xl mb-3 text-slate-300 block"></i>
                <p className="text-base font-semibold text-slate-700">No Transactions Found</p>
                <p className="text-xs text-slate-500 mt-1">Make a deposit to fund your mining portfolio.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Method / Destination</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {allTxs.map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${tx.isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          <span>{tx.type}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">{tx.title}</td>
                        <td className={`py-3.5 px-4 font-bold font-heading ${tx.isPositive ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {tx.isPositive ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                            tx.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : tx.status === 'Rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-500">{tx.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= SETTINGS TAB ================= */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fadeIn">
            {/* Profile Avatar Card */}
            <div className="md:col-span-5 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
              <h3 className="text-lg font-bold text-slate-900 font-heading mb-6">Profile Picture</h3>
              <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-tr from-blue-700 to-amber-500 p-1 shadow-lg mb-5">
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-white overflow-hidden text-2xl font-black">
                  {currentUser.profilePic ? (
                    <img src={currentUser.profilePic} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{getInitials(currentUser.name)}</span>
                  )}
                </div>
              </div>

              <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold rounded-xl cursor-pointer transition-colors">
                <i className="fas fa-camera"></i>
                <span>Upload New Avatar</span>
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
              <p className="text-[11px] text-slate-400 mt-2">JPG, PNG or GIF up to 5MB</p>
            </div>

            {/* Account Info Form */}
            <div className="md:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 font-heading mb-6">Personal Details</h3>

              {settingsSuccess && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-semibold flex items-center gap-2">
                  <i className="fas fa-check-circle text-emerald-600"></i>
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    readOnly
                    value={currentUser.email}
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Contact support to update your registered email.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Member Since
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={currentUser.joined || 'May 2026'}
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
