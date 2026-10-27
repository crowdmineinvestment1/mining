import React from 'react';
import { ShieldCheck, Cpu, Leaf, Globe, Zap, HardDrive, ArrowRight, Sparkles } from 'lucide-react';
import { MiningExplainer3D } from '../components/MiningExplainer3D';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in font-sans py-4">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
          GLOBAL MINING INFRASTRUCTURE
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-100 font-heading tracking-tight">
          About CrowdMine Investing
        </h1>
        <p className="text-sm sm:text-base text-slate-400 font-mono leading-relaxed">
          At Crowd Mine Investment, we are proud to be at the forefront of the cryptocurrency revolution, helping our clients harness the power of cryptocurrency mining for financial growth.
        </p>
      </div>

      {/* Interactive 3D Explainer Showcase */}
      <div>
        <MiningExplainer3D isMining={true} onNavigate={onNavigate} />
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 font-heading">Our Mission</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            At CrowdMine Investing, our mission is to democratize decentralized blockchain compute power by providing frictionless, secure, and ultra-high-density cloud hashrates. Anyone can participate in Bitcoin SHA-256 and altcoin consensus without the burden of hardware procurement or electricity spikes.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 font-heading">Global Cluster Network</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            Founded by high-performance distributed systems engineers, CrowdMine has expanded to serve over 50,000 active investors across 150+ countries. We operate over 240,000 Terahash of combined industrial capacity routed across top mining pools.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <HardDrive className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 font-heading">Proprietary ASIC Technology</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            We deploy immersion-cooled Antminer S21 Pro, WhatsMiner M60S, and custom GPU hydro-clusters. Automated neural algorithms dynamically switch hashrates to the most profitable coin, yielding maximum daily satoshi distributions.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <Leaf className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 font-heading">100% Green Energy Mandate</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            Sustainability is engineered into every kilowatt. 100% of our energy originates from dedicated baseload geothermal and hydro-electric stations, guaranteeing near-zero carbon emission footprints while maintaining competitive electricity overhead.
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 font-mono">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-heading">$2.5B+</div>
            <div className="text-[11px] text-slate-400 mt-1 uppercase">Hash Assets Managed</div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-cyan-400 font-heading">50,000+</div>
            <div className="text-[11px] text-slate-400 mt-1 uppercase">Active Miners</div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-indigo-400 font-heading">150+</div>
            <div className="text-[11px] text-slate-400 mt-1 uppercase">Countries Covered</div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-amber-400 font-heading">99.98%</div>
            <div className="text-[11px] text-slate-400 mt-1 uppercase">Hardware Uptime</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-900/60 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-heading">
          Ready to Allocate Your Mining Hashrate?
        </h2>
        <p className="text-xs text-slate-400 font-mono max-w-lg mx-auto">
          Start mining Bitcoin, Kaspa, and top crypto assets with zero hardware setup.
        </p>
        <button
          onClick={() => onNavigate('deposit')}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs rounded-xl shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Deposit & Activate Rigs</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
