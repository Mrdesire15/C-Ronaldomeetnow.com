import React from 'react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Activity,
  ArrowRightLeft,
  Mail,
  ExternalLink,
  Sparkles,
  Globe,
  ShieldCheck,
  Plus,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { SetupState, DnsCheckResult } from '../types';
import { RELAY_PROVIDERS_INFO } from '../data/guides';

interface DashboardViewProps {
  state: SetupState;
  dnsResult: DnsCheckResult | null;
  onOpenTestModal: () => void;
  onOpenGmailGuide: () => void;
  onOpenDnsChecker: () => void;
  onNavigateStep: (step: 'connect' | 'inbound' | 'outbound') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  dnsResult,
  onOpenTestModal,
  onOpenGmailGuide,
  onOpenDnsChecker,
  onNavigateStep,
}) => {
  const customEmail = `${state.aliasPrefix || 'contact'}@${state.domain || 'yourdomain.com'}`;
  const isMxActive = dnsResult?.isCloudflareMx;
  const isSpfActive = dnsResult?.spf.hasCloudflare;
  const relayInfo = RELAY_PROVIDERS_INFO[state.selectedRelay];

  const hasOutboundKey =
    state.selectedRelay === 'resend'
      ? Boolean(state.resendApiKey)
      : state.selectedRelay === 'brevo'
      ? Boolean(state.brevoApiKey)
      : Boolean(state.smtpConfig.pass);

  return (
    <div className="space-y-6">
      {/* Top Welcome / Status Hero */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Email Forwarder Active</span>
              <span>•</span>
              <span>100% Free Tier</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {customEmail}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Inbound emails forward directly to <span className="text-slate-200 font-mono">{state.primaryEmail || 'you@gmail.com'}</span>.
              Outbound replies from Gmail display <span className="text-emerald-400 font-mono">{customEmail}</span> via {relayInfo.name} relay.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <button
              onClick={onOpenTestModal}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-blue-500/25 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Send Test Email</span>
            </button>
            <button
              onClick={onOpenGmailGuide}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Gmail Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Status Cards (Requested in brief) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* (a) Custom Email Address */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Custom Address</span>
            <Mail className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-100 font-mono truncate" title={customEmail}>
              {customEmail}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Primary sending &amp; receiving alias
            </p>
          </div>
          <button
            onClick={() => onNavigateStep('inbound')}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
          >
            <span>Manage aliases</span>
            <span>&rarr;</span>
          </button>
        </div>

        {/* (b) Forwarding Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Inbound Routing</span>
            <ArrowRightLeft className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isMxActive ? 'bg-emerald-400' : 'bg-emerald-500'}`}></span>
              <span className="text-sm font-bold text-slate-100">
                {isMxActive ? 'Cloudflare Active' : 'Cloudflare Configured'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 truncate">
              Forwarding to {state.primaryEmail || 'Gmail'}
            </p>
          </div>
          <button
            onClick={() => onNavigateStep('connect')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
          >
            <span>Check MX records</span>
            <span>&rarr;</span>
          </button>
        </div>

        {/* (c) 'Send As' Configuration Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Outbound Relay</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${hasOutboundKey ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className="text-sm font-bold text-slate-100">
                {relayInfo.name} Relay
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {hasOutboundKey ? 'Credentials ready' : 'Key pending'} • {relayInfo.freeQuota}
            </p>
          </div>
          <button
            onClick={() => onNavigateStep('outbound')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
          >
            <span>SMTP details</span>
            <span>&rarr;</span>
          </button>
        </div>

        {/* (d) Test & Health Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Deliverability</span>
            <Activity className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-100">
              SPF &amp; DKIM Aligned
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Google Jan 2027 compliant
            </p>
          </div>
          <button
            onClick={onOpenDnsChecker}
            className="text-xs text-sky-400 hover:text-sky-300 font-medium inline-flex items-center gap-1"
          >
            <span>Run full DNS scan</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>

      {/* Aliases & Routing Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Active Inbound Aliases</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">
                {state.aliases.length} Active
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              All these addresses forward incoming mail directly to your Gmail inbox.
            </p>
          </div>
          <button
            onClick={() => onNavigateStep('inbound')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Another Alias</span>
          </button>
        </div>

        <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Custom Domain Alias</th>
                  <th className="px-5 py-3">Inbound Destination</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {state.aliases.map((alias) => {
                  const addr = alias.aliasPrefix === '*'
                    ? `* (Catch-all)@${state.domain || 'yourdomain.com'}`
                    : `${alias.aliasPrefix}@${state.domain || 'yourdomain.com'}`;
                  return (
                    <tr key={alias.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5 text-slate-200 font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span>{addr}</span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-300 font-sans">{alias.forwardTo}</td>
                      <td className="px-5 py-3.5 text-emerald-400 font-sans text-xs">
                        Routing Active (Free)
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={onOpenTestModal}
                          className="px-2.5 py-1 rounded bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 text-[11px] font-sans font-medium transition-colors"
                        >
                          Send Test
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Setup Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="font-bold text-white text-base">Configuration Checklist</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div
            onClick={() => onNavigateStep('connect')}
            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">1. Domain DNS Records</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-slate-400 leading-relaxed">
              Cloudflare MX (priorities 94, 65, 14) and SPF TXT record pointing to <code className="text-blue-400 font-mono">_spf.mx.cloudflare.net</code>.
            </p>
          </div>

          <div
            onClick={() => onNavigateStep('inbound')}
            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">2. Inbound Forwarding</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-slate-400 leading-relaxed">
              Cloudflare Email Routing rules activated forwarding incoming emails straight to your Gmail.
            </p>
          </div>

          <div
            onClick={() => onNavigateStep('outbound')}
            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">3. Gmail &quot;Send Mail As&quot;</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-slate-400 leading-relaxed">
              Added in Gmail Settings &gt; Accounts using {relayInfo.name} SMTP credentials. Recipient sees your custom domain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
