import React from 'react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const openWhatsApp = () => {
    const msg = encodeURIComponent("Hello, I'm an investor with CrowdMine Investing. I would like assistance with my cloud mining hashrate and account.");
    window.open(`https://wa.me/?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <footer className="border-t border-slate-800 bg-slate-950/90 py-8 px-4 text-slate-400 font-mono text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-slate-200">CROWDMINE INVESTING</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500 text-[11px]">Autonomous Cloud Mining & Hashrate Deployment Infrastructure</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-emerald-400 transition-colors cursor-pointer">
              Telemetry
            </button>
            <button onClick={() => onNavigate('rigs')} className="hover:text-emerald-400 transition-colors cursor-pointer">
              Hardware
            </button>
            <button onClick={() => onNavigate('pools')} className="hover:text-emerald-400 transition-colors cursor-pointer">
              Pools
            </button>
            <button onClick={() => onNavigate('deposit')} className="hover:text-emerald-400 transition-colors cursor-pointer">
              Deposit
            </button>
            <button onClick={() => onNavigate('withdraw')} className="hover:text-emerald-400 transition-colors cursor-pointer">
              Withdraw
            </button>
            <button onClick={() => onNavigate('about')} className="hover:text-emerald-400 transition-colors cursor-pointer">
              About
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-emerald-400 transition-colors cursor-pointer">
              Support
            </button>
          </div>

          <div className="text-[11px] text-slate-500">
            © 2026 CrowdMine Investing Inc. Real-Time Hardware Emulation Layer.
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Contact Button */}
      <button
        onClick={openWhatsApp}
        className="fixed bottom-6 right-6 w-12 h-12 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25 transition-all transform hover:scale-105 z-40 cursor-pointer"
        aria-label="Contact CrowdMine Operations on WhatsApp"
        title="24/7 Operations Desk (WhatsApp)"
      >
        <i className="fab fa-whatsapp text-2xl"></i>
      </button>
    </>
  );
};
