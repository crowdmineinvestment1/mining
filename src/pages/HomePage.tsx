import React, { useState } from 'react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [calculatorHashrate, setCalculatorHashrate] = useState<number>(100);

  // Daily yield calculation: approximate ~ $0.078 per TH/s daily
  const dailyEarning = (calculatorHashrate * 0.078).toFixed(2);
  const monthlyEarning = (calculatorHashrate * 0.078 * 30).toFixed(2);
  const yearlyEarning = (calculatorHashrate * 0.078 * 365).toFixed(2);

  return (
    <div className="relative z-10">
      {/* Hero Section */}
      <section className="pt-12 pb-20 md:pt-16 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Trusted by 50,000+ crypto miners & investors worldwide</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight font-heading">
                Mine Smarter.<br />
                <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-amber-500 bg-clip-text text-transparent">
                  Grow Faster with CrowdMine.
                </span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                CrowdMine Investing gives you institutional-grade cloud mining rigs, dedicated hashrates,
                and automated daily payouts across Bitcoin, Ethereum, Solana, and top digital assets — all
                from one unified, secure platform with zero hardware maintenance.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('register')}
                  className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center gap-2 text-base cursor-pointer transform hover:-translate-y-0.5"
                >
                  <span>Start Mining Free</span>
                  <i className="fas fa-arrow-right text-sm"></i>
                </button>
                <button
                  onClick={() => onNavigate('markets')}
                  className="px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-300 hover:border-blue-400 rounded-xl transition-all text-base cursor-pointer flex items-center gap-2"
                >
                  <i className="fas fa-chart-line text-blue-600"></i>
                  <span>Explore Hashrates & Markets</span>
                </button>
              </div>

              {/* Trust Features */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/80 max-w-xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <i className="fas fa-shield-halved text-blue-600 text-sm"></i>
                  <span>Bank-level security</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <i className="fas fa-bolt text-amber-500 text-sm"></i>
                  <span>99.98% Hashrate Uptime</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <i className="fas fa-clock text-emerald-600 text-sm"></i>
                  <span>Instant Daily Payouts</span>
                </div>
              </div>
            </div>

            {/* Right Visual / Dashboard Card */}
            <div className="lg:col-span-5 relative">
              <div className="glass-card p-6 sm:p-7 relative z-10 shadow-2xl border border-slate-100/80 bg-white/95">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Mining Portfolio Value
                    </span>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      142.5 TH/s Active
                    </span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <i className="fas fa-arrow-trend-up text-[10px]"></i> +4.2% daily
                  </span>
                </div>

                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading mb-4">
                  $248,391.50
                </div>

                {/* Performance Chart Simulation */}
                <div className="h-20 w-full mb-5 rounded-lg overflow-hidden bg-slate-50 border border-slate-100">
                  <svg viewBox="0 0 400 80" preserveAspectRatio="none" className="w-full h-full">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,65 C40,55 80,60 120,40 S200,20 250,30 S320,15 400,8"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M0,65 C40,55 80,60 120,40 S200,20 250,30 S320,15 400,8 L400,80 L0,80 Z"
                      fill="url(#chartGrad)"
                    />
                  </svg>
                </div>

                {/* Active Mining Rigs List */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-3 bg-slate-50 hover:bg-blue-50/70 transition-colors rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                        <i className="fab fa-bitcoin"></i>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">Bitcoin Antminer S21</div>
                        <div className="text-xs text-slate-500">2.3456 BTC · 110 TH/s</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">$68,420.50</div>
                      <div className="text-xs font-semibold text-emerald-600">+2.4% Yield</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 hover:bg-blue-50/70 transition-colors rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                        <i className="fab fa-ethereum"></i>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">Ethereum Staking Farm</div>
                        <div className="text-xs text-slate-500">10.50 ETH · 32 Validator Keys</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">$3,821.30</div>
                      <div className="text-xs font-semibold text-emerald-600">+1.8% Yield</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 hover:bg-blue-50/70 transition-colors rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                        <i className="fas fa-coins"></i>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">Kaspa / Doge AuxPoW</div>
                        <div className="text-xs text-slate-500">32.5 TH/s kHeavyHash Pool</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">$2,341.00</div>
                      <div className="text-xs font-semibold text-emerald-600">+5.6% Yield</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stat Badges */}
              <div className="absolute -top-4 -right-4 sm:-right-6 glass-card p-3 sm:p-4 shadow-xl border border-white flex items-center gap-3 z-20 anim-float">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg">
                  <i className="fas fa-arrow-trend-up"></i>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Today's Mining Gain</div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-900 font-heading">+$1,247.80</div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-4 sm:-left-6 glass-card p-3 sm:p-4 shadow-xl border border-white flex items-center gap-3 z-20">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg">
                  <i className="fas fa-server"></i>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Active Hashrate Rigs</div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-900 font-heading">50,000+ Units</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Stats Bar */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 rounded-3xl p-8 sm:p-10 shadow-xl text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-blue-700/50">
              <div className="pt-4 md:pt-0">
                <div className="text-3xl sm:text-4xl font-extrabold font-heading text-white mb-1">$2.5B+</div>
                <div className="text-xs sm:text-sm text-blue-200/80 font-medium">Crypto Mining Assets Under Management</div>
              </div>
              <div className="pt-4 md:pt-0 md:pl-4">
                <div className="text-3xl sm:text-4xl font-extrabold font-heading text-white mb-1">50K+</div>
                <div className="text-xs sm:text-sm text-blue-200/80 font-medium">Active Miners & Investors</div>
              </div>
              <div className="pt-4 md:pt-0 md:pl-4">
                <div className="text-3xl sm:text-4xl font-extrabold font-heading text-white mb-1">150+</div>
                <div className="text-xs sm:text-sm text-blue-200/80 font-medium">Countries & Territories Supported</div>
              </div>
              <div className="pt-4 md:pt-0 md:pl-4">
                <div className="text-3xl sm:text-4xl font-extrabold font-heading text-white mb-1">99.98%</div>
                <div className="text-xs sm:text-sm text-blue-200/80 font-medium">Hashrate Infrastructure Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Hashrate Profitability Calculator */}
      <section className="py-16 bg-slate-50/70 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-3">
              <i className="fas fa-calculator text-[10px]"></i>
              Mining Profit Calculator
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
              Estimate Your Cloud Mining Returns
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Select your desired SHA-256 cloud hashrate to see real-time estimated yields based on current network difficulty.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-700">Allocated Cloud Hashrate</span>
                  <span className="text-lg font-black text-blue-700 font-heading">{calculatorHashrate} TH/s</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={calculatorHashrate}
                  onChange={(e) => setCalculatorHashrate(Number(e.target.value))}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>10 TH/s (Starter)</span>
                  <span>500 TH/s (Pro Miner)</span>
                  <span>1,000 TH/s (Institutional)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 text-center">
                  <div className="text-xs uppercase font-bold text-slate-500 mb-1">Estimated Daily Yield</div>
                  <div className="text-2xl font-black text-blue-700 font-heading">${dailyEarning}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Automatic wallet payout</div>
                </div>

                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-center">
                  <div className="text-xs uppercase font-bold text-slate-500 mb-1">Estimated Monthly Yield</div>
                  <div className="text-2xl font-black text-emerald-700 font-heading">${monthlyEarning}</div>
                  <div className="text-[11px] text-slate-400 mt-1">~ 30-day payout projection</div>
                </div>

                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100 text-center">
                  <div className="text-xs uppercase font-bold text-slate-500 mb-1">Estimated Annual Yield</div>
                  <div className="text-2xl font-black text-amber-700 font-heading">${yearlyEarning}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Zero hardware maintenance fees</div>
                </div>
              </div>

              <div className="text-center pt-3">
                <button
                  onClick={() => onNavigate('register')}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <i className="fas fa-plug-circle-bolt"></i>
                  <span>Deploy {calculatorHashrate} TH/s Mining Contract</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features: Why CrowdMine Investing */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-3">
              Why CrowdMine
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
              Everything You Need to Mine With Confidence
            </h2>
            <p className="text-slate-600 text-base mt-2">
              Professional-grade infrastructure designed for both individual crypto enthusiasts and high-net-worth portfolio managers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl mb-6">
                <i className="fas fa-shield-halved"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading mb-3">
                Enterprise-Grade Security
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Every mining contract and fund balance is backed by cold storage escrow, multi-signature keys, and 256-bit SSL encryption.
              </p>
              <button onClick={() => onNavigate('about')} className="text-blue-600 font-bold text-sm hover:underline inline-flex items-center gap-1 cursor-pointer">
                Learn more <i className="fas fa-arrow-right text-xs"></i>
              </button>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl mb-6">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading mb-3">
                Real-Time Hashrate Analytics
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Live monitoring of rig temperatures, rejection rates, block rewards, and pool share statistics updated every 30 seconds.
              </p>
              <button onClick={() => onNavigate('markets')} className="text-blue-600 font-bold text-sm hover:underline inline-flex items-center gap-1 cursor-pointer">
                View telemetry <i className="fas fa-arrow-right text-xs"></i>
              </button>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mb-6">
                <i className="fas fa-cubes"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading mb-3">
                Multi-Algorithm Mining
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Deploy hashrates across SHA-256 (BTC), Scrypt (LTC/DOGE), Ethash (ETC), and kHeavyHash (KAS) from one single wallet.
              </p>
              <button onClick={() => onNavigate('markets')} className="text-blue-600 font-bold text-sm hover:underline inline-flex items-center gap-1 cursor-pointer">
                Explore algorithms <i className="fas fa-arrow-right text-xs"></i>
              </button>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl mb-6">
                <i className="fas fa-bolt"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading mb-3">
                Instant Daily Settlements
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Mined cryptocurrencies are automatically credited to your user account every 24 hours with transparent transaction hashes.
              </p>
              <button onClick={() => onNavigate('register')} className="text-blue-600 font-bold text-sm hover:underline inline-flex items-center gap-1 cursor-pointer">
                Start earning <i className="fas fa-arrow-right text-xs"></i>
              </button>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-2xl mb-6">
                <i className="fas fa-leaf"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading mb-3">
                100% Green Energy Mining
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Our global data centers run on geothermal, hydroelectric, and solar power plants in Iceland, Canada, and Scandinavia.
              </p>
              <button onClick={() => onNavigate('about')} className="text-blue-600 font-bold text-sm hover:underline inline-flex items-center gap-1 cursor-pointer">
                Read our eco story <i className="fas fa-arrow-right text-xs"></i>
              </button>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl mb-6">
                <i className="fas fa-headset"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading mb-3">
                24/7 Operations Desk
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Dedicated mining hardware engineers and client managers available round the clock via live chat and direct WhatsApp.
              </p>
              <button onClick={() => onNavigate('contact')} className="text-blue-600 font-bold text-sm hover:underline inline-flex items-center gap-1 cursor-pointer">
                Contact support <i className="fas fa-arrow-right text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-3">
              Get Started
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
              Up and Mining in 3 Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative z-10">
              <div className="text-5xl font-black text-blue-100 font-heading mb-4">01</div>
              <h4 className="text-xl font-bold text-slate-900 font-heading mb-3">Create Free Account</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Sign up in under 60 seconds with your email. Complete quick security verification to unlock your dedicated cloud miner dashboard.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative z-10">
              <div className="text-5xl font-black text-blue-100 font-heading mb-4">02</div>
              <h4 className="text-xl font-bold text-slate-900 font-heading mb-3">Choose Hashrate & Deposit</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Fund your account with Bitcoin, Ethereum, USDT, Solana, or bank wire. Select your desired hashrate plan or mining pool.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative z-10">
              <div className="text-5xl font-black text-blue-100 font-heading mb-4">03</div>
              <h4 className="text-xl font-bold text-slate-900 font-heading mb-3">Collect Daily Rewards</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Your rented ASIC hardware starts hashing instantly. Watch your portfolio grow daily with options to withdraw or reinvest anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-slate-950 rounded-3xl p-10 sm:p-14 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-black font-heading mb-4 leading-tight">
                Ready to Start Mining & Growing Your Wealth?
              </h2>
              <p className="text-blue-100 text-base sm:text-lg mb-8 leading-relaxed">
                Join over 50,000 investors worldwide who trust CrowdMine Investing for institutional-grade cloud hashrate solutions.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate('register')}
                  className="px-8 py-3.5 bg-white text-blue-800 font-bold rounded-xl shadow-lg hover:bg-blue-50 transition-all text-base cursor-pointer"
                >
                  Open Free Account
                </button>
                <button
                  onClick={() => onNavigate('about')}
                  className="px-7 py-3.5 bg-transparent border border-white/40 hover:bg-white/10 text-white font-bold rounded-xl transition-all text-base cursor-pointer"
                >
                  Learn About Our Farms
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
