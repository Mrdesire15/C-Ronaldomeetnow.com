import React, { useState } from 'react';
import { Globe, ArrowRight, CheckCircle2, Shield, Sparkles, Mail, Check } from 'lucide-react';

interface GoDaddyHeroProps {
  domain: string;
  onDomainChange: (d: string) => void;
  aliasPrefix: string;
  onAliasChange: (a: string) => void;
  primaryEmail: string;
  onPrimaryEmailChange: (p: string) => void;
  onOpenWebmail: () => void;
}

export const GoDaddyHero: React.FC<GoDaddyHeroProps> = ({
  domain,
  onDomainChange,
  aliasPrefix,
  onAliasChange,
  primaryEmail,
  onPrimaryEmailChange,
  onOpenWebmail,
}) => {
  const [tempDomain, setTempDomain] = useState(domain || 'mybranddomain.com');
  const [tempAlias, setTempAlias] = useState(aliasPrefix || 'contact');
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempDomain.trim()) return;
    onDomainChange(tempDomain.trim().toLowerCase());
    onAliasChange(tempAlias.trim().toLowerCase());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    onOpenWebmail();
  };

  return (
    <div className="bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="max-w-3xl">
          {/* Price badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-4">
            <span className="line-through text-neutral-400">Normally $6.00/mo</span>
            <span>•</span>
            <span className="text-emerald-700 font-extrabold">$0.00 / Free Forever</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight leading-[1.15]">
            Professional Email for Your Domain. Free.
          </h1>
          <p className="mt-3 text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
            Look professional with <strong className="text-neutral-900 font-semibold">{tempAlias}@{tempDomain}</strong> that forwards all incoming mail directly to your personal Gmail. Send and reply with <span className="text-neutral-900 font-medium">zero watermarks or company logos</span>.
          </p>
        </div>

        {/* GoDaddy-style prominent domain input bar */}
        <form onSubmit={handleSubmit} className="mt-8 max-w-3xl">
          <div className="p-2 sm:p-2.5 bg-neutral-100 rounded-2xl border border-neutral-300 shadow-sm flex flex-col sm:flex-row items-stretch gap-2">
            {/* Alias box */}
            <div className="w-full sm:w-1/3 bg-white rounded-xl border border-neutral-300 px-3 py-2 flex items-center">
              <Mail className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
              <input
                type="text"
                value={tempAlias}
                onChange={(e) => setTempAlias(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))}
                placeholder="contact"
                className="w-full text-sm font-semibold text-neutral-900 focus:outline-none font-mono"
              />
              <span className="text-xs text-neutral-400 font-mono">@</span>
            </div>

            {/* Domain box */}
            <div className="w-full sm:flex-1 bg-white rounded-xl border border-neutral-300 px-3 py-2 flex items-center">
              <Globe className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
              <input
                type="text"
                value={tempDomain}
                onChange={(e) => setTempDomain(e.target.value.toLowerCase().trim())}
                placeholder="yourdomain.com"
                className="w-full text-sm font-semibold text-neutral-900 focus:outline-none font-mono"
              />
            </div>

            {/* Connect / Open button */}
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#00838C] hover:bg-[#006f77] text-white font-bold text-sm tracking-wide transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 shrink-0"
            >
              <span>{isSaved ? 'Address Connected!' : 'Open Custom Email'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Forwarding destination prompt */}
          <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-neutral-600 gap-2 px-1">
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 font-medium">Forwards to:</span>
              <input
                type="email"
                value={primaryEmail}
                onChange={(e) => onPrimaryEmailChange(e.target.value.trim())}
                placeholder="you@gmail.com"
                className="px-2 py-0.5 rounded bg-white border border-neutral-300 text-neutral-900 font-semibold focus:outline-none focus:ring-1 focus:ring-[#00838C]"
              />
            </div>
            <div className="flex items-center gap-4 text-neutral-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> No credit card required
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Clean unbranded emails
              </span>
            </div>
          </div>
        </form>

        {/* 3 Value Pillars */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-neutral-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-[#00838C] flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-900">Open &amp; Use Free Webmail</h3>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Send and receive emails immediately with zero setup required. Test inbound delivery and compose outbound mail freely.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-900">Zero Watermarks or Logos</h3>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                All sent and forwarded messages contain only your clean text, professional headers, and domain name.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-900">Works with Your Gmail</h3>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Connect once to Gmail’s &quot;Send mail as&quot; alias feature so you can reply from your phone or laptop displaying your domain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
