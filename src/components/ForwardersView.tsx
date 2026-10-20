import React, { useState } from 'react';
import {
  ArrowRightLeft,
  Plus,
  Trash2,
  Copy,
  Check,
  ShieldCheck,
  CheckCircle2,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { ForwardingAlias } from '../types';

interface ForwardersViewProps {
  domain: string;
  primaryEmail: string;
  aliases: ForwardingAlias[];
  onAddAlias: (prefix: string, forwardTo: string) => void;
  onRemoveAlias: (id: string) => void;
  onOpenCompose: (to?: string) => void;
}

export const ForwardersView: React.FC<ForwardersViewProps> = ({
  domain,
  primaryEmail,
  aliases,
  onAddAlias,
  onRemoveAlias,
  onOpenCompose,
}) => {
  const [newPrefix, setNewPrefix] = useState('');
  const [newDestination, setNewDestination] = useState(primaryEmail || 'you@gmail.com');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrefix.trim() || !newDestination.trim()) return;
    onAddAlias(newPrefix.trim().toLowerCase(), newDestination.trim().toLowerCase());
    setNewPrefix('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-black text-neutral-900 tracking-tight">
                Active Email Forwarders
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                {aliases.length} / 200 Free
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600">
              Emails sent to these addresses on <strong className="text-neutral-900 font-mono">{domain || 'yourdomain.com'}</strong> will be forwarded instantly to your destination inbox.
            </p>
          </div>

          <a
            href="https://dash.cloudflare.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs border border-neutral-300 transition-colors self-start sm:self-auto"
          >
            <span>Cloudflare Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Add Forwarder Form */}
        <form onSubmit={handleSubmit} className="mt-6 p-4 bg-neutral-50 rounded-xl border border-neutral-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-5">
            <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
              Custom Email Prefix
            </label>
            <div className="flex items-center bg-white border border-neutral-300 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-[#00838C]">
              <input
                type="text"
                value={newPrefix}
                onChange={(e) => setNewPrefix(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))}
                placeholder="contact, hello, sales, *"
                className="w-full px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-none"
              />
              <span className="px-2.5 py-2 text-xs font-mono text-neutral-500 bg-neutral-100 border-l border-neutral-200 shrink-0">
                @{domain || 'yourdomain.com'}
              </span>
            </div>
          </div>

          <div className="sm:col-span-5">
            <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
              Forwards To (Destination Inbox)
            </label>
            <input
              type="email"
              value={newDestination}
              onChange={(e) => setNewDestination(e.target.value)}
              placeholder="you@gmail.com"
              className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#00838C]"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-lg bg-[#00838C] hover:bg-[#006f77] text-white font-bold text-xs tracking-wide shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Forwarder</span>
            </button>
          </div>
        </form>

        {/* Quick Presets */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-neutral-500 font-medium">Suggestions:</span>
          {['contact', 'hello', 'support', 'billing', 'info', '*'].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setNewPrefix(p)}
              className="px-2 py-0.5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] font-mono border border-neutral-200 transition-colors"
            >
              {p === '*' ? '* (Catch-All)' : `${p}@`}
            </button>
          ))}
        </div>
      </div>

      {/* Forwarders Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Custom Alias</th>
                <th className="px-5 py-3.5">Inbound Forwarding Target</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-sans">
              {aliases.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-neutral-400 text-xs">
                    No forwarders created yet. Add your first address above.
                  </td>
                </tr>
              ) : (
                aliases.map((alias) => {
                  const fullAddr =
                    alias.aliasPrefix === '*'
                      ? `* (Catch-all)@${domain}`
                      : `${alias.aliasPrefix}@${domain}`;
                  return (
                    <tr key={alias.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-neutral-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>{fullAddr}</span>
                      </td>
                      <td className="px-5 py-3.5 text-neutral-600 font-medium">{alias.forwardTo}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Active (Free)
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleCopy(fullAddr, alias.id)}
                            className="p-1.5 rounded hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors"
                            title="Copy address"
                          >
                            {copiedId === alias.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => onOpenCompose(fullAddr)}
                            className="px-2.5 py-1 rounded bg-[#00838C]/10 hover:bg-[#00838C]/20 text-[#00838C] text-[11px] font-bold transition-colors"
                          >
                            Send Test
                          </button>
                          <button
                            onClick={() => onRemoveAlias(alias.id)}
                            className="p-1.5 rounded hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
  );
};
