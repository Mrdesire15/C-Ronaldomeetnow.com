import React, { useState } from 'react';
import {
  X,
  Activity,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Globe,
  ShieldCheck,
  Copy,
  Check,
} from 'lucide-react';
import { DnsCheckResult, RelayProvider } from '../types';
import { getSpfRecord, getDkimRecord, getDmarcRecord } from '../data/guides';

interface DnsHealthCheckerProps {
  isOpen: boolean;
  onClose: () => void;
  domain: string;
  selectedRelay: RelayProvider;
  onLiveCheck: (domain: string) => Promise<DnsCheckResult | null>;
  dnsResult: DnsCheckResult | null;
  checkingDns: boolean;
}

export const DnsHealthChecker: React.FC<DnsHealthCheckerProps> = ({
  isOpen,
  onClose,
  domain: initialDomain,
  selectedRelay,
  onLiveCheck,
  dnsResult,
  checkingDns,
}) => {
  const [domainInput, setDomainInput] = useState(initialDomain || 'example.com');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunCheck = () => {
    if (!domainInput.trim()) return;
    onLiveCheck(domainInput.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Live DNS Health &amp; Inboxing Diagnostic</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Real-time Query
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Direct lookup of MX, SPF, DKIM, and DMARC across authoritative nameservers.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Domain bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Globe className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="yourdomain.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <button
              onClick={handleRunCheck}
              disabled={checkingDns || !domainInput}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingDns ? 'animate-spin' : ''}`} />
              <span>{checkingDns ? 'Querying...' : 'Scan DNS'}</span>
            </button>
          </div>

          {/* Results Checklist */}
          {dnsResult ? (
            <div className="space-y-4">
              {/* Overall Summary Score */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Domain Under Inspection:</span>
                  <p className="text-sm font-bold font-mono text-white">{dnsResult.domain}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Cloudflare Readiness:</span>
                  <p className="text-xs font-bold text-emerald-400">
                    {dnsResult.isCloudflareMx ? 'Inbound Active' : 'Pending Inbound MX'}
                  </p>
                </div>
              </div>

              {/* 1. MX Records */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-200">1. MX Records (Inbound)</span>
                    {dnsResult.isCloudflareMx ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Cloudflare Detected
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Missing or Non-Cloudflare
                      </span>
                    )}
                  </div>
                </div>
                {dnsResult.mx.length > 0 ? (
                  <div className="space-y-1">
                    {dnsResult.mx.map((m, i) => (
                      <div key={i} className="flex justify-between text-xs font-mono text-slate-300 bg-slate-900/60 px-2.5 py-1.5 rounded">
                        <span>{m.exchange}</span>
                        <span className="text-slate-500">Priority: {m.priority}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No MX records returned by DNS resolver.</p>
                )}
              </div>

              {/* 2. SPF Record */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-200">2. SPF TXT Record</span>
                    {dnsResult.spf.found ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        SPF Present
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                        Missing SPF
                      </span>
                    )}
                  </div>
                </div>
                {dnsResult.spf.raw ? (
                  <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800/80 font-mono text-xs text-slate-200 break-all select-all flex items-center justify-between gap-2">
                    <span>{dnsResult.spf.raw}</span>
                    <button
                      onClick={() => handleCopy(dnsResult.spf.raw || '', 'spf-copy')}
                      className="p-1 text-slate-400 hover:text-white shrink-0"
                    >
                      {copiedKey === 'spf-copy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 space-y-1">
                    <p>Add this TXT record to authorize Cloudflare and {selectedRelay}:</p>
                    <code className="block p-2 rounded bg-slate-900 font-mono text-blue-400">
                      {getSpfRecord(domainInput, selectedRelay).value}
                    </code>
                  </div>
                )}
              </div>

              {/* 3. DMARC */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-200">3. DMARC Policy (_dmarc)</span>
                    {dnsResult.dmarc.found ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Protected
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-700 text-slate-300">
                        Recommended
                      </span>
                    )}
                  </div>
                </div>
                {dnsResult.dmarc.raw ? (
                  <div className="p-2.5 rounded bg-slate-900/60 font-mono text-xs text-slate-200 break-all">
                    {dnsResult.dmarc.raw}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 space-y-1">
                    <p>Recommended standard policy to prevent email spoofing:</p>
                    <code className="block p-2 rounded bg-slate-900 font-mono text-slate-300 text-[11px]">
                      {getDmarcRecord(domainInput).value}
                    </code>
                  </div>
                )}
              </div>

              {/* 4. DKIM */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-200">4. DKIM Signature Key</span>
                    {dnsResult.dkim.found ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Key Detected ({dnsResult.dkim.selector})
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-700 text-slate-300">
                        Configured in Relay Dashboard
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  DKIM keys are generated when you add your domain in your {selectedRelay.toUpperCase()} dashboard.
                  Once verified, your outbound emails will carry cryptographic proof of authenticity.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Click &quot;Scan DNS&quot; above to inspect live records for this domain.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
