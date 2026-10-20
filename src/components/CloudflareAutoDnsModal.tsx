import React, { useState } from 'react';
import {
  X,
  Zap,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Lock,
  ArrowRight,
  Server,
  Key,
  Check,
} from 'lucide-react';
import { RelayProvider } from '../types';

interface CloudflareAutoDnsModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: string;
  selectedRelay: RelayProvider;
  cloudflareToken: string;
  onUpdateToken: (t: string) => void;
  onSuccessPush?: () => void;
}

export const CloudflareAutoDnsModal: React.FC<CloudflareAutoDnsModalProps> = ({
  isOpen,
  onClose,
  domain,
  selectedRelay,
  cloudflareToken,
  onUpdateToken,
  onSuccessPush,
}) => {
  const [tokenInput, setTokenInput] = useState(cloudflareToken || '');
  const [loading, setLoading] = useState(false);
  const [includeDmarc, setIncludeDmarc] = useState(true);
  const [step, setStep] = useState<'input' | 'pushing' | 'done'>('input');
  const [result, setResult] = useState<{
    success: boolean;
    recordsCreated?: any[];
    recordsUpdated?: any[];
    message?: string;
    error?: string;
    zone?: { id: string; name: string };
  } | null>(null);

  if (!isOpen) return null;

  const handleStartPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim() || !domain.trim()) return;

    setLoading(true);
    setStep('pushing');
    setResult(null);

    // Persist token in parent state
    onUpdateToken(tokenInput.trim());

    try {
      const res = await fetch('/api/cloudflare/auto-configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: tokenInput.trim(),
          domain: domain.trim(),
          relayProvider: selectedRelay,
          includeDmarc,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setResult({
          success: false,
          error: data.error || 'Failed to auto-configure Cloudflare DNS.',
        });
        setStep('input');
      } else {
        setResult({
          success: true,
          recordsCreated: data.recordsCreated,
          recordsUpdated: data.recordsUpdated,
          message: data.message,
          zone: data.zone,
        });
        setStep('done');
        if (onSuccessPush) onSuccessPush();
      }
    } catch (err: any) {
      setResult({
        success: false,
        error: err.message || 'Network error pushing to Cloudflare API',
      });
      setStep('input');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-neutral-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-[#111111] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00838C] text-white flex items-center justify-center font-bold">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">Automated Cloudflare DNS Wizard</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00838C]/30 text-teal-300 border border-[#00838C]/40">
                  1-Click Push
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Pushes all MX, SPF, and DMARC records automatically without manual copy-pasting.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {step === 'input' && (
            <form onSubmit={handleStartPush} className="space-y-5">
              {/* Domain & Target Banner */}
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-neutral-500 font-medium block">Target Domain:</span>
                  <span className="font-mono font-bold text-neutral-900 text-sm">{domain || 'yourdomain.com'}</span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-500 font-medium block">Relay Provider:</span>
                  <span className="font-bold text-[#00838C] uppercase">{selectedRelay}</span>
                </div>
              </div>

              {/* Records preview */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
                  Records to be automatically configured:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50/50 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold font-mono text-neutral-900">3x MX Records</span>
                      <p className="text-[11px] text-neutral-500 leading-tight">route1/2/3.mx.cloudflare.net</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50/50 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold font-mono text-neutral-900">TXT (SPF Record)</span>
                      <p className="text-[11px] text-neutral-500 leading-tight">Smart-merged with Cloudflare + {selectedRelay}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeDmarc}
                      onChange={(e) => setIncludeDmarc(e.target.checked)}
                      className="rounded text-[#00838C] focus:ring-[#00838C]"
                    />
                    <span className="font-medium">Also create anti-spoofing DMARC policy record (_dmarc)</span>
                  </label>
                </div>
              </div>

              {/* Token Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider">
                    Cloudflare API Token
                  </label>
                  <a
                    href="https://dash.cloudflare.com/profile/api-tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#00838C] hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Get API Token in Cloudflare</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="relative">
                  <Key className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="Paste Cloudflare API Token (e.g. 7q_8Kx...)"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#00838C]"
                  />
                </div>

                {/* 30-second token guide */}
                <div className="p-3 bg-neutral-100 rounded-xl text-[11px] text-neutral-600 space-y-1">
                  <span className="font-bold text-neutral-800">Quick 30-Second Token Guide:</span>
                  <p>
                    1. Click <a href="https://dash.cloudflare.com/profile/api-tokens" target="_blank" rel="noopener noreferrer" className="text-[#00838C] font-semibold underline">Cloudflare API Tokens</a> &gt; <strong>Create Token</strong>.
                  </p>
                  <p>
                    2. Use the <strong>&quot;Edit zone DNS&quot;</strong> template (select your domain in Zone Resources).
                  </p>
                  <p>
                    3. Copy and paste the generated token into the box above.
                  </p>
                </div>
              </div>

              {/* Error box */}
              {result && !result.success && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Configuration Failed</span>
                    <span>{result.error}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
                <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Token is used only to push these records and never saved permanently</span>
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !tokenInput}
                    className="px-5 py-2.5 rounded-xl bg-[#00838C] hover:bg-[#006f77] text-white font-bold text-xs tracking-wide shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Push to Cloudflare Now</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {step === 'pushing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <RefreshCw className="w-10 h-10 text-[#00838C] animate-spin" />
              <div>
                <h3 className="font-bold text-base text-neutral-900">
                  Communicating with Cloudflare API...
                </h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm">
                  Finding zone for {domain}, checking existing MX records, and pushing required email routing records.
                </p>
              </div>
            </div>
          )}

          {step === 'done' && result && result.success && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-base text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Cloudflare DNS Records Successfully Configured!</span>
                </div>
                <p className="text-xs text-emerald-800/90 leading-relaxed">
                  {result.message}
                </p>
              </div>

              {/* Records summary */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
                  Configured Records on {result.zone?.name || domain}:
                </span>

                <div className="border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100 text-xs">
                  {result.recordsCreated && result.recordsCreated.map((r, i) => (
                    <div key={i} className="p-3 flex items-center justify-between bg-white font-mono">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          CREATED {r.type}
                        </span>
                        <span className="text-neutral-900">{r.name}</span>
                      </div>
                      <span className="text-neutral-600 truncate max-w-xs">{r.content}</span>
                    </div>
                  ))}

                  {result.recordsUpdated && result.recordsUpdated.map((r, i) => (
                    <div key={i} className="p-3 flex items-center justify-between bg-white font-mono">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">
                          UPDATED {r.type}
                        </span>
                        <span className="text-neutral-900">{r.name}</span>
                      </div>
                      <span className="text-neutral-600 truncate max-w-xs">{r.content}</span>
                    </div>
                  ))}

                  {(!result.recordsCreated || result.recordsCreated.length === 0) &&
                    (!result.recordsUpdated || result.recordsUpdated.length === 0) && (
                      <div className="p-4 text-center text-neutral-500 font-sans">
                        All records were already verified and in sync on Cloudflare.
                      </div>
                    )}
                </div>
              </div>

              {/* Next step advice */}
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 leading-relaxed">
                <strong>Next Step:</strong> Open Cloudflare Dashboard &gt; Email &gt; Email Routing to ensure your destination email (Gmail) is verified, and you&apos;re ready to receive mail!
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-200">
                <a
                  href={`https://dash.cloudflare.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs border border-neutral-300 transition-colors flex items-center gap-1.5"
                >
                  <span>Open Cloudflare Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-[#00838C] hover:bg-[#006f77] text-white font-bold text-xs transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
