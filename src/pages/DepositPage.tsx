import React, { useState } from 'react';
import { User, DepositRequest } from '../types';
import {
  getUserBalance,
  getWalletAddresses,
  getAllDeposits,
  saveDeposits,
  generateTxId
} from '../services/cloudSync';
import { ArrowLeft, Check, Copy, DollarSign, Plus, ShieldCheck, AlertTriangle } from 'lucide-react';

interface DepositPageProps {
  currentUser: User;
  onNavigate: (page: string) => void;
  balanceUSD: number;
}

export const DepositPage: React.FC<DepositPageProps> = ({ currentUser, onNavigate, balanceUSD }) => {
  const [selectedCoin, setSelectedCoin] = useState<string>('Bitcoin (BTC)');
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addresses = getWalletAddresses();

  const getActiveAddress = () => {
    if (selectedCoin.includes('BTC') || selectedCoin.includes('Bitcoin')) return addresses.btc;
    if (selectedCoin.includes('ETH') || selectedCoin.includes('Ethereum')) return addresses.eth;
    if (selectedCoin.includes('SOL') || selectedCoin.includes('Solana')) return addresses.sol;
    if (selectedCoin.includes('USDT') || selectedCoin.includes('Tether')) return addresses.usdt;
    if (selectedCoin.includes('BNB') || selectedCoin.includes('Binance')) return addresses.bnb;
    return addresses.btc;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveAddress());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amt = parseFloat(depositAmount);
    if (!amt || isNaN(amt) || amt < 10) {
      setError('Please enter a valid deposit amount (minimum $10.00 USD).');
      return;
    }

    const allDeposits = getAllDeposits();
    const newDeposit: DepositRequest = {
      id: generateTxId(),
      email: currentUser.email,
      name: currentUser.name,
      method: selectedCoin,
      amount: amt,
      status: 'Pending',
      date: new Date().toLocaleDateString('en-US')
    };

    allDeposits.push(newDeposit);
    saveDeposits(allDeposits);

    setSuccess(true);
    setDepositAmount('');
    setTimeout(() => setSuccess(false), 6000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> SECURE HASH DEPOSIT GATEWAY
          </span>
          <h2 className="text-xl font-bold font-heading text-slate-100 mt-1">
            Deposit Crypto Mining Funds
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Credit your enterprise account to acquire new rigs, power cloud contracts, and scale hashrate.
          </p>
        </div>
        <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 text-right">
          <div className="text-[10px] text-slate-500 font-mono uppercase">Current Balance</div>
          <div className="text-xl font-mono font-bold text-emerald-400">
            ${balanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Main Deposit Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-2">
            1. Select Transfer Currency
          </label>
          <select
            value={selectedCoin}
            onChange={(e) => setSelectedCoin(e.target.value)}
            className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-slate-100 focus:border-emerald-500 outline-none transition-all cursor-pointer"
          >
            <option>Bitcoin (BTC)</option>
            <option>Ethereum (ETH)</option>
            <option>Solana (SOL)</option>
            <option>Tether (USDT - ERC20)</option>
            <option>Binance Coin (BNB)</option>
          </select>
        </div>

        {/* Assigned Wallet Address Box */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-2">
            2. Send To Assigned Deposit Address
          </label>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
            <code className="text-emerald-400 font-mono text-xs sm:text-sm break-all font-semibold">
              {getActiveAddress()}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs rounded-lg transition-all cursor-pointer flex-shrink-0 flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy Address'}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Send only {selectedCoin} to this address. Cross-chain sends are not recoverable.</span>
          </p>
        </div>

        {/* Deposit Notice Form */}
        <form onSubmit={handleSubmit} className="pt-6 border-t border-slate-800 space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-2">
              3. Amount Deposited (USD Equivalent)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-slate-500 font-mono font-bold">$</span>
              <input
                type="number"
                step="0.01"
                min="10"
                required
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="e.g. 500.00"
                className="w-full pl-8 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-slate-100 font-bold focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-1">Minimum deposit threshold: $10.00 USD</p>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 font-mono text-xs">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 font-mono text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Deposit notice logged! Operations desk will confirm blockchain transaction and credit your balance shortly.</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Deposit Notice</span>
          </button>
        </form>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={() => onNavigate('dashboard')}
          className="text-xs font-mono text-slate-400 hover:text-emerald-400 inline-flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Dashboard</span>
        </button>
      </div>
    </div>
  );
};
