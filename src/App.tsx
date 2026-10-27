import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, Zap, HardDrive, Wallet, BarChart3, Radio, ArrowUpRight, ArrowDownRight,
  Play, Pause, RefreshCw, Layers, ShieldCheck, DollarSign, Activity, Settings,
  TrendingUp, Terminal, Award, ChevronRight, CheckCircle2, AlertTriangle, Plus, Sparkles, LogIn
} from 'lucide-react';
import { User } from './types';
import { 
  getCurrentUser, 
  setCurrentUser, 
  getUserBalance, 
  getAllUsers, 
  saveAllUsers, 
  cloudSyncFull 
} from './services/cloudSync';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MiningMachine3D } from './components/MiningMachine3D';
import { MiningExplainer3D } from './components/MiningExplainer3D';
import { AiCustomerSupport } from './components/AiCustomerSupport';
import { PublicLandingPage } from './pages/PublicLandingPage';
import { DepositPage } from './pages/DepositPage';
import { WithdrawPage } from './pages/WithdrawPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminPage } from './pages/AdminPage';

// --- INITIAL CONSTANTS & COIN DATA ---
const INITIAL_COINS = {
  BTC: { name: 'Bitcoin', symbol: 'BTC', price: 68420.00, change24h: 3.42, baseDiff: 83.1, unit: 'TH/s', reward: 3.125, color: '#f7931a' },
  ETC: { name: 'Ethereum Classic', symbol: 'ETC', price: 28.40, change24h: -1.15, baseDiff: 2.4, unit: 'MH/s', reward: 2.5, color: '#328332' },
  LTC: { name: 'Litecoin', symbol: 'LTC', price: 84.10, change24h: 1.85, baseDiff: 18.5, unit: 'MH/s', reward: 6.25, color: '#345d9d' },
  XMR: { name: 'Monero', symbol: 'XMR', price: 165.80, change24h: 0.78, baseDiff: 0.35, unit: 'KH/s', reward: 0.65, color: '#ff6600' },
  KAS: { name: 'Kaspa', symbol: 'KAS', price: 0.175, change24h: 12.4, baseDiff: 45.2, unit: 'GH/s', reward: 120, color: '#70c7ba' },
  DOGE: { name: 'Dogecoin', symbol: 'DOGE', price: 0.142, change24h: 5.8, baseDiff: 12.8, unit: 'MH/s', reward: 1000, color: '#c2a633' }
};

const INITIAL_RIGS = [
  { id: 'rig_1', name: 'Starter GPU Mini', type: 'GPU', hashMultiplier: 1.2, powerKw: 0.45, priceUSD: 450, owned: 1, maxCount: 10, icon: Cpu },
  { id: 'rig_2', name: 'Antminer S19 Pro', type: 'ASIC', hashMultiplier: 12.5, powerKw: 3.25, priceUSD: 3200, owned: 0, maxCount: 5, icon: HardDrive },
  { id: 'rig_3', name: 'RTX 4090 Hydro Rig', type: 'GPU Cluster', hashMultiplier: 28.0, powerKw: 4.80, priceUSD: 7800, owned: 0, maxCount: 3, icon: Zap },
  { id: 'rig_4', name: 'ASIC Hydro Container', type: 'Industrial', hashMultiplier: 95.0, powerKw: 18.50, priceUSD: 24500, owned: 0, maxCount: 2, icon: Activity }
];

const POOLS = [
  { id: 'solo', name: 'Solo Mining', feePct: 0, scheme: 'Solo', variance: 'Extreme', luck: 98.4 },
  { id: 'f2pool', name: 'F2Pool', feePct: 2.5, scheme: 'PPS+', variance: 'Low', luck: 101.2 },
  { id: 'slush', name: 'Braiins Pool', feePct: 2.0, scheme: 'FPPS', variance: 'Very Low', luck: 100.5 },
  { id: 'binance', name: 'Binance Mining Pool', feePct: 1.5, scheme: 'FPPS', variance: 'Low', luck: 99.8 }
];

