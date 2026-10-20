import React, { useState } from 'react';
import {
  Globe,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Server,
  ArrowRight,
  Info,
} from 'lucide-react';
import { CLOUDFLARE_MX_RECORDS, getSpfRecord, REGISTRAR_STEPS } from '../data/guides';
import { DnsRecord, DnsCheckResult, RelayProvider } from '../types';

interface Step1DomainProps {
  domain: string;
  onDomainChange: (val: string) => void;
  primaryEmail: string;
  onPrimaryEmailChange: (val: string) => void;
  selectedRelay: RelayProvider;
  onProceed: () => void;
  onLiveCheck: (domain: string) => Promise<DnsCheckResult | null>;
  dnsResult: DnsCheckResult | null;
  checkingDns: boolean;
}

export const Step1Domain: React.FC<Step1DomainProps> = ({
  domain,
  onDomainChange,
  primaryEmail,
  onPrimaryEmailChange,
  selectedRelay,
  onProceed,
  onLiveCheck,
  dnsResult,
  checkingDns,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedRegistrar, setSelectedRegistrar] = useState<number>(0);
  const [showRegistrarHelp, setShowRegistrarHelp] = useState<boolean>(false);
  const [verificationToken] = useState(() => 'cf-mail-' + Math.random().toString(36).substring(2, 10));

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleVerify = () => {
    if (!domain) return;
    onLiveCheck(domain);
  };

  const mxRecords = CLOUDFLARE_MX_RECORDS(domain);
  const spfRecord = getSpfRecord(domain, selectedRelay);

  const verificationRecord: DnsRecord = {
    type: 'TXT',
    name: '@',
    value: `mailrelay-verification=${verificationToken}`,
    purpose: 'Domain Verification',
    priority: undefined,
  };

  const allRecords: DnsRecord[] = [
    ...mxRecords,
    spfRecord,
    verificationRecord,
  ];

  const isMxVerified = dnsResult?.isCloudflareMx;
  const isSpfVerified = dnsResult?.spf.hasCloudflare;
  const isNsDelegated = dnsResult?.isCloudflareNs;

  return (
    <div className="space-y-6">
      {/* Intro Hero card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
            <span>Step 1 of 3</span>
            <span>•</span>
            <span>Zero Cost Forever</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Connect Your Custom Domain & Inbound DNS
          </h1>
          <p className="mt-2 text-slate-400 text-sm sm:text-base leading-relaxed">
            Enter the domain you own (e.g. <span className="text-blue-400 font-mono">yourbrand.com</span>) and your personal Gmail.
            We will generate the exact free Cloudflare Email Routing records to deliver incoming mail directly to your Gmail inbox.
          </p>
        </div>

        {/* Inputs */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Custom Domain (You Own)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Globe className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={domain}
                onChange={(e) => onDomainChange(e.target.value.toLowerCase().trim())}
                placeholder="example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Enter root domain (e.g. <span className="text-slate-400">mywebsite.com</span> or subdomain <span className="text-slate-400">mail.mywebsite.com</span>).
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Destination Gmail Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Server className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={primaryEmail}
                onChange={(e) => onPrimaryEmailChange(e.target.value.trim())}
                placeholder="you@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Where all incoming emails to your custom domain will land.
            </p>
          </div>
        </div>

        {/* Live Check Button & Status Banner */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={handleVerify}
              disabled={!domain || checkingDns}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide transition-all shadow-md shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingDns ? 'animate-spin' : ''}`} />
              <span>{checkingDns ? 'Querying Public DNS...' : 'Verify Live DNS Propagation'}</span>
            </button>
            <span className="text-xs text-slate-400">
              Direct verification via Google DNS & Node resolver
            </span>
          </div>

          {dnsResult && (
            <div className="flex items-center gap-2 text-xs">
              {isMxVerified ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Cloudflare MX Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> DNS Propagating / Missing MX
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Live Verification Diagnostic Bar */}
      {dnsResult && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200">Live DNS Scan for {dnsResult.domain}</span>
            <span className="text-slate-500 text-[11px]">Checked: {new Date(dnsResult.timestamp).toLocaleTimeString()}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={`p-3 rounded-lg border ${isNsDelegated ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-slate-800/40 border-slate-700/60 text-slate-300'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-[11px]">Nameservers</span>
                {isNsDelegated ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Info className="w-3.5 h-3.5 text-slate-400" />}
              </div>
              <p className="font-mono text-[10px] truncate">
                {dnsResult.ns.length > 0 ? dnsResult.ns.slice(0, 2).join(', ') : 'No NS detected yet'}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                {isNsDelegated ? 'Cloudflare Nameservers active' : 'Third-party DNS / Registrar'}
              </p>
            </div>

            <div className={`p-3 rounded-lg border ${isMxVerified ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-amber-950/20 border-amber-500/30 text-amber-300'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-[11px]">MX Inbound Routing</span>
                {isMxVerified ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
              </div>
              <p className="font-mono text-[10px] truncate">
                {dnsResult.mx.length > 0 ? dnsResult.mx.map(m => m.exchange).slice(0, 2).join(', ') : 'No MX records found'}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                {isMxVerified ? 'Cloudflare Inbound Ready' : 'Add Cloudflare MX records below'}
              </p>
            </div>

            <div className={`p-3 rounded-lg border ${isSpfVerified ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-amber-950/20 border-amber-500/30 text-amber-300'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-[11px]">SPF Authentication</span>
                {isSpfVerified ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
              </div>
              <p className="font-mono text-[10px] truncate">
                {dnsResult.spf.raw || 'No SPF TXT record'}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                {isSpfVerified ? 'SPF includes Cloudflare' : 'Update SPF TXT record'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Copy-Paste DNS Records Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Required DNS Records for</span>
              <span className="text-blue-400 font-mono text-base">{domain || 'yourdomain.com'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Add these records in your DNS manager (Cloudflare, Namecheap, GoDaddy, Porkbun, etc.) to activate free email forwarding.
            </p>
          </div>
          <button
            onClick={() => {
              const text = allRecords.map(r => `${r.type}\t${r.name}\t${r.value}\t${r.priority ?? ''}`).join('\n');
              copyToClipboard(text, 'all-dns');
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 self-start sm:self-auto"
          >
            {copiedKey === 'all-dns' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy All Records</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Host / Name</th>
                <th className="px-6 py-3.5">Priority</th>
                <th className="px-6 py-3.5">Value / Destination</th>
                <th className="px-6 py-3.5">Purpose</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {allRecords.map((record, index) => {
                const key = `rec-${index}`;
                return (
                  <tr key={key} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        record.type === 'MX' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                        record.type === 'TXT' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' :
                        'bg-amber-500/20 text-amber-300'
                      }`}>
                        {record.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-200 font-semibold">{record.name}</td>
                    <td className="px-6 py-4 text-slate-400">{record.priority !== undefined ? record.priority : '—'}</td>
                    <td className="px-6 py-4 text-slate-300 max-w-xs sm:max-w-md truncate font-sans text-xs">
                      <span className="font-mono bg-slate-950 px-2 py-1 rounded border border-slate-800 text-slate-200 select-all">
                        {record.value}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-sans text-xs">{record.purpose}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => copyToClipboard(record.value, key)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Copy record value"
                      >
                        {copiedKey === key ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-[11px] text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span className="text-[11px]">Copy</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-950/40 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>* DNS changes usually take 1 to 5 minutes to propagate (up to 24h in rare cases).</span>
          <span className="text-emerald-400 font-semibold">100% Free Tier Supported</span>
        </div>
      </div>

      {/* Registrar Walkthrough Collapsible */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowRegistrarHelp(!showRegistrarHelp)}
          className="w-full p-5 text-left flex items-center justify-between hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Where is your domain registered? (GoDaddy, Namecheap, etc.)</h3>
              <p className="text-xs text-slate-400">Click to view step-by-step instructions for adding records or delegating nameservers</p>
            </div>
          </div>
          {showRegistrarHelp ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {showRegistrarHelp && (
          <div className="p-6 border-t border-slate-800 bg-slate-950/30 space-y-6">
            {/* Tabs for registrars */}
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
              {REGISTRAR_STEPS.map((reg, idx) => (
                <button
                  key={reg.name}
                  onClick={() => setSelectedRegistrar(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedRegistrar === idx
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {reg.name}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-200">{REGISTRAR_STEPS[selectedRegistrar].name} Guide</h4>
                <span className="text-xs text-slate-400">{REGISTRAR_STEPS[selectedRegistrar].summary}</span>
              </div>
              <ol className="space-y-2.5 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
                {REGISTRAR_STEPS[selectedRegistrar].steps.map((st, i) => (
                  <li key={i} className="pl-1">
                    <span className="text-slate-200">{st}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* Next step button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onProceed}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all"
        >
          <span>Continue to Step 2: Inbound Forwarding</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
