import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle, RefreshCw, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { SetupState } from '../types';

interface TestEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: SetupState;
  onUpdateState: (updates: Partial<SetupState>) => void;
}

export const TestEmailModal: React.FC<TestEmailModalProps> = ({
  isOpen,
  onClose,
  state,
  onUpdateState,
}) => {
  const [fromName, setFromName] = useState('Domain Test');
  const [fromEmail, setFromEmail] = useState(
    () => `${state.aliasPrefix || 'contact'}@${state.domain || 'yourdomain.com'}`
  );
  const [toEmail, setToEmail] = useState(() => state.primaryEmail || '');
  const [subject, setSubject] = useState(
    () => `Verification: Custom Domain Email From ${state.domain || 'yourdomain.com'}`
  );
  const [provider, setProvider] = useState<'resend' | 'brevo' | 'smtp'>(state.selectedRelay);
  const [apiKey, setApiKey] = useState(() =>
    state.selectedRelay === 'resend'
      ? state.resendApiKey
      : state.selectedRelay === 'brevo'
      ? state.brevoApiKey
      : ''
  );

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    messageId?: string;
    note?: string;
    error?: string;
    details?: any;
  } | null>(null);

  if (!isOpen) return null;

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const payload: any = {
        provider,
        apiKey: apiKey.trim(),
        fromEmail: fromEmail.trim(),
        fromName: fromName.trim(),
        toEmail: toEmail.trim(),
        subject: subject.trim(),
      };

      if (provider === 'smtp') {
        payload.smtpConfig = state.smtpConfig;
      }

      const res = await fetch('/api/email/test-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setResult({
          success: false,
          error: data.error || 'Failed to dispatch test email',
          details: data.details,
        });
      } else {
        setResult({
          success: true,
          messageId: data.messageId,
          note: data.note,
        });
      }
    } catch (err: any) {
      setResult({
        success: false,
        error: err.message || 'Network error communicating with test server',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Send Outbound Test Email</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Header Verification
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Trigger a live email through your relay to confirm the &quot;From:&quot; header masks your Gmail address.
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
        <div className="p-6 overflow-y-auto space-y-5">
          <form onSubmit={handleSendTest} className="space-y-4">
            {/* Relay Provider Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Outbound Relay Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['resend', 'brevo', 'smtp'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setProvider(p);
                      if (p === 'resend') setApiKey(state.resendApiKey);
                      if (p === 'brevo') setApiKey(state.brevoApiKey);
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      provider === p
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 ring-1 ring-blue-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {p.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* API Key or SMTP credentials */}
            {provider !== 'smtp' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {provider === 'resend' ? 'Resend API Key' : 'Brevo API Key'}
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={provider === 'resend' ? 're_1234567890...' : 'xkeysib-...'}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Required to authorize sending via {provider.toUpperCase()} free tier.
                </p>
              </div>
            ) : (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-1">
                <span className="font-semibold text-slate-200">Using Direct SMTP:</span>
                <p className="font-mono text-[11px] text-slate-400">
                  {state.smtpConfig.host || 'smtp.gmail.com'}:{state.smtpConfig.port || 587} (User: {state.smtpConfig.user || state.primaryEmail})
                </p>
              </div>
            )}

            {/* From Address */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Sender Name</label>
                <input
                  type="text"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">From Custom Address</label>
                <input
                  type="email"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-emerald-400 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* To Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Recipient Email (Your Gmail)</label>
              <input
                type="email"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                placeholder="you@gmail.com"
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Result Box */}
            {result && (
              <div
                className={`p-4 rounded-xl border text-xs ${
                  result.success
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                    : 'bg-red-950/20 border-red-500/40 text-red-200'
                }`}
              >
                {result.success ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Email successfully dispatched!</span>
                    </div>
                    <p className="text-emerald-300/90 leading-relaxed">{result.note}</p>
                    {result.messageId && (
                      <p className="font-mono text-[10px] text-emerald-400/80">Message ID: {result.messageId}</p>
                    )}
                    <p className="text-[11px] text-slate-400 pt-1">
                      Check your Gmail inbox. Click &quot;show details&quot; on the email to verify that the <strong>From:</strong> line shows <code>{fromEmail}</code> without any warning headers.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      <span>Sending Failed</span>
                    </div>
                    <p className="text-red-300/90 leading-relaxed">{result.error}</p>
                    <p className="text-[11px] text-slate-400 pt-1">
                      Tip: Ensure your domain or sender address is verified in your {provider.toUpperCase()} dashboard before sending.
                    </p>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Transmitting via Relay...' : 'Dispatch Live Test Email'}</span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 text-xs text-slate-500 flex items-center justify-between">
          <span>Uses real {provider.toUpperCase()} API / SMTP relay</span>
          <button onClick={onClose} className="hover:text-slate-300">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
