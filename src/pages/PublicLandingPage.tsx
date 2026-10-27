import React, { useState } from 'react';
import { MiningMachine3D } from '../components/MiningMachine3D';
import { MiningExplainer3D } from '../components/MiningExplainer3D';
import { 
  Cpu, Zap, HardDrive, ShieldCheck, Activity, DollarSign, 
  ArrowRight, Globe, Leaf, Clock, Radio, CheckCircle2, ChevronRight, Sparkles, Server, Layers, Box
} from 'lucide-react';

interface PublicLandingPageProps {
  onNavigate: (page: string) => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({ onNavigate }) => {
  const [calculatorHashrate, setCalculatorHashrate] = useState<number>(120);

  // Profitability calculations (~$0.078 per TH/s daily)
  const dailyReturn = (calculatorHashrate * 0.078).toFixed(2);
  const monthlyReturn = (calculatorHashrate * 0.078 * 30).toFixed(2);
  const annualReturn = (calculatorHashrate * 0.078 * 365).toFixed(2);

  const enterpriseFleet = [
    {
      name: 'Antminer S21 Pro Hydro',
      specs: '110 TH/s · 3500W · 31.8 J/TH',
      algo: 'SHA-256 Bitcoin',
      cooling: 'Immersion Liquid Hydro',
      price: '$6,500'
    },
    {
      name: 'WhatsMiner M60S Hydro',
      specs: '186 TH/s · 3440W · 18.5 J/TH',
      algo: 'SHA-256 Bitcoin',
      cooling: 'Direct-to-Chip Water Cooling',
      price: '$8,200'
    },
    {
      name: 'NVIDIA RTX 4090 Cluster',
      specs: '960 MH/s · 2400W · Multi-Algo',
      algo: 'Ethash / kHeavyHash / Kaspa',
      cooling: 'Vapor Chamber Hydro',
      price: '$7,800'
    },
    {
      name: '40ft Industrial Hydro Pod',
      specs: '1.2 PH/s Container Cluster',
      algo: 'Dual-Algorithm Dual Consensus',
      cooling: 'Geothermal Chilled Loop',
      price: '$48,000'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 font-sans animate-fade-in text-slate-100">
      
      {/* ================= HERO SECTION WITH 3D ASIC MACHINE ================= */}
      <section className="pt-4 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Enterprise Headline & Badges */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-mono shadow-lg shadow-emerald-500/5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold tracking-wide">ENTERPRISE BLOCKCHAIN INFRASTRUCTURE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-100 font-heading tracking-tight leading-[1.1]">
              Autonomous Cloud Mining & <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">3D ASIC Hashrates</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-mono max-w-xl">
              CrowdMine Investing operates high-density, immersion-cooled cryptocurrency data centers powered by 100% renewable geothermal and hydro energy. Deploy dedicated Terahash power with zero hardware procurement, maintenance overhead, or electric volatility.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('register')}
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-mono font-bold rounded-xl shadow-xl shadow-emerald-500/20 transition-all flex items-center space-x-2 text-sm cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>Deploy Mining Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('login')}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-mono font-semibold rounded-xl transition-all text-sm cursor-pointer flex items-center space-x-2"
              >
                <span>Access Cluster Dashboard</span>
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 font-mono text-[11px] text-slate-400">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>256-Bit Cold Vaults</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>99.98% Uptime SLA</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Leaf className="w-4 h-4 text-amber-400" />
                <span>Zero-Carbon Hydro</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D ASIC Mining Machine */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex justify-between items-center px-1 font-mono text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Interactive 3D Hardware Telemetry
              </span>
              <span className="text-[10px] text-slate-500">Drag to inspect chassis & fans</span>
            </div>

            {/* 3D Visualizer Canvas */}
            <MiningMachine3D isMining={true} hashrate="110.00 TH/s" rigName="Antminer S21 Pro Hydro" />
          </div>

        </div>
      </section>

      {/* ================= MAJOR 3D HOW MINING WORKS DIGITAL TWIN ================= */}
      <section className="space-y-4">
        <MiningExplainer3D isMining={true} onNavigate={onNavigate} />
      </section>

      {/* ================= GLOBAL INFRASTRUCTURE STATS ================= */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 font-mono shadow-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-heading mb-1">$2.5B+</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">Hash Assets Managed</div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-heading mb-1">50,000+</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">Active Cloud Miners</div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400 font-heading mb-1">150+</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">Countries Covered</div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-heading mb-1">99.98%</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">Hardware Uptime</div>
          </div>
        </div>
      </section>

      {/* ================= PROFITABILITY CALCULATOR ================= */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full">
            REAL-TIME PROFITABILITY ENGINE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 font-heading">
            Simulate Your Hashrate Returns
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            Adjust your rented SHA-256 compute power to project automated daily satoshi disbursements.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6 pt-2 font-mono">
          <div>
            <div className="flex justify-between items-center mb-2 text-xs sm:text-sm">
              <span className="text-slate-400">Allocated Cloud Hashrate:</span>
              <span className="text-lg font-bold text-cyan-400">{calculatorHashrate} TH/s</span>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={calculatorHashrate}
              onChange={(e) => setCalculatorHashrate(Number(e.target.value))}
              className="w-full h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500 border border-slate-800"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>10 TH/s (Starter)</span>
              <span>500 TH/s (Enterprise)</span>
              <span>1,000 TH/s (Institutional Pod)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
              <div className="text-[11px] uppercase text-slate-400 mb-1">Est. Daily Yield</div>
              <div className="text-2xl font-bold text-emerald-400 font-heading">${dailyReturn}</div>
              <div className="text-[10px] text-slate-500 mt-1">Direct wallet credit</div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
              <div className="text-[11px] uppercase text-slate-400 mb-1">Est. 30-Day Yield</div>
              <div className="text-2xl font-bold text-cyan-400 font-heading">${monthlyReturn}</div>
              <div className="text-[10px] text-slate-500 mt-1">30-day projection</div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
              <div className="text-[11px] uppercase text-slate-400 mb-1">Est. Annual Yield</div>
              <div className="text-2xl font-bold text-indigo-400 font-heading">${annualReturn}</div>
              <div className="text-[10px] text-slate-500 mt-1">Zero maintenance fees</div>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('register')}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 text-xs transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Deploy {calculatorHashrate} TH/s Mining Contract</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= HARDWARE FLEET SHOWCASE ================= */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
            ASIC & GPU RACK ARCHITECTURE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 font-heading">
            Enterprise Industrial Fleet
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            Our data centers are populated by top-tier hydro-cooled ASIC nodes with industry-leading Joules per Terahash efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {enterpriseFleet.map((rig, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 hover:border-slate-700 transition-all font-mono shadow-lg flex flex-col justify-between">
              <div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-cyan-400 w-fit mb-3">
                  <Server className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-100 text-sm font-heading">{rig.name}</h3>
                <div className="text-xs text-emerald-400 font-bold mt-0.5">{rig.specs}</div>
                <div className="text-[11px] text-slate-400 mt-2">Algo: {rig.algo}</div>
                <div className="text-[11px] text-indigo-300 mt-1">Cooling: {rig.cooling}</div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Valuation</div>
                  <div className="text-xs font-bold text-slate-200">{rig.price}</div>
                </div>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Allocate Rig
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-4 font-mono">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-100 font-heading">
          Ready to Start Generating Cryptographic Yield?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Create an investor account in under 60 seconds and direct dedicated hashrates immediately.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('register')}
            className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('about')}
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Read Technical Spec
          </button>
        </div>
      </section>

    </div>
  );
};
