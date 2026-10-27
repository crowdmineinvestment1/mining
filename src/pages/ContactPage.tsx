import React, { useState } from 'react';
import { Mail, MessageSquare, Building, Clock, Check, Send } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) return;
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in font-sans py-4">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full">
          24/7 OPERATIONS DESK
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-100 font-heading">
          Contact CrowdMine Operations
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-mono">
          Reach our round-the-clock mining engineering team for cluster inquiries, deposits, or large-scale hashrate allocations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-slate-100 font-mono">
            Transmit Direct Inquiry
          </h3>

          {submitted && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 font-mono text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Inquiry dispatched! Operations desk will review and reply within 2 hours.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block uppercase text-slate-400 mb-1.5 font-bold">Your Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:border-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="block uppercase text-slate-400 mb-1.5 font-bold">Your Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="operator@example.com"
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:border-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="block uppercase text-slate-400 mb-1.5 font-bold">Inquiry Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Hashrate expansion, hardware telemetry, or payout status"
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:border-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="block uppercase text-slate-400 mb-1.5 font-bold">Message Specification</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Provide detailed query description..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:border-cyan-500 outline-none resize-y"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>

        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4 font-mono text-xs">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-start gap-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200">Official Communications</h4>
              <p className="text-slate-500 text-[11px] mt-0.5">Automated ticketing & response</p>
              <a href="mailto:support@crowdmineinvesting.com" className="text-cyan-400 hover:underline mt-1 inline-block">
                support@crowdmineinvesting.com
              </a>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-start gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200">WhatsApp & Direct Chat</h4>
              <p className="text-slate-500 text-[11px] mt-0.5">High-priority investor response desk</p>
              <span className="text-emerald-400 font-bold mt-1 inline-block">
                Active Operational Status
              </span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-start gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200">Operational Facilities</h4>
              <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                Primary Node: Reykjavik High-Density Geothermal Center<br />
                Secondary Node: Hydro-Electric Quebec Cluster<br />
                Corporate Treasury: 123 Compute Plaza, New York, NY
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-start gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200">Service Hours</h4>
              <p className="text-slate-400 text-[11px] mt-1">
                24/7/365 Automated Rig Uptime & Operations Monitoring
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
