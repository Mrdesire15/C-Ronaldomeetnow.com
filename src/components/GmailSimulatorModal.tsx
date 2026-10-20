import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, HelpCircle, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { SetupState } from '../types';
import { RELAY_PROVIDERS_INFO } from '../data/guides';

interface GmailSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: SetupState;
}

export const GmailSimulatorModal: React.FC<GmailSimulatorModalProps> = ({
  isOpen,
  onClose,
  state,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'smtp' | 'verify'>('info');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const domain = state.domain || 'yourdomain.com';
  const customEmail = `${state.aliasPrefix || 'contact'}@${domain}`;
  const provider = state.selectedRelay;
  const currentProviderInfo = RELAY_PROVIDERS_INFO[provider];

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

  const passwordVal =
    provider === 'resend'
      ? state.resendApiKey || 're_1234567890abcdef...'
      : provider === 'brevo'
      ? state.brevoApiKey || 'xkeysib-...'
      : state.smtpConfig.pass || '••••••••••••••••';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Gmail &quot;Send Mail As&quot; Interactive Simulator</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Visual Blueprint
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                This mirrors the exact popup window Gmail displays in Settings → Accounts and Import.
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

        {/* Tab switcher inside simulator */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-4 pt-3 text-xs">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 font-semibold border-b-2 transition-all ${
              activeTab === 'info'
                ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Email Address Setup
          </button>
          <button
            onClick={() => setActiveTab('smtp')}
            className={`px-4 py-2 font-semibold border-b-2 transition-all ${
              activeTab === 'smtp'
                ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. SMTP Server &amp; Credentials
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className={`px-4 py-2 font-semibold border-b-2 transition-all ${
              activeTab === 'verify'
                ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Verification &amp; Inboxing
          </button>
        </div>

        {/* Realistic Gmail Window Frame */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-950/60">
          <div className="bg-[#fefced] text-[#202124] rounded-lg border-2 border-[#f3ca40] p-6 shadow-md max-w-xl mx-auto font-sans text-xs">
            {/* Gmail Fake Window Titlebar */}
            <div className="border-b border-[#ebd78c] pb-3 mb-5 flex items-center justify-between">
              <span className="font-bold text-sm text-[#202124]">
                {activeTab === 'info' && 'Add another email address you own'}
                {activeTab === 'smtp' && 'Send mail through your SMTP server'}
                {activeTab === 'verify' && 'Confirm verification and add address'}
              </span>
              <span className="text-[10px] text-[#5f6368] font-mono">Gmail Settings &gt; Accounts</span>
            </div>

            {/* TAB 1: INFO */}
            {activeTab === 'info' && (
              <div className="space-y-4">
                <p className="text-[#3c4043] leading-relaxed">
                  Enter information about your other email address. When you send mail from this address, the recipient will see this name and address.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#202124] mb-1">Name:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value="Your Name / Brand"
                        className="w-full px-2.5 py-1.5 bg-white border border-[#dadce0] rounded text-xs text-[#202124]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-[#202124]">Email address:</label>
                      <button
                        onClick={() => copy(customEmail, 'sim-email')}
                        className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {copiedKey === 'sim-email' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                        <span>Copy Address</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={customEmail}
                      className="w-full px-2.5 py-1.5 bg-white border-2 border-blue-500 rounded text-xs font-mono font-bold text-blue-900 shadow-sm"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={false}
                        readOnly
                        className="mt-0.5 rounded text-blue-600"
                      />
                      <div>
                        <span className="font-bold text-[#202124]">Treat as an alias</span>
                        <p className="text-[11px] text-[#5f6368] mt-0.5 leading-relaxed">
                          <strong>Recommended: Uncheck this box</strong> so replies come from your custom domain address rather than exposing your personal Gmail address.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#ebd78c] flex justify-between items-center">
                  <span className="text-[11px] text-[#5f6368]">Step 1 of 2 in Gmail</span>
                  <button
                    onClick={() => setActiveTab('smtp')}
                    className="px-4 py-1.5 rounded bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium text-xs shadow-sm flex items-center gap-1.5"
                  >
                    <span>Next Step &gt;&gt;</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: SMTP */}
            {activeTab === 'smtp' && (
              <div className="space-y-4">
                <p className="text-[#3c4043] leading-relaxed">
                  Send email through <strong>{currentProviderInfo?.name || 'SMTP'}</strong> relay to ensure 100% deliverability and Google 2027 compliance.
                </p>

                <div className="space-y-3">
                  {/* SMTP Server */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-[#202124]">SMTP Server:</label>
                      <button
                        onClick={() => copy(smtpServer, 'sim-host')}
                        className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {copiedKey === 'sim-host' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                        <span>Copy Host</span>
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={smtpServer}
                        className="flex-1 px-2.5 py-1.5 bg-white border border-[#dadce0] rounded text-xs font-mono font-semibold"
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-bold text-[#202124]">Port:</span>
                        <input
                          type="text"
                          readOnly
                          value={String(smtpPort)}
                          className="w-16 px-2 py-1.5 bg-white border border-[#dadce0] rounded text-xs font-mono font-semibold text-center"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Username */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-[#202124]">Username:</label>
                      <button
                        onClick={() => copy(smtpUser, 'sim-user')}
                        className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {copiedKey === 'sim-user' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                        <span>Copy User</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={smtpUser}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#dadce0] rounded text-xs font-mono"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-[#202124]">Password:</label>
                      <button
                        onClick={() => copy(passwordVal, 'sim-pass')}
                        className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {copiedKey === 'sim-pass' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                        <span>Copy Key</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={passwordVal}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#dadce0] rounded text-xs font-mono"
                    />
                    <p className="text-[10px] text-[#5f6368] mt-1">
                      * Paste your {currentProviderInfo?.name} API key or Master SMTP Password here.
                    </p>
                  </div>

                  {/* Security TLS */}
                  <div className="pt-1">
                    <label className="flex items-center gap-2">
                      <input type="radio" checked readOnly className="text-blue-600" />
                      <span className="font-semibold text-xs text-[#202124]">
                        Secured connection using TLS (recommended)
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#ebd78c] flex justify-between items-center">
                  <button
                    onClick={() => setActiveTab('info')}
                    className="px-3 py-1.5 rounded border border-[#dadce0] bg-white text-[#3c4043] font-medium text-xs hover:bg-[#f1f3f4]"
                  >
                    &lt;&lt; Back
                  </button>
                  <button
                    onClick={() => setActiveTab('verify')}
                    className="px-4 py-1.5 rounded bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium text-xs shadow-sm flex items-center gap-1.5"
                  >
                    <span>Add Account &gt;&gt;</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: VERIFY */}
            {activeTab === 'verify' && (
              <div className="space-y-4">
                <div className="bg-[#e6f4ea] border border-[#ceead6] rounded p-3 text-[#137333]">
                  <p className="font-bold text-xs mb-1">
                    ✓ Gmail sends a verification code to {customEmail}!
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Because your Cloudflare Email Routing is forwarding to your Gmail inbox, this email lands right in your Gmail within seconds.
                  </p>
                </div>

                <div className="border border-[#dadce0] bg-white rounded p-3 space-y-2">
                  <span className="font-bold text-[11px] text-[#202124]">
                    Look for this subject in your Gmail inbox:
                  </span>
                  <div className="p-2 rounded bg-[#f8f9fa] border border-[#e8eaed] text-[11px] font-mono text-[#202124]">
                    &quot;Gmail Confirmation - Send Mail as {customEmail}&quot;
                  </div>
                  <p className="text-[10px] text-[#5f6368]">
                    Inside, copy the 9-digit confirmation code (or simply click the verification link in that email).
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#202124] mb-1">
                    Enter and verify confirmation code:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 84930219"
                      className="px-3 py-1.5 bg-white border-2 border-emerald-500 rounded text-xs font-mono font-bold text-[#202124] flex-1"
                    />
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-1.5 rounded bg-[#1e8e3e] hover:bg-[#188038] text-white font-bold text-xs"
                    >
                      Verify
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-900 leading-relaxed">
                  <strong>You are ready!</strong> Whenever you write or reply in Gmail, click the <strong>&quot;From:&quot;</strong> field dropdown at top of compose window and select <strong>{customEmail}</strong>.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero passwords stored on our servers. Direct SMTP relay.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
