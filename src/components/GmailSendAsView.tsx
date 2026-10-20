import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  ShieldAlert,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  Mail,
  Lock,
  Activity,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { SetupState } from '../types';
import { RELAY_PROVIDERS_INFO } from '../data/guides';

interface GmailSendAsViewProps {
  state: SetupState;
  onUpdateState: (updates: Partial<SetupState>) => void;
  onOpenSimulator: () => void;
  onOpenDirectLinker?: () => void;
  onOpenKeysGuide?: () => void;
}

interface DiagnosticResult {
  success: boolean;
  reachable?: boolean;
  server?: string;
  port?: number;
  latencyMs?: number;
  authenticated?: boolean;
  message: string;
  checks?: Array<{ name: string; status: 'pass' | 'fail' | 'warn'; detail: string }>;
}

export const GmailSendAsView: React.FC<GmailSendAsViewProps> = ({
  state,
  onUpdateState,
  onOpenSimulator,
  onOpenDirectLinker,
  onOpenKeysGuide,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const domain = state.domain || 'yourdomain.com';
  const customEmail = `${state.aliasPrefix || 'contact'}@${domain}`;
  const provider = state.selectedRelay;
  const relayInfo = RELAY_PROVIDERS_INFO[provider];

  const smtpServer =
    provider === 'resend'
      ? 'smtp.resend.com'
      : provider === 'brevo'
      ? 'smtp-relay.brevo.com'
      : state.smtpConfig.host || 'smtp.gmail.com';

  const smtpPort = provider === 'smtp' ? state.smtpConfig.port : 587;
  const smtpUser =
    provider === 'resend'
      ? 'resend'
      : provider === 'brevo'
      ? state.smtpConfig.user || 'your-brevo-login-email'
      : state.smtpConfig.user || state.primaryEmail;

  const currentApiKey =
    provider === 'resend'
      ? state.resendApiKey
      : provider === 'brevo'
      ? state.brevoApiKey
      : state.smtpConfig.pass;

  // Run automated SMTP connection diagnostic
  const handleTestSmtpConnection = async () => {
    setTestingConnection(true);
    setDiagnosticResult(null);

    try {
      const res = await fetch('/api/smtp/verify-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          apiKey: currentApiKey.trim(),
          smtpConfig: state.smtpConfig,
          domain,
        }),
      });

      const data = await res.json();
      setDiagnosticResult(data);
    } catch (err: any) {
      setDiagnosticResult({
        success: false,
        message: err.message || 'Failed to communicate with diagnostic test server.',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero explanation card */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
              <span>Future-Proof</span>
              <span>•</span>
              <span>Google Jan 2027 Ready</span>
            </div>
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
              Send As &quot;{customEmail}&quot; From Gmail
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              When replying or composing in your personal Gmail, recipients will see{' '}
              <strong className="text-neutral-900 font-mono">{customEmail}</strong> in the &quot;From:&quot; header. Your private Gmail address is never exposed.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-2.5 shrink-0">
            {onOpenDirectLinker && (
              <button
                onClick={onOpenDirectLinker}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wide shadow-md transition-all active:scale-95 shrink-0"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{state.gmailLinked ? 'Manage Gmail Link' : 'Direct Link Gmail'}</span>
              </button>
            )}

            <button
              onClick={handleTestSmtpConnection}
              disabled={testingConnection}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs tracking-wide shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <Activity className={`w-4 h-4 text-emerald-400 ${testingConnection ? 'animate-pulse' : ''}`} />
              <span>{testingConnection ? 'Probing SMTP...' : 'Test Connection'}</span>
            </button>

            <button
              onClick={onOpenSimulator}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#00838C] hover:bg-[#006f77] text-white font-bold text-xs tracking-wide shadow-md transition-all active:scale-95 shrink-0"
            >
              <ExternalLink className="w-4 h-4 text-teal-200" />
              <span>Gmail Guide</span>
            </button>
          </div>
        </div>

        {/* Relay provider choice */}
        <div className="mt-8 pt-6 border-t border-neutral-200">
          <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-3">
            Select Free Outbound Relay
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['resend', 'brevo', 'smtp'] as const).map((pKey) => {
              const info = RELAY_PROVIDERS_INFO[pKey];
              const isSelected = provider === pKey;
              return (
                <div
                  key={pKey}
                  onClick={() => {
                    onUpdateState({ selectedRelay: pKey });
                    setDiagnosticResult(null);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-teal-50/50 border-[#00838C] ring-2 ring-[#00838C]/20 text-neutral-900 shadow-sm'
                      : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-neutral-900">{info.name}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-[#00838C]"></span>}
                  </div>
                  <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 mb-2">
                    {info.freeQuota}
                  </span>
                  <p className="text-[11px] text-neutral-500 leading-tight">{info.badge}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Copy-Paste Settings Table */}
        <div className="mt-6 p-5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                Exact Settings for Gmail &gt; Accounts and Import &gt; &quot;Send mail as&quot;
              </span>
              <p className="text-[11px] text-neutral-500">
                Pre-filled for {relayInfo.name} relay
              </p>
            </div>
            <span className="text-xs text-neutral-500">100% Free Tier</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white rounded-lg border border-neutral-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">1. Email Address</span>
                <span className="font-mono font-bold text-neutral-900">{customEmail}</span>
              </div>
              <button
                onClick={() => copy(customEmail, 'email')}
                className="p-1.5 rounded hover:bg-neutral-100 text-neutral-500"
              >
                {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="p-3 bg-white rounded-lg border border-neutral-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">2. Treat as Alias</span>
                <span className="font-bold text-neutral-900">Uncheck box in Gmail</span>
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">Recommended</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-neutral-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">3. SMTP Server</span>
                <span className="font-mono font-bold text-neutral-900">{smtpServer}</span>
              </div>
              <button
                onClick={() => copy(smtpServer, 'host')}
                className="p-1.5 rounded hover:bg-neutral-100 text-neutral-500"
              >
                {copiedKey === 'host' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="p-3 bg-white rounded-lg border border-neutral-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">4. Port &amp; Security</span>
                <span className="font-mono font-bold text-neutral-900">Port {smtpPort} (TLS Secured)</span>
              </div>
              <button
                onClick={() => copy(String(smtpPort), 'port')}
                className="p-1.5 rounded hover:bg-neutral-100 text-neutral-500"
              >
                {copiedKey === 'port' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="p-3 bg-white rounded-lg border border-neutral-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">5. Username</span>
                <span className="font-mono font-bold text-neutral-900">{smtpUser}</span>
              </div>
              <button
                onClick={() => copy(smtpUser, 'user')}
                className="p-1.5 rounded hover:bg-neutral-100 text-neutral-500"
              >
                {copiedKey === 'user' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="p-3 bg-white rounded-lg border border-neutral-200 flex items-center justify-between">
              <div className="w-full">
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">6. Password / Key</span>
                <input
                  type="password"
                  value={currentApiKey}
                  onChange={(e) => {
                    const val = e.target.value.trim();
                    if (provider === 'resend') onUpdateState({ resendApiKey: val });
                    else if (provider === 'brevo') onUpdateState({ brevoApiKey: val });
                    else onUpdateState({ smtpConfig: { ...state.smtpConfig, pass: val } });
                  }}
                  placeholder={relayInfo.passwordPlaceholder}
                  className="w-full text-xs font-mono text-neutral-900 focus:outline-none bg-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-200 gap-2">
            <span>
              Need your free key?{' '}
              <a
                href={relayInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00838C] font-semibold underline inline-flex items-center gap-0.5"
              >
                Create free account on {relayInfo.name} <ExternalLink className="w-3 h-3" />
              </a>
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleTestSmtpConnection}
                disabled={testingConnection}
                className="text-xs font-bold text-[#00838C] hover:underline flex items-center gap-1"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Test Connection Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Real-time SMTP Diagnostic Card */}
        {diagnosticResult && (
          <div
            className={`mt-6 p-5 rounded-2xl border transition-all animate-fade-in ${
              diagnosticResult.authenticated
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                : diagnosticResult.reachable
                ? 'bg-amber-50/70 border-amber-300 text-amber-950'
                : 'bg-red-50/70 border-red-300 text-red-950'
            }`}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/10">
              <div className="flex items-center gap-2.5">
                {diagnosticResult.authenticated ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : diagnosticResult.reachable ? (
                  <Zap className="w-5 h-5 text-amber-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                )}
                <div>
                  <h3 className="font-extrabold text-sm tracking-tight">
                    {diagnosticResult.authenticated
                      ? 'SMTP Connection & Authentication Verified!'
                      : diagnosticResult.reachable
                      ? 'Relay Server is Reachable (Credentials Pending)'
                      : 'Relay Server Unreachable'}
                  </h3>
                  <p className="text-xs opacity-90">{diagnosticResult.message}</p>
                </div>
              </div>

              {diagnosticResult.latencyMs !== undefined && (
                <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono font-bold">
                  <span className="px-2 py-0.5 rounded-full bg-black/10">
                    ⚡ {diagnosticResult.latencyMs}ms latency
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-black/10">
                    {diagnosticResult.server}:{diagnosticResult.port}
                  </span>
                </div>
              )}
            </div>

            {/* Checklist items */}
            {diagnosticResult.checks && diagnosticResult.checks.length > 0 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {diagnosticResult.checks.map((c, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-white/80 border border-black/5 flex items-start justify-between gap-2 shadow-2xs"
                  >
                    <div>
                      <span className="font-bold block text-neutral-900">{c.name}</span>
                      <span className="text-[11px] text-neutral-600 font-mono truncate block max-w-xs">
                        {c.detail}
                      </span>
                    </div>
                    {c.status === 'pass' ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                        PASS
                      </span>
                    ) : c.status === 'warn' ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 shrink-0">
                        WARN
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 shrink-0">
                        FAIL
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Bottom status recommendation */}
            <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between text-xs font-medium">
              <span>
                {diagnosticResult.authenticated
                  ? '✓ Verified safe to paste into Gmail Settings > Accounts and Import.'
                  : diagnosticResult.reachable
                  ? 'Enter your Resend or Brevo API key above to complete authentication verification.'
                  : 'Check your internet connection, port, and firewall rules.'}
              </span>
              <button
                onClick={onOpenSimulator}
                className="font-bold text-[#00838C] hover:underline flex items-center gap-1"
              >
                <span>Open Gmail Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
