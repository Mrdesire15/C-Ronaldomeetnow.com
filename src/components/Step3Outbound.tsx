import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  Check,
  Copy,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  Key,
  Server,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { RELAY_PROVIDERS_INFO } from '../data/guides';
import { RelayProvider, SetupState } from '../types';

interface Step3OutboundProps {
  state: SetupState;
  onUpdateState: (updates: Partial<SetupState>) => void;
  onOpenGmailGuide: () => void;
  onOpenTestModal: () => void;
  onProceed: () => void;
  onBack: () => void;
}

export const Step3Outbound: React.FC<Step3OutboundProps> = ({
  state,
  onUpdateState,
  onOpenGmailGuide,
  onOpenTestModal,
  onProceed,
  onBack,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const currentProviderInfo = RELAY_PROVIDERS_INFO[state.selectedRelay];
  const customEmail = `${state.aliasPrefix || 'contact'}@${state.domain || 'yourdomain.com'}`;

  // Calculated SMTP settings based on selected provider
  const smtpServer =
    state.selectedRelay === 'resend'
      ? 'smtp.resend.com'
      : state.selectedRelay === 'brevo'
      ? 'smtp-relay.brevo.com'
      : state.smtpConfig.host || 'smtp.gmail.com';

  const smtpPort = state.selectedRelay === 'smtp' ? state.smtpConfig.port : 587;
  const smtpUsername =
    state.selectedRelay === 'resend'
      ? 'resend'
      : state.selectedRelay === 'brevo'
      ? state.smtpConfig.user || 'your-brevo-account-email'
      : state.smtpConfig.user || state.primaryEmail;

  return (
    <div className="space-y-6">
      {/* Deprecation & Security Warning Banner */}
      <div className="bg-amber-950/20 border border-amber-500/40 rounded-2xl p-4 sm:p-5 text-amber-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-300">Google Jan 2027 Deprecation Notice & Solution</span>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[10px] font-semibold border border-amber-500/30">
                Future-Proof
              </span>
            </div>
            <p className="text-amber-200/90 leading-relaxed">
              Google is phasing out unauthenticated or legacy third-party &quot;Send as&quot; methods in <strong>January 2027</strong>.
              By routing outbound messages through a dedicated free SMTP relay (<strong>Resend</strong> or <strong>Brevo</strong>) with valid SPF and DKIM signatures, your custom domain emails will remain fully compliant and inbox-guaranteed.
            </p>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
            <span>Step 3 of 3</span>
            <span>•</span>
            <span>Outbound &quot;Send As&quot; Relay</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Send Emails From Gmail Displaying Your Custom Domain
          </h1>
          <p className="mt-2 text-slate-400 text-sm sm:text-base leading-relaxed">
            When you compose or reply in Gmail, recipients will see{' '}
            <span className="text-emerald-400 font-mono font-semibold">{customEmail}</span> as the sender,
            with your personal <span className="text-slate-400 font-mono">{state.primaryEmail || 'user@gmail.com'}</span> address completely masked.
          </p>
        </div>

        {/* Relay Provider Selection */}
        <div className="mt-8">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Choose Free SMTP Relay Service
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(['resend', 'brevo', 'smtp'] as RelayProvider[]).map((pKey) => {
              const info = RELAY_PROVIDERS_INFO[pKey];
              const isSelected = state.selectedRelay === pKey;
              return (
                <div
                  key={pKey}
                  onClick={() => onUpdateState({ selectedRelay: pKey })}
                  className={`p-5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-600/15 border-blue-500 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-100">{info.name}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-2">
                    {info.freeQuota}
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">{info.badge}</p>
                  <ul className="text-[11px] text-slate-400 space-y-1">
                    {info.pros.slice(0, 2).map((pro, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Credentials Form & Live Values */}
        <div className="mt-8 pt-8 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Gmail &quot;Send Mail As&quot; Configuration Snippets</span>
                <span className="text-xs text-blue-400 font-mono">({currentProviderInfo.name})</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Copy these exact values directly into Gmail&apos;s &quot;Add another email address&quot; window.
              </p>
            </div>

            <button
              onClick={onOpenGmailGuide}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-amber-500/20 self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Interactive Gmail Visual Simulator</span>
            </button>
          </div>

          {/* Configuration Values Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  1. Email Address (to add in Gmail)
                </label>
                <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="font-mono text-xs text-emerald-400 font-semibold">{customEmail}</span>
                  <button
                    onClick={() => copyToClipboard(customEmail, 'email')}
                    className="p-1 text-slate-400 hover:text-white"
                    title="Copy"
                  >
                    {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  2. Treat as an alias checkbox
                </label>
                <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-xs text-slate-200">
                    <strong>Uncheck</strong> (Recommended) or Check if replying only
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Unchecked</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  3. SMTP Server
                </label>
                <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="font-mono text-xs text-slate-200">{smtpServer}</span>
                  <button
                    onClick={() => copyToClipboard(smtpServer, 'smtpServer')}
                    className="p-1 text-slate-400 hover:text-white"
                    title="Copy"
                  >
                    {copiedKey === 'smtpServer' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  4. Port & Security
                </label>
                <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="font-mono text-xs text-slate-200">Port {smtpPort} (Secured connection using TLS)</span>
                  <button
                    onClick={() => copyToClipboard(String(smtpPort), 'port')}
                    className="p-1 text-slate-400 hover:text-white"
                    title="Copy"
                  >
                    {copiedKey === 'port' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  5. Username
                </label>
                <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="font-mono text-xs text-slate-200">{smtpUsername}</span>
                  <button
                    onClick={() => copyToClipboard(smtpUsername, 'user')}
                    className="p-1 text-slate-400 hover:text-white"
                    title="Copy"
                  >
                    {copiedKey === 'user' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  6. Password / API Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={
                      state.selectedRelay === 'resend'
                        ? state.resendApiKey
                        : state.selectedRelay === 'brevo'
                        ? state.brevoApiKey
                        : state.smtpConfig.pass
                    }
                    onChange={(e) => {
                      const val = e.target.value.trim();
                      if (state.selectedRelay === 'resend') {
                        onUpdateState({ resendApiKey: val });
                      } else if (state.selectedRelay === 'brevo') {
                        onUpdateState({ brevoApiKey: val });
                      } else {
                        onUpdateState({
                          smtpConfig: { ...state.smtpConfig, pass: val },
                        });
                      }
                    }}
                    placeholder={currentProviderInfo.passwordPlaceholder}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-lg text-xs text-slate-400 flex items-center justify-between">
              <span>
                Need your free key?{' '}
                <a
                  href={currentProviderInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline inline-flex items-center gap-1 ml-1"
                >
                  Create free account on {currentProviderInfo.name} <ExternalLink className="w-3 h-3" />
                </a>
              </span>
              <span className="text-[11px] text-slate-500">Free forever tier</span>
            </div>
          </div>
        </div>

        {/* Step-by-Step Gmail Walkthrough Text */}
        <div className="mt-8 space-y-4">
          <h3 className="font-bold text-white text-sm">Step-by-Step Gmail Walkthrough (Takes 2 Minutes):</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 inline-flex items-center justify-center font-bold text-xs">
                1
              </span>
              <p className="font-semibold text-slate-200">Open Gmail Settings &quot;Send Mail As&quot;</p>
              <p className="text-slate-400 leading-relaxed">
                In Gmail, click the ⚙️ gear icon at top right → click <strong>See all settings</strong> → click the <strong>Accounts and Import</strong> tab. Scroll down to <strong>Send mail as</strong> and click <strong>Add another email address</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 inline-flex items-center justify-center font-bold text-xs">
                2
              </span>
              <p className="font-semibold text-slate-200">Enter Your Custom Domain Name & Address</p>
              <p className="text-slate-400 leading-relaxed">
                A yellow-bordered popup appears. Enter your Name and your address: <code className="text-blue-400 font-mono">{customEmail}</code>. Leave <strong>Treat as an alias</strong> unchecked so it acts as an independent business sender. Click Next Step.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 inline-flex items-center justify-center font-bold text-xs">
                3
              </span>
              <p className="font-semibold text-slate-200">Paste the SMTP Relay Credentials</p>
              <p className="text-slate-400 leading-relaxed">
                Fill in SMTP Server: <code className="text-slate-300 font-mono">{smtpServer}</code>, Port: <code className="text-slate-300 font-mono">{smtpPort}</code>, Username: <code className="text-slate-300 font-mono">{smtpUsername}</code>, and your API Key. Keep <strong>Secured connection using TLS</strong> selected. Click <strong>Add Account</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 inline-flex items-center justify-center font-bold text-xs">
                4
              </span>
              <p className="font-semibold text-slate-200">Confirm Verification Code Arriving in Gmail!</p>
              <p className="text-slate-400 leading-relaxed">
                Gmail sends a confirmation email to <code className="text-emerald-400 font-mono">{customEmail}</code>. Because you set up Cloudflare Email Routing in Step 2, this code <strong>arrives straight in your Gmail inbox</strong> within 5 seconds! Copy the code, paste it into the popup, and click Verify.
              </p>
            </div>
          </div>
        </div>

        {/* Live Test Email Button */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenTestModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wide transition-all shadow-md shadow-emerald-600/30"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Live Test Outbound Email</span>
            </button>
            <span className="text-xs text-slate-400">
              Verify your From: header shows {customEmail}
            </span>
          </div>

          <button
            onClick={onOpenGmailGuide}
            className="text-xs text-blue-400 hover:text-blue-300 underline flex items-center gap-1"
          >
            Preview Gmail popup simulator
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors border border-slate-700"
        >
          Back to Step 2: Inbound
        </button>

        <button
          onClick={onProceed}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all"
        >
          <span>Finish & View Status Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
