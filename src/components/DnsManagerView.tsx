import React, { useState } from 'react';
import {
  Globe,
  Copy,
  Check,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Server,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Zap,
} from 'lucide-react';
import { CLOUDFLARE_MX_RECORDS, getSpfRecord, getDkimRecord, getDmarcRecord, REGISTRAR_STEPS } from '../data/guides';
import { DnsRecord, DnsCheckResult, RelayProvider } from '../types';

interface DnsManagerViewProps {
  domain: string;
  selectedRelay: RelayProvider;
  onLiveCheck: (domain: string) => Promise<DnsCheckResult | null>;
  dnsResult: DnsCheckResult | null;
  checkingDns: boolean;
  onOpenCloudflareWizard: () => void;
}

export const DnsManagerView: React.FC<DnsManagerViewProps> = ({
  domain,
  selectedRelay,
  onLiveCheck,
  dnsResult,
  checkingDns,
  onOpenCloudflareWizard,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedRegistrar, setSelectedRegistrar] = useState(0);
  const [showRegistrarHelp, setShowRegistrarHelp] = useState(false);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const mxRecords = CLOUDFLARE_MX_RECORDS(domain);
  const spfRecord = getSpfRecord(domain, selectedRelay);
  const dkimRecord = getDkimRecord(domain, selectedRelay);
  const dmarcRecord = getDmarcRecord(domain);

  const allRecords: DnsRecord[] = [
    ...mxRecords,
    spfRecord,
    dkimRecord,
    dmarcRecord,
  ];

  const isMxActive = dnsResult?.isCloudflareMx;
  const isSpfActive = dnsResult?.spf.hasCloudflare;

  return (
    <div className="space-y-6">
      {/* 1-Click Automated Cloudflare Push Banner */}
      <div className="bg-gradient-to-r from-[#111111] via-neutral-900 to-[#0b2427] text-white rounded-2xl p-6 sm:p-7 border border-neutral-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#00838C]/30 text-teal-300 border border-[#00838C]/40 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>1-Click Automation</span>
          </div>
          <h3 className="text-xl font-black tracking-tight text-white">
            Automated Cloudflare DNS Configuration Wizard
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Skip manual copy-pasting. Provide your Cloudflare API token to automatically push all 3 MX records and smart-merged SPF records directly to your Cloudflare account in seconds.
          </p>
        </div>

        <button
          onClick={onOpenCloudflareWizard}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#00838C] hover:bg-[#00a4a6] text-white font-bold text-xs tracking-wide shadow-md transition-all active:scale-95 shrink-0"
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>Launch Cloudflare Wizard</span>
        </button>
      </div>

      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-black text-neutral-900 tracking-tight">
                DNS Management for {domain || 'yourdomain.com'}
              </h2>
              {dnsResult && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  isMxActive ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {isMxActive ? 'Cloudflare MX Verified' : 'DNS Propagating'}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-neutral-600">
              Add these standard records in your domain registrar (GoDaddy, Namecheap, Cloudflare, Porkbun, etc.) to route incoming mail to Gmail.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => onLiveCheck(domain)}
              disabled={checkingDns || !domain}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00838C] hover:bg-[#006f77] text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingDns ? 'animate-spin' : ''}`} />
              <span>{checkingDns ? 'Querying DNS...' : 'Verify Live DNS'}</span>
            </button>

            <button
              onClick={() => {
                const text = allRecords.map(r => `${r.type}\t${r.name}\t${r.value}\t${r.priority ?? ''}`).join('\n');
                copy(text, 'copy-all');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs border border-neutral-300 transition-colors"
            >
              {copiedKey === 'copy-all' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy All Records</span>
            </button>
          </div>
        </div>

        {/* Live Scan Pill bar if scanned */}
        {dnsResult && (
          <div className="mt-5 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500 font-medium">Nameservers:</span>
              <span className="font-mono text-neutral-900 font-bold truncate max-w-[140px]">
                {dnsResult.ns.join(', ') || 'Third-Party'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500 font-medium">MX Routing:</span>
              <span className={`font-bold ${isMxActive ? 'text-emerald-700' : 'text-amber-700'}`}>
                {isMxActive ? 'Cloudflare Active' : 'Pending MX Update'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500 font-medium">SPF Status:</span>
              <span className={`font-bold ${isSpfActive ? 'text-emerald-700' : 'text-neutral-700'}`}>
                {isSpfActive ? 'SPF Valid' : 'Standard SPF'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* DNS Records Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Host / Name</th>
                <th className="px-5 py-3.5">Priority</th>
                <th className="px-5 py-3.5">Value / Target</th>
                <th className="px-5 py-3.5">Purpose</th>
                <th className="px-5 py-3.5 text-right">Copy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-sans">
              {allRecords.map((rec, i) => {
                const k = `dns-${i}`;
                return (
                  <tr key={k} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                        rec.type === 'MX' ? 'bg-purple-100 text-purple-800' : 'bg-sky-100 text-sky-800'
                      }`}>
                        {rec.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-neutral-900">{rec.name}</td>
                    <td className="px-5 py-3.5 text-neutral-500 font-mono">{rec.priority ?? '—'}</td>
                    <td className="px-5 py-3.5 font-mono text-neutral-800 max-w-xs sm:max-w-md truncate select-all">
                      {rec.value}
                    </td>
                    <td className="px-5 py-3.5 text-neutral-500">{rec.purpose}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => copy(rec.value, k)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition-colors"
                      >
                        {copiedKey === k ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === k ? 'Copied' : 'Copy'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registrar Guide Collapsible */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
        <button
          onClick={() => setShowRegistrarHelp(!showRegistrarHelp)}
          className="w-full p-5 text-left flex items-center justify-between hover:bg-neutral-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center font-bold">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-900">How to add these records in GoDaddy, Namecheap, etc.</h3>
              <p className="text-xs text-neutral-500">Click to view registrar-specific walkthroughs</p>
            </div>
          </div>
          {showRegistrarHelp ? <ChevronUp className="w-5 h-5 text-neutral-500" /> : <ChevronDown className="w-5 h-5 text-neutral-500" />}
        </button>

        {showRegistrarHelp && (
          <div className="p-6 border-t border-neutral-200 bg-neutral-50/50 space-y-4">
            <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-3">
              {REGISTRAR_STEPS.map((r, idx) => (
                <button
                  key={r.name}
                  onClick={() => setSelectedRegistrar(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedRegistrar === idx
                      ? 'bg-[#00838C] text-white shadow-sm'
                      : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100'
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>

            <ol className="space-y-2 text-xs text-neutral-700 list-decimal list-inside leading-relaxed">
              {REGISTRAR_STEPS[selectedRegistrar].steps.map((st, i) => (
                <li key={i} className="pl-1">
                  <span>{st}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};
