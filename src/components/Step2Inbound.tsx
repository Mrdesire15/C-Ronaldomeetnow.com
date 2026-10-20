import React, { useState } from 'react';
import {
  ArrowRightLeft,
  CheckCircle2,
  ExternalLink,
  Plus,
  Trash2,
  Copy,
  Check,
  ShieldCheck,
  Key,
  ArrowRight,
  HelpCircle,
  MailCheck,
} from 'lucide-react';
import { ForwardingAlias } from '../types';

interface Step2InboundProps {
  domain: string;
  primaryEmail: string;
  aliases: ForwardingAlias[];
  onAddAlias: (prefix: string, forwardTo: string) => void;
  onRemoveAlias: (id: string) => void;
  onToggleAlias: (id: string) => void;
  onProceed: () => void;
  onBack: () => void;
}

export const Step2Inbound: React.FC<Step2InboundProps> = ({
  domain,
  primaryEmail,
  aliases,
  onAddAlias,
  onRemoveAlias,
  onToggleAlias,
  onProceed,
  onBack,
}) => {
  const [newPrefix, setNewPrefix] = useState('contact');
  const [newDestination, setNewDestination] = useState(primaryEmail || 'you@gmail.com');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrefix.trim() || !newDestination.trim()) return;
    onAddAlias(newPrefix.trim().toLowerCase(), newDestination.trim().toLowerCase());
    setNewPrefix('');
  };

  return (
    <div className="space-y-6">
      {/* Intro Hero */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
            <span>Step 2 of 3</span>
            <span>•</span>
            <span>Inbound Routing (Free)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Configure Cloudflare Free Email Routing
          </h1>
          <p className="mt-2 text-slate-400 text-sm sm:text-base leading-relaxed">
            Cloudflare provides <strong>100% free inbound email forwarding</strong> for up to 200 custom aliases per domain.
            Incoming emails sent to <span className="text-blue-400 font-mono">contact@{domain || 'yourdomain.com'}</span> will be forwarded instantly to your Gmail inbox.
          </p>
        </div>

        {/* 3 Steps Visual Guide */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 relative">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm mb-3">
              1
            </div>
            <h3 className="font-bold text-slate-200 text-sm mb-1">Enable Email Routing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Open your Cloudflare dashboard, select <span className="text-slate-300 font-mono">{domain || 'yourdomain.com'}</span>, and click <strong>Email Routing</strong> in the left sidebar. Click <strong>Get Started</strong>.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 relative">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-sm mb-3">
              2
            </div>
            <h3 className="font-bold text-slate-200 text-sm mb-1">Verify Destination Address</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              In <strong>Destination addresses</strong>, add your Gmail: <span className="text-indigo-300 font-mono">{primaryEmail || 'you@gmail.com'}</span>. Check your Gmail inbox and click Cloudflare's 1-click verification link.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 relative">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm mb-3">
              3
            </div>
            <h3 className="font-bold text-slate-200 text-sm mb-1">Add Routing Rules</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Under <strong>Routing rules</strong>, click <strong>Create rule</strong>. Set custom address to <span className="text-emerald-300 font-mono">contact</span> and forward to your verified Gmail address.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cloudflare guarantees zero spam storage and privacy-first forwarding without altering body headers.</span>
          </div>
          <a
            href="https://dash.cloudflare.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <span>Open Cloudflare Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Aliases Manager Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Configured Email Forwarding Aliases</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">
                {aliases.length} / 200 Free
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Any email sent to these custom aliases will be automatically forwarded to your Gmail inbox.
            </p>
          </div>
        </div>

        {/* Add Alias Form */}
        <form onSubmit={handleAddSubmit} className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Custom Alias Prefix
            </label>
            <div className="flex items-center rounded-xl bg-slate-950 border border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
              <input
                type="text"
                value={newPrefix}
                onChange={(e) => setNewPrefix(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))}
                placeholder="contact, hello, support, *"
                className="w-full px-3.5 py-2.5 bg-transparent text-slate-100 placeholder-slate-500 text-sm font-mono focus:outline-none"
              />
              <span className="pr-3 text-xs text-slate-400 font-mono bg-slate-900/50 py-2.5 px-2 border-l border-slate-800">
                @{domain || 'yourdomain.com'}
              </span>
            </div>
          </div>

          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Forward Incoming Mail To
            </label>
            <input
              type="email"
              value={newDestination}
              onChange={(e) => setNewDestination(e.target.value)}
              placeholder="you@gmail.com"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Alias</span>
            </button>
          </div>
        </form>

        {/* Preset quick buttons */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-500">Quick presets:</span>
          {['contact', 'hello', 'support', 'newsletter', 'billing', '*'].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setNewPrefix(preset)}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-mono border border-slate-700 transition-colors"
            >
              {preset === '*' ? '* (Catch-All)' : `${preset}@`}
            </button>
          ))}
        </div>

        {/* Aliases Table */}
        <div className="mt-6 border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Custom Email Address</th>
                  <th className="px-5 py-3">Target Forwarding Inbox</th>
                  <th className="px-5 py-3">Cloudflare Rule</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {aliases.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-slate-500 font-sans text-xs">
                      No aliases added yet. Add your first address above (e.g. contact@{domain || 'yourdomain.com'}).
                    </td>
                  </tr>
                ) : (
                  aliases.map((alias) => {
                    const fullAddress = alias.aliasPrefix === '*'
                      ? `* (Catch-all)@${domain || 'yourdomain.com'}`
                      : `${alias.aliasPrefix}@${domain || 'yourdomain.com'}`;
                    return (
                      <tr key={alias.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-3.5 text-slate-200 font-semibold flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          <span>{fullAddress}</span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-300 font-sans">{alias.forwardTo}</td>
                        <td className="px-5 py-3.5 text-slate-400 font-sans text-[11px]">
                          Custom Address Rule → Send to verified destination
                        </td>
                        <td className="px-5 py-3.5 text-right flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleCopy(fullAddress, alias.id)}
                            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                            title="Copy email address"
                          >
                            {copiedText === alias.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => onRemoveAlias(alias.id)}
                            className="p-1.5 rounded hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                            title="Delete alias"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors border border-slate-700"
        >
          Back to Step 1: DNS
        </button>

        <button
          onClick={onProceed}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all"
        >
          <span>Continue to Step 3: Outbound "Send As" Relay</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
