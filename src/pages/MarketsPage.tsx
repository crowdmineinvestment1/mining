import React, { useState } from 'react';
import { MarketCoin } from '../types';

interface MarketsPageProps {
  onNavigate: (page: string) => void;
}

export const MarketsPage: React.FC<MarketsPageProps> = ({ onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'crypto' | 'metal' | 'stock'>('all');

  const marketCoins: MarketCoin[] = [
    { id: 'btc', symbol: 'BTC', name: 'Bitcoin (SHA-256 Mining)', price: 68420.50, change: 2.41, mcap: 1340000000000, vol: 28500000000, type: 'crypto', algorithm: 'SHA-256', hashrate: '652 EH/s', dailyReward: '$0.078 / TH' },
    { id: 'eth', symbol: 'ETH', name: 'Ethereum (Validator Staking)', price: 3821.30, change: 1.82, mcap: 460000000000, vol: 15200000000, type: 'crypto', algorithm: 'Proof of Stake', hashrate: '980 TH/s', dailyReward: '4.8% APR' },
    { id: 'kas', symbol: 'KAS', name: 'Kaspa (kHeavyHash ASIC)', price: 0.174, change: 5.60, mcap: 4200000000, vol: 350000000, type: 'crypto', algorithm: 'kHeavyHash', hashrate: '240 PH/s', dailyReward: '$0.125 / GH' },
    { id: 'sol', symbol: 'SOL', name: 'Solana (High-Yield Node)', price: 178.40, change: 4.12, mcap: 78000000000, vol: 3200000000, type: 'crypto', algorithm: 'Tower BFT', hashrate: 'Global RPC', dailyReward: '7.2% APR' },
    { id: 'doge', symbol: 'DOGE', name: 'Dogecoin (Scrypt AuxPoW)', price: 0.162, change: 3.30, mcap: 23000000000, vol: 1100000000, type: 'crypto', algorithm: 'Scrypt', hashrate: '1.2 PH/s', dailyReward: '$0.092 / GH' },
    { id: 'ltc', symbol: 'LTC', name: 'Litecoin (Scrypt Miner)', price: 84.20, change: 0.95, mcap: 6300000000, vol: 480000000, type: 'crypto', algorithm: 'Scrypt', hashrate: '950 TH/s', dailyReward: '$0.045 / MH' },
    { id: 'bnb', symbol: 'BNB', name: 'BNB Smart Chain Node', price: 605.10, change: -0.54, mcap: 89000000000, vol: 1800000000, type: 'crypto', algorithm: 'PoSA', hashrate: 'Validator', dailyReward: '5.1% APR' },
    { id: 'xau', symbol: 'XAU', name: 'Gold Bullion Reserve', price: 2341.00, change: 0.61, mcap: null, vol: null, type: 'metal', algorithm: 'Physical Vault', dailyReward: 'Inflation Hedge' },
    { id: 'xag', symbol: 'XAG', name: 'Silver Bullion Bar', price: 28.14, change: -0.23, mcap: null, vol: null, type: 'metal', algorithm: 'Physical Vault', dailyReward: 'Industrial Demand' },
    { id: 'aapl', symbol: 'AAPL', name: 'Apple Inc. Hardware', price: 189.84, change: 1.15, mcap: 2940000000000, vol: 52000000, type: 'stock', algorithm: 'Silicon Compute', dailyReward: 'Tech Equity' },
    { id: 'nvda', symbol: 'NVDA', name: 'NVIDIA AI & Mining Silicon', price: 128.50, change: 3.45, mcap: 3150000000000, vol: 88000000, type: 'stock', algorithm: 'GPU Hashrate', dailyReward: 'Compute Leader' },
    { id: 'tsla', symbol: 'TSLA', name: 'Tesla Clean Energy Compute', price: 248.30, change: -1.80, mcap: 790000000000, vol: 98000000, type: 'stock', algorithm: 'Solar Infrastructure', dailyReward: 'Clean Energy' }
  ];

  const filteredCoins = activeFilter === 'all'
    ? marketCoins
    : marketCoins.filter(c => c.type === activeFilter);

  const formatPrice = (p: number) => {
    if (p >= 1000) return '$' + p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (p >= 1) return '$' + p.toFixed(2);
    return '$' + p.toFixed(4);
  };

  const formatCompact = (n: number | null | undefined) => {
    if (!n) return '—';
    if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T';
    if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
    return '$' + n.toLocaleString();
  };

  return (
    <div className="py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-3">
            Real-Time Mining Data
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-heading">
            Global Hashrates & Markets
          </h1>
          <p className="text-slate-600 text-base mt-2">
            Real-time telemetry and pricing across Bitcoin SHA-256, altcoin hashrates, precious metals, and compute equities. Updated live.
          </p>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Assets & Rigs
            </button>
            <button
              onClick={() => setActiveFilter('crypto')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeFilter === 'crypto'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mining Hashrates
            </button>
            <button
              onClick={() => setActiveFilter('metal')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeFilter === 'metal'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vault Reserves
            </button>
            <button
              onClick={() => setActiveFilter('stock')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeFilter === 'stock'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Compute Equities
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">#</th>
                  <th className="py-4 px-6">Asset / Mining Pool</th>
                  <th className="py-4 px-6">Algorithm</th>
                  <th className="py-4 px-6">Live Price</th>
                  <th className="py-4 px-6">24h Change</th>
                  <th className="py-4 px-6">Network Hashrate</th>
                  <th className="py-4 px-6">Est. Daily Reward</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredCoins.map((coin, index) => {
                  const isPositive = coin.change >= 0;
                  return (
                    <tr key={coin.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-400 text-xs">
                        {index + 1}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-mono text-xs">
                            {coin.symbol}
                          </span>
                          <span>{coin.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                          {coin.algorithm || 'Standard'}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-extrabold text-slate-900 font-heading">
                        {formatPrice(coin.price)}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`font-bold inline-flex items-center gap-1 text-xs ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isPositive ? '▲' : '▼'} {Math.abs(coin.change).toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-600 font-medium">
                        {coin.hashrate || formatCompact(coin.mcap)}
                      </td>
                      <td className="py-4 px-6 text-xs font-semibold text-emerald-700">
                        {coin.dailyReward || formatCompact(coin.vol)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => onNavigate('register')}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
                        >
                          Mine Now
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-2xl font-bold font-heading mb-2">Want to rent dedicated ASIC clusters?</h3>
            <p className="text-blue-200 text-sm">
              Deploy custom 500+ TH/s setups with dedicated transformers and zero setup delays.
            </p>
          </div>
          <button
            onClick={() => onNavigate('deposit')}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-lg transition-all cursor-pointer whitespace-nowrap"
          >
            Deposit & Rent Rigs
          </button>
        </div>
      </div>
    </div>
  );
};
