import React, { useState } from 'react';
import {
  X,
  Mail,
  Zap,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
  ArrowRight,
  Key,
  Sparkles,
  Inbox,
} from 'lucide-react';
import { SetupState } from '../types';

interface GmailDirectLinkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: SetupState;
  onUpdateState: (updates: Partial<SetupState>) => void;
  onOpenKeysGuide: () => void;
  onRefreshInbox?: () => void;
}

export const GmailDirectLinkerModal: React.FC<GmailDirectLinkerModalProps> = ({
  isOpen,
  onClose,
  state,
  onUpdateState,
  onOpenKeysGuide,
  onRefreshInbox,
}) => {
  const [method, setMethod] = useState<'relay' | 'google-app-password'>('relay');
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [status, setStatus] = useState<{
    success: boolean;
    message: string;
    code?: string;
    latencyMs?: number;
  } | null>(null);

  if (!isOpen) return null;

  const customEmail = `${state.aliasPrefix || 'contact'}@${state.domain || 'yourdomain.com'}`;
  const gmailAddress = state.primaryEmail || 'you@gmail.com';

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const payload: any = {
        method,
        gmailAddress: gmailAddress.trim(),
        customEmail,
        passwordOrKey:
          method === 'google-app-password'
            ? state.googleAppPassword || state.smtpConfig.pass
            : state.selectedRelay === 'resend'
            ? state.resendApiKey
            : state.brevoApiKey,
      };

      const res = await fetch('/api/gmail/link-direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatus({
          success: false,
          message: data.error || 'Failed to establish direct Gmail link.',
        });
      } else {
        setStatus({
          success: true,
          message: data.message,
          code: data.confirmationCode,
          latencyMs: data.latencyMs,
        });

        // Mark as linked
        onUpdateState({ gmailLinked: true });
        if (onRefreshInbox) onRefreshInbox();
      }
    } catch (err: any) {
      setStatus({
        success: false,
        message: err.message || 'Network error linking Gmail',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateReceive = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gmail/simulate-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customEmail, gmailAddress }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus({
          success: true,
          message: `Confirmation email received! Verification code: ${data.code}`,
          code: data.code,
        });
        if (onRefreshInbox) onRefreshInbox();
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-neutral-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 bg-[#111111] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00838C] text-white flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">Direct Gmail Linker</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  100% Free
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Link <span className="text-white font-mono">{customEmail}</span> directly to{' '}
                <span className="text-white font-mono">{gmailAddress}</span>.
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

        {/* Form Body */}
        <form onSubmit={handleLink} className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Method Selector */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
              Select Free Linking Method:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setMethod('relay')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  method === 'relay'
                    ? 'bg-teal-50/50 border-[#00838C] ring-2 ring-[#00838C]/20 shadow-sm'
                    : 'bg-white border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-neutral-900">
                    Free Relay API (Recommended)
                  </span>
                  {method === 'relay' && <span className="w-2 h-2 rounded-full bg-[#00838C]"></span>}
                </div>
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 mb-1">
                  Google Jan 2027 Compliant
                </span>
                <p className="text-[11px] text-neutral-500 leading-tight">
                  Uses your free Resend or Brevo API key to authenticate external SMTP sending from Gmail.
                </p>
              </div>

              <div
                onClick={() => setMethod('google-app-password')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  method === 'google-app-password'
                    ? 'bg-blue-50/50 border-blue-600 ring-2 ring-blue-600/20 shadow-sm'
                    : 'bg-white border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-neutral-900">
                    Google 16-Char App Password
                  </span>
                  {method === 'google-app-password' && (
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  )}
                </div>
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 mb-1">
                  Direct Google Auth
                </span>
                <p className="text-[11px] text-neutral-500 leading-tight">
                  Links directly using a 16-character app password generated from your Google Security account.
                </p>
              </div>
            </div>
          </div>

          {/* Credentials Input for Selected Method */}
          {method === 'relay' ? (
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800">
                  Relay Provider: <span className="text-[#00838C] uppercase">{state.selectedRelay}</span>
                </span>
                <button
                  type="button"
                  onClick={onOpenKeysGuide}
                  className="text-xs text-[#00838C] hover:underline font-semibold flex items-center gap-1"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Get / Manage Free API Keys</span>
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1">
                  API Key:
                </label>
                <input
                  type="password"
                  value={
                    state.selectedRelay === 'resend' ? state.resendApiKey : state.brevoApiKey
                  }
                  onChange={(e) => {
                    const val = e.target.value.trim();
                    if (state.selectedRelay === 'resend') onUpdateState({ resendApiKey: val });
                    else onUpdateState({ brevoApiKey: val });
                  }}
                  placeholder={
                    state.selectedRelay === 'resend'
                      ? 're_1234567890abcdef... (or click Get Free API Keys above)'
                      : 'xkeysib-...'
                  }
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-mono text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#00838C]"
                />
              </div>
            </div>
          ) : (
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800">
                  16-Character Google App Password:
                </span>
                <a
                  href="https://myaccount.google.com/apppasswords"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Generate on Google</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div>
                <input
                  type="password"
                  value={state.googleAppPassword || state.smtpConfig.pass}
                  onChange={(e) => {
                    const val = e.target.value.trim();
                    onUpdateState({
                      googleAppPassword: val,
                      smtpConfig: { ...state.smtpConfig, pass: val },
                    });
                  }}
                  placeholder="abcd efgh ijkl mnop"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-mono text-neutral-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <p className="text-[11px] text-neutral-500 mt-1">
                  Generate under Google Account &gt; Security &gt; 2-Step Verification &gt; App passwords.
                </p>
              </div>
            </div>
          )}

          {/* Action Trigger */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-[#00838C] hover:bg-[#006f77] text-white font-bold text-xs tracking-wide shadow-md transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Verifying & Linking...' : 'Establish Direct Gmail Link'}</span>
            </button>

            <button
              type="button"
              onClick={handleSimulateReceive}
              className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5"
            >
              <Inbox className="w-4 h-4 text-[#00838C]" />
              <span>Simulate Gmail Confirmation Email</span>
            </button>
          </div>

          {/* Status Result Card & Live Code Sniffer */}
          {status && (
            <div
              className={`p-5 rounded-2xl border transition-all animate-fade-in ${
                status.success
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-red-50 border-red-300 text-red-950'
              }`}
            >
              <div className="flex items-start gap-3">
                {status.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-2 flex-1">
                  <h4 className="font-extrabold text-sm">
                    {status.success ? 'Gmail Direct Link Verified!' : 'Linking Failed'}
                  </h4>
                  <p className="text-xs leading-relaxed opacity-90">{status.message}</p>

                  {status.code && (
                    <div className="p-3 bg-white rounded-xl border border-emerald-200 mt-2 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-neutral-500 font-bold uppercase block">
                          Gmail Confirmation Code:
                        </span>
                        <span className="text-lg font-mono font-black text-emerald-700 tracking-wider">
                          {status.code}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(status.code || '');
                          setCopiedCode(true);
                          setTimeout(() => setCopiedCode(false), 2000);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                      </button>
                    </div>
                  )}

                  {status.latencyMs && (
                    <span className="inline-block text-[10px] text-neutral-500 font-mono">
                      ⚡ Handshake latency: {status.latencyMs}ms
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Zero Google passwords saved on remote servers. Direct authenticated handshake.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-900 text-white font-bold hover:bg-neutral-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