export default function App() {
  // Navigation & User State
  const [activeTab, setActiveTab] = useState('landing');
  const [user, setUser] = useState<User | null>(null);
  const userRef = useRef<User | null>(null);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Mining Core State
  const [isMining, setIsMining] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState('BTC');
  const [selectedPool, setSelectedPool] = useState('f2pool');
  const [coins, setCoins] = useState(INITIAL_COINS);
  const [rigs, setRigs] = useState(INITIAL_RIGS);

  // Upgrade Modifiers
  const [coolingLevel, setCoolingLevel] = useState(1);
  const [powerEfficiencyLevel, setPowerEfficiencyLevel] = useState(1);
  const [aiTuningActive, setAiTuningActive] = useState(false);

  // Economic Metrics
  const [electricityRate, setElectricityRate] = useState(0.12);
  const [balanceUSD, setBalanceUSD] = useState(0);
  const [walletCrypto, setWalletCrypto] = useState<Record<string, number>>({
    BTC: 0.0184, ETC: 1.45, LTC: 0.0, XMR: 0.0, KAS: 0.0, DOGE: 0.0
  });

  // Staking State
  const [stakedBTC, setStakedBTC] = useState(0);

  // Logs & Stats
  const [terminalLogs, setTerminalLogs] = useState([
    { id: 1, text: 'Cluster initialized. CrowdMine Autonomous Hash Core online.', type: 'sys' },
    { id: 2, text: 'Network target difficulty verified @ 83.1G.', type: 'sys' },
    { id: 3, text: 'Immersion telemetry normal: 34.2°C ambient.', type: 'sys' }
  ]);
  const [txHistory, setTxHistory] = useState([
    { id: 'tx1', type: 'payout', amount: '0.0042 BTC', usdValue: '$287.36', time: '2 hours ago', txid: '0x8f3a...b41c' },
    { id: 'tx2', type: 'purchase', amount: 'Starter GPU Mini', usdValue: '-$450.00', time: '1 day ago', txid: '0x1c9b...99e2' }
  ]);

  // Sync user and balance from storage/cloud on boot
  useEffect(() => {
    const existing = getCurrentUser();
    if (existing) {
      userRef.current = existing;
      setUser(existing);
      setBalanceUSD(existing.balance || 0);
    }

    cloudSyncFull().then(() => {
      const refreshed = getCurrentUser();
      if (refreshed) {
        userRef.current = refreshed;
        setUser(refreshed);
        setBalanceUSD(refreshed.balance || 0);
      }
    });

    // Check URL Hash and Pathname for direct page navigation
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const pathname = window.location.pathname.replace(/^\//, '').toLowerCase();

    if (hash === 'admin' || pathname === 'admin') {
      setActiveTab('admin');
    } else if (existing) {
      // Authenticated users should never see login/register/landing
      if (hash && hash !== 'login' && hash !== 'register' && hash !== 'landing') {
        setActiveTab(hash);
      } else {
        setActiveTab('dashboard');
        try {
          window.history.replaceState(null, '', '/#dashboard');
        } catch {}
      }
    } else {
      // Unauthenticated users
      if (hash === 'login' || pathname === 'login') {
        setActiveTab('login');
      } else if (hash === 'register' || pathname === 'register') {
        setActiveTab('register');
      } else if (hash === 'about' || hash === 'contact') {
        setActiveTab(hash);
      } else {
        setActiveTab('landing');
      }
    }

    const handleHashChange = () => {
      const rawHash = window.location.hash.replace('#', '').toLowerCase();
      const rawPath = window.location.pathname.replace(/^\//, '').toLowerCase();
      const activeUser = userRef.current || getCurrentUser();

      if (rawHash === 'admin' || rawPath === 'admin') {
        setActiveTab('admin');
        return;
      }

      if (activeUser) {
        // Authenticated user should never be stuck on login or register
        if (rawHash === 'login' || rawHash === 'register' || rawPath === 'login' || rawPath === 'register') {
          setActiveTab('dashboard');
          try {
            window.history.replaceState(null, '', '/#dashboard');
          } catch {}
          return;
        }
      }

      const protectedTabs = ['dashboard', 'rigs', 'pools', 'wallet', 'deposit', 'withdraw'];
      if (rawHash) {
        if (protectedTabs.includes(rawHash) && !activeUser) {
          setActiveTab('login');
          try {
            window.history.replaceState(null, '', '/#login');
          } catch {}
          return;
        }
        setActiveTab(rawHash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const updatePersistedBalance = (newBalance: number) => {
    setBalanceUSD(newBalance);
    if (user) {
      const updated = { ...user, balance: newBalance };
      setUser(updated);
      setCurrentUser(updated);
      const allUsers = getAllUsers();
      const idx = allUsers.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
      if (idx >= 0) {
        allUsers[idx].balance = newBalance;
        saveAllUsers(allUsers);
      }
    }
  };

  // Performance calculations
  const baseHash = rigs.reduce((acc, rig) => acc + (rig.owned * rig.hashMultiplier), 0);
  const aiBonus = aiTuningActive ? 1.15 : 1.0;
  const coolingBonus = 1 + (coolingLevel - 1) * 0.05;
  const totalHashrate = Math.max(0.1, baseHash * aiBonus * coolingBonus).toFixed(2);

  const rawPowerKw = rigs.reduce((acc, rig) => acc + (rig.owned * rig.powerKw), 0);
  const powerEfficiencyDiscount = 1 - (powerEfficiencyLevel - 1) * 0.08;
  const totalPowerKw = Math.max(0, rawPowerKw * powerEfficiencyDiscount).toFixed(2);
  const hourlyElectricityCost = (parseFloat(totalPowerKw) * electricityRate);
  const dailyElectricityCost = hourlyElectricityCost * 24;

  // Real-time Mining Loop Simulation (runs when logged in and active)
  useEffect(() => {
    if (!isMining || !user) return;

    const interval = setInterval(() => {
      const coin = coins[selectedCoin as keyof typeof coins];
      const pool = POOLS.find(p => p.id === selectedPool) || POOLS[1];

      const hashPowerCoeff = parseFloat(totalHashrate) * 0.0000008;
      const feeDeduction = 1 - (pool.feePct / 100);
      const minedAmount = (hashPowerCoeff * feeDeduction) / Math.sqrt(coin.baseDiff);

      const tickElectricityCost = (hourlyElectricityCost / 3600) * 1.5;

      setWalletCrypto(prev => ({
        ...prev,
        [selectedCoin]: (prev[selectedCoin] || 0) + minedAmount
      }));

      setBalanceUSD(prev => Math.max(0, prev - tickElectricityCost));

      if (Math.random() > 0.40) {
        const nonce = Math.floor(Math.random() * 8999999) + 1000000;
        const targetHex = '000000000000' + Math.random().toString(16).substring(2, 10);
        const shareAccepted = Math.random() > 0.08;

        const newLog = {
          id: Date.now() + Math.random(),
          text: shareAccepted 
            ? `[SHARE ACCEPTED] Nonce: ${nonce} | Target: ${targetHex}... | Pool: ${pool.name} | Diff: ${coin.baseDiff}G`
            : `[NONCE EXPIRED] Stale block nonce ${nonce} - resynchronizing cluster`,
          type: shareAccepted ? 'share' : 'fail'
        };

        setTerminalLogs(prev => [newLog, ...prev.slice(0, 45)]);
      }

      setCoins(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(symbol => {
          if (Math.random() > 0.75) {
            const delta = (Math.random() - 0.49) * 0.004;
            const s = symbol as keyof typeof updated;
            updated[s] = {
              ...updated[s],
              price: Math.max(0.0001, updated[s].price * (1 + delta))
            };
          }
        });
        return updated;
      });

    }, 1500);

    return () => clearInterval(interval);
  }, [isMining, user, selectedCoin, selectedPool, totalHashrate, coins, hourlyElectricityCost]);

  const logContainerRef = useRef<HTMLDivElement>(null);

  const currentCoin = coins[selectedCoin as keyof typeof coins];
  const estimatedDailyCrypto = (parseFloat(totalHashrate) * 0.0000008 * 24 * 3600 / 1.5 / Math.sqrt(currentCoin.baseDiff));
  const estimatedDailyUSD = estimatedDailyCrypto * currentCoin.price;
  const estimatedDailyNetUSD = estimatedDailyUSD - dailyElectricityCost;

  const handleBuyRig = (rigId: string) => {
    const rig = rigs.find(r => r.id === rigId);
    if (!rig) return;
    if (balanceUSD >= rig.priceUSD && rig.owned < rig.maxCount) {
      updatePersistedBalance(balanceUSD - rig.priceUSD);
      setRigs(prev => prev.map(r => r.id === rigId ? { ...r, owned: r.owned + 1 } : r));
      setTxHistory(prev => [{
        id: 'tx_' + Date.now(),
        type: 'purchase',
        amount: rig.name,
        usdValue: `-$${rig.priceUSD.toLocaleString()}`,
        time: 'Just now',
        txid: '0x' + Math.random().toString(16).substring(2, 8)
      }, ...prev]);
    }
  };

  const handleUpgradeCooling = () => {
    const cost = coolingLevel * 350;
    if (balanceUSD >= cost) {
      updatePersistedBalance(balanceUSD - cost);
      setCoolingLevel(prev => prev + 1);
    }
  };

  const handleUpgradeEfficiency = () => {
    const cost = powerEfficiencyLevel * 500;
    if (balanceUSD >= cost) {
      updatePersistedBalance(balanceUSD - cost);
      setPowerEfficiencyLevel(prev => prev + 1);
    }
  };

  const handleToggleAI = () => {
    const cost = 1200;
    if (!aiTuningActive) {
      if (balanceUSD >= cost) {
        updatePersistedBalance(balanceUSD - cost);
        setAiTuningActive(true);
      }
    } else {
      setAiTuningActive(false);
    }
  };

  const handleWithdrawCrypto = (symbol: string) => {
    const amount = walletCrypto[symbol] || 0;
    if (amount <= 0) return;
    const coin = coins[symbol as keyof typeof coins];
    const usdValue = amount * coin.price;

    setWalletCrypto(prev => ({ ...prev, [symbol]: 0 }));
    updatePersistedBalance(balanceUSD + usdValue);

    setTxHistory(prev => [{
      id: 'tx_' + Date.now(),
      type: 'payout',
      amount: `${amount.toFixed(4)} ${symbol}`,
      usdValue: `+$${usdValue.toFixed(2)}`,
      time: 'Just now',
      txid: '0x' + Math.random().toString(16).substring(2, 10)
    }, ...prev]);
  };

  // Guard: If authenticated, never allow staying on login or register
  useEffect(() => {
    if (user && (activeTab === 'login' || activeTab === 'register')) {
      setActiveTab('dashboard');
      try {
        window.history.replaceState(null, '', '/#dashboard');
      } catch {}
      window.location.hash = 'dashboard';
    }
  }, [user, activeTab]);

  // STRICT AUTHENTICATION GATING:
  // Non-logged-in users attempting to access personal areas are redirected to Login
  const handleNavigate = (tab: string) => {
    const activeUser = userRef.current || user || getCurrentUser();
    const protectedTabs = ['dashboard', 'rigs', 'pools', 'wallet', 'deposit', 'withdraw'];
    
    if (protectedTabs.includes(tab) && !activeUser) {
      setActiveTab('login');
      try {
        window.history.replaceState(null, '', '/#login');
      } catch {}
      window.location.hash = 'login';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Authenticated user clicking login or register is routed straight to dashboard
    if (activeUser && (tab === 'login' || tab === 'register')) {
      setActiveTab('dashboard');
      try {
        window.history.replaceState(null, '', '/#dashboard');
      } catch {}
      window.location.hash = 'dashboard';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Unauthenticated user requesting dashboard is routed to landing
    if (!activeUser && tab === 'dashboard') {
      setActiveTab('landing');
      try {
        window.history.replaceState(null, '', '/');
      } catch {}
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setActiveTab(tab);
    try {
      window.history.replaceState(null, '', `/#${tab}`);
    } catch {}
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (loggedInUser: User) => {
    userRef.current = loggedInUser;
    setUser(loggedInUser);
    setCurrentUser(loggedInUser);
    setBalanceUSD(loggedInUser.balance || 0);
    setActiveTab('dashboard');
    try {
      window.history.replaceState(null, '', '/#dashboard');
    } catch {}
    window.location.hash = 'dashboard';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    userRef.current = null;
    setUser(null);
    setCurrentUser(null);
    setBalanceUSD(0);
    setActiveTab('landing');
    try {
      window.history.replaceState(null, '', '/');
    } catch {}
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-emerald-500 selection:text-slate-950 relative">
      
      {/* HEADER BAR (Admin button is strictly hidden from users!) */}
      <Header
        activeTab={activeTab}
        onNavigate={handleNavigate}
        currentUser={user}
        onLogout={handleLogout}
        balanceUSD={balanceUSD}
        totalHashrate={totalHashrate}
        unit={currentCoin.unit}
      />

      {/* MAIN CONTAINER */}
      <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-6">

        {/* ================= 1. PUBLIC LANDING PAGE (Shown when unauthenticated) ================= */}
        {activeTab === 'landing' && (
          <PublicLandingPage onNavigate={handleNavigate} />
        )}

        {/* ================= 2. AUTHENTICATED MINING DASHBOARD ================= */}
        {activeTab === 'dashboard' && user && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Top Mining Machine 3D View Mounted Inside Dashboard */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                      DEDICATED CLUSTER ONLINE
                    </span>
                    <span className="text-xs font-mono text-slate-400">Account: {user.name}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-100 font-heading">
                    Active ASIC Cluster Telemetry
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    Direct real-time 3D simulation of your hardware node running {selectedCoin} proof-of-work algorithm.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleNavigate('deposit')}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Deposit Funds
                  </button>
                  <button
                    onClick={() => handleNavigate('withdraw')}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <ArrowDownRight className="w-4 h-4" /> Withdraw Wire
                  </button>
                </div>
              </div>

              {/* Real 3D Mining Machine Rigged to Account */}
              <MiningMachine3D 
                isMining={isMining} 
                hashrate={`${totalHashrate} ${currentCoin.unit}`} 
                rigName="Enterprise ASIC Cluster S21" 
              />
            </div>

            {/* TOP STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Mining Engine Status */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-lg">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider font-mono">Engine State</span>
                  <div className={`px-2 py-0.5 rounded-full text-xs font-mono font-semibold ${isMining ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
                    {isMining ? 'ONLINE & MINING' : 'PAUSED'}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setIsMining(!isMining)}
                    className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-mono font-bold text-xs transition-all cursor-pointer ${
                      isMining 
                        ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30' 
                        : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20'
                    }`}
                  >
                    {isMining ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isMining ? 'Halt Operations' : 'Initialize Mining'}</span>
                  </button>
                </div>
              </div>

              {/* Card 2: Active Hashrate */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider font-mono">Net Hashrate</span>
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-cyan-400">
                  {totalHashrate} <span className="text-sm font-normal text-slate-400">{currentCoin.unit}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-mono">
                  Boost: {aiTuningActive ? '+15% AI' : 'Standard'} | Cooling: +{((coolingLevel-1)*5)}%
                </p>
              </div>

              {/* Card 3: Estimated Daily Gross */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider font-mono">Est. Daily Earnings</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  ${estimatedDailyUSD.toFixed(2)}
                </div>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  ≈ {estimatedDailyCrypto.toFixed(6)} {selectedCoin}
                </p>
              </div>

              {/* Card 4: Power Consumption & Cost */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider font-mono">Power Overhead</span>
                  <Activity className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-indigo-300">
                  {totalPowerKw} <span className="text-sm font-normal text-slate-400">kW</span>
                </div>
                <p className="text-xs text-rose-400 mt-1 font-mono">
                  -${dailyElectricityCost.toFixed(2)} / day @ ${electricityRate}/kWh
                </p>
              </div>

            </div>

            {/* MIDDLE SECTION: CONTROLS & COIN SELECTOR */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Target Asset Selector & Financial Projections */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
                <div>
                  <h3 className="text-lg font-bold text-slate-100 font-heading mb-1">Target Cryptographic Asset</h3>
                  <p className="text-xs text-slate-400 font-mono">Direct compute power across multi-algorithm proof-of-work protocols.</p>
                </div>

                {/* Coin Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(coins).map(([symbol, coin]) => {
                    const isSelected = selectedCoin === symbol;
                    return (
                      <button
                        key={symbol}
                        onClick={() => setSelectedCoin(symbol)}
                        className={`p-3.5 rounded-xl border text-left transition-all relative cursor-pointer ${
                          isSelected 
                            ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30' 
                            : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold font-mono text-slate-200">{coin.symbol}</span>
                          <span className={`text-xs font-mono ${coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                          </span>
                        </div>
                        <div className="text-sm text-slate-400 font-mono">${coin.price.toLocaleString(undefined, { minimumFractionDigits: coin.price < 1 ? 4 : 2 })}</div>
                        <div className="text-[10px] text-slate-500 mt-1 font-mono">Diff: {coin.baseDiff} G</div>
                      </button>
                    );
                  })}
                </div>

                {/* Earnings Projections Breakdown */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 font-mono">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Live Yield & Net Profit Estimates ({selectedCoin})</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="border-r border-slate-800 pr-2">
                      <div className="text-xs text-slate-500">Daily Net</div>
                      <div className={`text-base font-bold ${estimatedDailyNetUSD >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ${estimatedDailyNetUSD.toFixed(2)}
                      </div>
                    </div>
                    <div className="border-r border-slate-800 pr-2">
                      <div className="text-xs text-slate-500">Weekly Net</div>
                      <div className={`text-base font-bold ${(estimatedDailyNetUSD * 7) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ${(estimatedDailyNetUSD * 7).toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Monthly Net</div>
                      <div className={`text-base font-bold ${(estimatedDailyNetUSD * 30) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ${(estimatedDailyNetUSD * 30).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Col: Live Computational Terminal */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm font-bold text-slate-200 font-mono">Hash Engine Stream</h3>
                    </div>
                    <span className="flex h-2 w-2 relative">
                      {isMining && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                      <span className={`inline-flex rounded-full h-2 w-2 ${isMining ? 'bg-emerald-500' : 'bg-slate-600'}`}></span>
                    </span>
                  </div>

                  <div 
                    ref={logContainerRef}
                    className="bg-slate-950 font-mono text-[11px] p-3 rounded-xl border border-slate-800 h-64 overflow-y-auto space-y-1.5 scrollbar-thin"
                  >
                    {terminalLogs.map(log => (
                      <div key={log.id} className="leading-relaxed">
                        {log.type === 'sys' && <span className="text-indigo-400">[SYS] {log.text}</span>}
                        {log.type === 'share' && <span className="text-emerald-400">{log.text}</span>}
                        {log.type === 'fail' && <span className="text-rose-400/70">{log.text}</span>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400 font-mono">
                  <span>Pool: {POOLS.find(p => p.id === selectedPool)?.name}</span>
                  <span className="text-emerald-400">Share Rate: {isMining ? '99.4%' : '0%'}</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ================= 3. HARDWARE & RIG SHOP ================= */}
        {activeTab === 'rigs' && (
          <div className="space-y-6 animate-fade-in font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div>
                <h2 className="text-lg font-bold text-slate-100 font-heading">Virtual Hardware Fleet & Efficiency Center</h2>
                <p className="text-xs text-slate-400 font-mono">Acquire higher density ASIC/GPU rigs or optimize infrastructure to increase throughput per Watt.</p>
              </div>
              <div className="flex items-center space-x-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-400 font-mono">Available Balance:</span>
                <span className="font-mono font-bold text-emerald-400">${balanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* RIG CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {rigs.map(rig => {
                const Icon = rig.icon;
                const canAfford = balanceUSD >= rig.priceUSD;
                const isMax = rig.owned >= rig.maxCount;

                return (
                  <div key={rig.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2.5 bg-slate-800 rounded-xl text-emerald-400 border border-slate-700">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
                          Owned: {rig.owned}/{rig.maxCount}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-slate-100 text-base font-heading">{rig.name}</h3>
                      <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">{rig.type} Unit</span>

                      <div className="mt-4 space-y-2 font-mono text-xs border-t border-slate-800/80 pt-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Compute Speed:</span>
                          <span className="text-cyan-400 font-bold">+{rig.hashMultiplier} TH/s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Power Draw:</span>
                          <span className="text-indigo-300">{rig.powerKw} kW</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-slate-400 font-mono">Unit Price:</span>
                        <span className="font-mono font-bold text-emerald-400">${rig.priceUSD.toLocaleString()}</span>
                      </div>
                      <button
                        onClick={() => handleBuyRig(rig.id)}
                        disabled={!canAfford || isMax}
                        className={`w-full py-2.5 rounded-xl font-mono font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                          isMax 
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : canAfford 
                              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20' 
                              : 'bg-slate-800 text-slate-400 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        <span>{isMax ? 'Maximum Capacity' : 'Purchase Hardware'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FACILITY UPGRADES & INFRASTRUCTURE */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-slate-100 font-heading mb-4">Infrastructure & Data Center Upgrades</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
                
                {/* Upgrade 1: Liquid Cooling */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-sm text-slate-200">Immersion Liquid Cooling</h4>
                      <span className="text-xs text-cyan-400">Lvl {coolingLevel}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">Reduces thermal throttling. Boosts overall cluster hashing efficiency by +5% per level.</p>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-400">Cost:</span>
                      <span className="text-emerald-400 font-bold">${(coolingLevel * 350).toLocaleString()}</span>
                    </div>
                    <button
                      onClick={handleUpgradeCooling}
                      disabled={balanceUSD < (coolingLevel * 350)}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold disabled:opacity-50 cursor-pointer"
                    >
                      Upgrade Cooling
                    </button>
                  </div>
                </div>

                {/* Upgrade 2: Smart Transformer */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-sm text-slate-200">Eco Electricity Transformer</h4>
                      <span className="text-xs text-cyan-400">Lvl {powerEfficiencyLevel}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">Optimizes voltage regulation. Reduces power grid wattage consumption by -8% per level.</p>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-400">Cost:</span>
                      <span className="text-emerald-400 font-bold">${(powerEfficiencyLevel * 500).toLocaleString()}</span>
                    </div>
                    <button
                      onClick={handleUpgradeEfficiency}
                      disabled={balanceUSD < (powerEfficiencyLevel * 500)}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold disabled:opacity-50 cursor-pointer"
                    >
                      Upgrade Power Grid
                    </button>
                  </div>
                </div>

                {/* Upgrade 3: AI Overclocking */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-sm text-slate-200">Neural Auto-Tuning AI</h4>
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                    </div>
                    <p className="text-xs text-slate-400 mb-3">Dynamically modifies core clocks and memory timings. Grants instant +15% net Hashrate.</p>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-400">Status / Cost:</span>
                      <span className="text-emerald-400 font-bold">{aiTuningActive ? 'ACTIVE' : '$1,200 (One-Time)'}</span>
                    </div>
                    <button
                      onClick={handleToggleAI}
                      disabled={!aiTuningActive && balanceUSD < 1200}
                      className={`w-full py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                        aiTuningActive 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {aiTuningActive ? 'Deactivate Neural Tuning' : 'Purchase AI Engine'}
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ================= 3D INTERACTIVE MINING EXPLAINER ================= */}
        {activeTab === 'explainer' && (
          <div className="space-y-6 animate-fade-in font-sans">
            <MiningExplainer3D isMining={isMining} onNavigate={handleNavigate} />
          </div>
        )}

        {/* ================= 4. POOLS & STRATEGY ================= */}
        {activeTab === 'pools' && (
          <div className="space-y-6 animate-fade-in font-sans">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-slate-100 font-heading">Mining Pool & Payout Scheme Configuration</h2>
              <p className="text-xs text-slate-400 mt-1 font-mono">Connect your total cluster power to established global pools for stable payouts or attempt solo block discovery.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {POOLS.map(pool => {
                const isSelected = selectedPool === pool.id;
                return (
                  <div 
                    key={pool.id}
                    onClick={() => setSelectedPool(pool.id)}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-slate-900 border-emerald-500 ring-1 ring-emerald-500 shadow-lg' 
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-100 font-heading">{pool.name}</h3>
                        <span className="text-xs text-slate-400 font-mono">Payout Scheme: <strong className="text-slate-200">{pool.scheme}</strong></span>
                      </div>
                      {isSelected && (
                        <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold rounded-full border border-emerald-500/30">
                          CONNECTED
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 font-mono text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div>
                        <div className="text-slate-500 text-[10px]">Pool Fee</div>
                        <div className="text-slate-200 font-bold">{pool.feePct}%</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[10px]">Variance</div>
                        <div className="text-slate-200 font-bold">{pool.variance}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[10px]">Pool Luck</div>
                        <div className="text-emerald-400 font-bold">{pool.luck}%</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 5. WALLET & YIELD ================= */}
        {activeTab === 'wallet' && (
          <div className="space-y-6 animate-fade-in font-sans">
            
            {/* Fiat Cash + Staking Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Available Fiat Cash</span>
                  <div className="text-3xl font-mono font-bold text-emerald-400 mt-2">
                    ${balanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-2">Used for purchasing new hardware, electricity costs, and system upgrades.</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleNavigate('deposit')}
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
                  >
                    + Deposit Funds
                  </button>
                  <button
                    onClick={() => handleNavigate('withdraw')}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold text-xs rounded-xl cursor-pointer transition-all"
                  >
                    Withdraw to Bank
                  </button>
                </div>
              </div>

              {/* Staking Yield Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Proof-of-Stake Staking Vault</span>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">6.2% APY</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-slate-100 mt-2">
                    {stakedBTC.toFixed(4)} <span className="text-sm font-normal text-slate-400">BTC Staked</span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-1">Earn passive yield on your accumulated mined rewards.</p>
                </div>
                <div className="flex space-x-2 mt-4 font-mono">
                  <button 
                    onClick={() => {
                      if ((walletCrypto.BTC || 0) >= 0.005) {
                        setWalletCrypto(prev => ({ ...prev, BTC: prev.BTC - 0.005 }));
                        setStakedBTC(prev => prev + 0.005);
                      }
                    }}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  >
                    Stake +0.005 BTC
                  </button>
                  <button 
                    onClick={() => {
                      if (stakedBTC >= 0.005) {
                        setStakedBTC(prev => prev - 0.005);
                        setWalletCrypto(prev => ({ ...prev, BTC: prev.BTC + 0.005 }));
                      }
                    }}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Unstake
                  </button>
                </div>
              </div>

            </div>

            {/* MINED CRYPTO ASSETS TABLE */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-base font-bold text-slate-100 font-heading mb-4">Mined Digital Assets Inventory</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3 font-semibold">Asset</th>
                      <th className="pb-3 font-semibold">Mined Balance</th>
                      <th className="pb-3 font-semibold">Spot Price</th>
                      <th className="pb-3 font-semibold">USD Equivalent</th>
                      <th className="pb-3 text-right font-semibold">Instant Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {Object.entries(walletCrypto).map(([symbol, amount]) => {
                      const coin = coins[symbol as keyof typeof coins];
                      const usdVal = amount * coin.price;
                      return (
                        <tr key={symbol} className="hover:bg-slate-800/30">
                          <td className="py-4 font-bold text-slate-200">{coin.name} ({symbol})</td>
                          <td className="py-4 text-emerald-400 font-bold">{amount.toFixed(6)} {symbol}</td>
                          <td className="py-4 text-slate-400">${coin.price.toLocaleString(undefined, { minimumFractionDigits: coin.price < 1 ? 4 : 2 })}</td>
                          <td className="py-4 text-slate-200">${usdVal.toFixed(2)}</td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => handleWithdrawCrypto(symbol)}
                              disabled={amount <= 0}
                              className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 rounded-lg font-bold transition-all disabled:opacity-30 disabled:hover:bg-emerald-500/20 disabled:hover:text-emerald-400 cursor-pointer"
                            >
                              Liquidate to Fiat
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TRANSACTION HISTORY */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-base font-bold text-slate-100 font-heading mb-4">Ledger & Transaction Logs</h3>
              <div className="space-y-2 font-mono text-xs">
                {txHistory.map(tx => (
                  <div key={tx.id} className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-1.5 rounded-lg ${tx.type === 'payout' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {tx.type === 'payout' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-slate-200 font-bold">{tx.amount}</div>
                        <div className="text-[10px] text-slate-500">TXID: {tx.txid}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${tx.type === 'payout' ? 'text-emerald-400' : 'text-slate-300'}`}>{tx.usdValue}</div>
                      <div className="text-[10px] text-slate-500">{tx.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================= 6. MARKET ANALYTICS ================= */}
        {activeTab === 'market' && (
          <div className="space-y-6 animate-fade-in font-sans">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-slate-100 font-heading">Live Crypto Market Monitor</h2>
              <p className="text-xs text-slate-400 mt-1 font-mono">Real-time simulated network difficulty metrics and coin price telemetry.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
              {Object.entries(coins).map(([symbol, coin]) => (
                <div key={symbol} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-slate-100 text-base">{coin.name}</h3>
                      <span className="text-xs text-slate-500">{symbol} / USD</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${coin.change24h >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                    </span>
                  </div>

                  <div className="text-2xl font-bold text-slate-100 mb-4">
                    ${coin.price.toLocaleString(undefined, { minimumFractionDigits: coin.price < 1 ? 4 : 2 })}
                  </div>

                  <div className="h-16 flex items-end space-x-1.5 pt-2 border-t border-slate-800">
                    {[40, 55, 35, 60, 75, 50, 65, 80, 70, 85, 90, 95].map((h, idx) => (
                      <div 
                        key={idx} 
                        style={{ height: `${h}%` }} 
                        className={`flex-1 rounded-t ${coin.change24h >= 0 ? 'bg-emerald-500/40 hover:bg-emerald-400' : 'bg-rose-500/40 hover:bg-rose-400'} transition-all`}
                      />
                    ))}
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-800/80">
                    <span>Block Reward: {coin.reward} {symbol}</span>
                    <span>Diff Target: {coin.baseDiff} G</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 7. DEPOSIT (Protected) ================= */}
        {activeTab === 'deposit' && (
          user ? (
            <DepositPage currentUser={user} onNavigate={handleNavigate} balanceUSD={balanceUSD} />
          ) : (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md mx-auto space-y-4 font-mono shadow-2xl">
              <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <LogIn className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-slate-100">Authentication Required</h3>
              <p className="text-xs text-slate-400">Please sign in to access your assigned cryptocurrency deposit addresses and credit your balance.</p>
              <button
                onClick={() => handleNavigate('login')}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                Sign In to Account
              </button>
            </div>
          )
        )}

        {/* ================= 8. WITHDRAW (Protected) ================= */}
        {activeTab === 'withdraw' && (
          user ? (
            <WithdrawPage currentUser={user} onNavigate={handleNavigate} balanceUSD={balanceUSD} onUpdateBalance={updatePersistedBalance} />
          ) : (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md mx-auto space-y-4 font-mono shadow-2xl">
              <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <LogIn className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-slate-100">Authentication Required</h3>
              <p className="text-xs text-slate-400">Please sign in to initiate commercial bank wire disbursements.</p>
              <button
                onClick={() => handleNavigate('login')}
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                Sign In to Account
              </button>
            </div>
          )
        )}

        {/* ================= 9. ABOUT ================= */}
        {activeTab === 'about' && (
          <AboutPage onNavigate={handleNavigate} />
        )}

        {/* ================= 10. CONTACT ================= */}
        {activeTab === 'contact' && (
          <ContactPage />
        )}

        {/* ================= 11. LOGIN ================= */}
        {activeTab === 'login' && (
          user ? (
            <div className="py-24 text-center font-mono animate-fade-in">
              <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-slate-300 font-bold mb-1">Authenticated as {user.email}</p>
              <p className="text-xs text-slate-500">Redirecting to CrowdMine Mining Cluster Dashboard...</p>
            </div>
          ) : (
            <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />
          )
        )}

        {/* ================= 12. REGISTER ================= */}
        {activeTab === 'register' && (
          user ? (
            <div className="py-24 text-center font-mono animate-fade-in">
              <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-slate-300 font-bold mb-1">Authenticated as {user.email}</p>
              <p className="text-xs text-slate-500">Redirecting to CrowdMine Mining Cluster Dashboard...</p>
            </div>
          ) : (
            <RegisterPage onRegisterSuccess={handleLogin} onNavigate={handleNavigate} />
          )
        )}

        {/* ================= 13. HIDDEN ADMIN PORTAL ================= */}
        {activeTab === 'admin' && (
          <AdminPage onNavigate={handleNavigate} />
        )}

      </main>

      {/* 24/7 AI CUSTOMER SUPPORT CONCIERGE (Available across entire platform) */}
      <AiCustomerSupport />

      {/* FOOTER BAR */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}
