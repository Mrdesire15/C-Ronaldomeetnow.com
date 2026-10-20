import React, { useState } from 'react';
import {
  X,
  Key,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Copy,
  Check,
  Zap,
  Info,
  Lock,
  ArrowRight,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { SetupState } from '../types';

interface ApiKeysGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: SetupState;
  onUpdateState: (updates: Partial<SetupState>) => void;
}

export const ApiKeysGuideModal: React.FC<ApiKeysGuideModalProps> = ({
  isOpen,
  onClose,
  state,
  onUpdateState,
}) => {
  const [activeTab, setActiveTab] = useState<'resend' | 'brevo' | 'cloudflare' | 'google'>('resend');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  if (!isOpen) return null;

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTestKey = async () => {
    setTesting(true);
    setTestStatus(null);
    try {
      if (activeTab === 'resend') {
        const key = state.resendApiKey.trim();
        if (!key) {
          setTestStatus('Please enter your Resend API Key first (or use the Free Demo Key).');
          return;
        }
        const res = await fetch('/api/smtp/verify-connection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: 'resend', apiKey: key }),
        });
        const data = await res.json();
        setTestStatus(data.message || (data.success ? 'Resend Key Verified!' : 'Verification failed.'));
      } else if (activeTab === 'brevo') {
        const key = state.brevoApiKey.trim();
        if (!key) {
          setTestStatus('Please enter your Brevo API Key first.');
          return;
        }
        const res = await fetch('/api/smtp/verify-connection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: 'brevo', apiKey: key }),
        });
        const data = await res.json();
        setTestStatus(data.message || (data.success ? 'Brevo Key Verified!' : 'Verification failed.'));
      } else if (activeTab === 'cloudflare') {
        const token = state.cloudflareToken.trim();
        if (!token) {
          setTestStatus('Please enter your Cloudflare API Token first.');
          return;
        }
        const res = await fetch('/api/cloudflare/auto-configure', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, domain: state.domain }),
        });
        const data = await res.json();
        setTestStatus(data.message || data.error || (data.success ? 'Cloudflare Token Verified!' : 'Invalid Token.'));
      }
    } catch (err: any) {
      setTestStatus(err.message || 'Test failed');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl border border-neutral-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 bg-[#111111] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00838C] text-white flex items-center justify-center font-bold">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">Free API Keys &amp; Credentials Center</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  100% Free Tiers
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Direct guides on how to obtain, paste, and test free API keys for custom email &amp; Gmail linking.
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

        {/* Tab Selector */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-4 pt-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('resend');
              setTestStatus(null);
            }}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'resend'
                ? 'border-[#00838C] text-[#00838C] bg-white rounded-t-lg'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>1. Resend API Key</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
              3,000/mo Free
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('brevo');
              setTestStatus(null);
            }}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'brevo'
                ? 'border-[#00838C] text-[#00838C] bg-white rounded-t-lg'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>2. Brevo API Key</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
              300/day Free
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('google');
              setTestStatus(null);
            }}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'google'
                ? 'border-[#00838C] text-[#00838C] bg-white rounded-t-lg'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>3. Google App Password</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">
              Direct Gmail
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('cloudflare');
              setTestStatus(null);
            }}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'cloudflare'
                ? 'border-[#00838C] text-[#00838C] bg-white rounded-t-lg'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>4. Cloudflare Token</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-100 text-teal-800">
              Auto DNS
            </span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: RESEND API KEY */}
          {activeTab === 'resend' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-teal-50/60 rounded-xl border border-teal-100">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">
                    Resend API Key (Recommended for Modern Outbound Email)
                  </h3>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Gives you <strong>3,000 free emails every month</strong> with 100% Google 2027 compliance.
                  </p>
                </div>
                <a
                  href="https://resend.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-[#00838C] text-white text-xs font-bold hover:bg-[#006f77] transition-colors shrink-0"
                >
                  <span>Open Resend Keys</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Step by step */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
                  How to get your free key in 30 seconds:
                </span>
                <ol className="space-y-2.5 text-xs text-neutral-700 list-decimal list-inside leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <li className="pl-1">
                    Sign up or log in at{' '}
                    <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-[#00838C] underline font-semibold">
                      resend.com
                    </a>{' '}
                    (Free tier, zero credit card required).
                  </li>
                  <li className="pl-1">
                    Click <strong>API Keys</strong> in the left menu, then click <strong>Create API Key</strong>.
                  </li>
                  <li className="pl-1">
                    Choose Name (e.g. <em>Gmail Custom Email</em>) and permission <strong>Full Access</strong>.
                  </li>
                  <li className="pl-1">
                    Copy the key starting with <code className="font-mono bg-white px-1 py-0.5 rounded border border-neutral-300 font-bold">re_...</code>.
                  </li>
                </ol>
              </div>

              {/* Input Box */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase mb-1.5">
                  Paste Your Resend API Key:
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={state.resendApiKey}
                    onChange={(e) => onUpdateState({ resendApiKey: e.target.value.trim() })}
                    placeholder="re_1234567890abcdef..."
                    className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#00838C]"
                  />
                  <button
                    type="button"
                    onClick={() => onUpdateState({ resendApiKey: 're_demo_relay_active_' + state.domain })}
                    className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold border border-neutral-300 transition-colors shrink-0"
                  >
                    Insert Free Demo Key
                  </button>
                  <button
                    type="button"
                    onClick={handleTestKey}
                    disabled={testing}
                    className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                    <span>Test Key</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BREVO API KEY */}
          {activeTab === 'brevo' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">
                    Brevo API Key (Highest Free Daily Quota)
                  </h3>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Allows <strong>300 free emails per day (9,000/month)</strong>.
                  </p>
                </div>
                <a
                  href="https://app.brevo.com/settings/keys/smtp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors shrink-0"
                >
                  <span>Open Brevo Keys</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Step by step */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
                  How to get your free Brevo key:
                </span>
                <ol className="space-y-2.5 text-xs text-neutral-700 list-decimal list-inside leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <li className="pl-1">
                    Log in at{' '}
                    <a href="https://brevo.com" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-semibold">
                      brevo.com
                    </a>.
                  </li>
                  <li className="pl-1">
                    Click your account profile icon at top right &gt; <strong>SMTP &amp; API</strong>.
                  </li>
                  <li className="pl-1">
                    Under the <strong>API Keys</strong> tab, click <strong>Generate a new API key</strong>.
                  </li>
                  <li className="pl-1">
                    Copy the key starting with <code className="font-mono bg-white px-1 py-0.5 rounded border border-neutral-300 font-bold">xkeysib-...</code>.
                  </li>
                </ol>
              </div>

              {/* Input Box */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase mb-1.5">
                  Paste Your Brevo API Key:
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={state.brevoApiKey}
                    onChange={(e) => onUpdateState({ brevoApiKey: e.target.value.trim() })}
                    placeholder="xkeysib-..."
                    className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <button
                    type="button"
                    onClick={() => onUpdateState({ brevoApiKey: 'xkeysib-demo_relay_active' })}
                    className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold border border-neutral-300 transition-colors shrink-0"
                  >
                    Insert Free Demo Key
                  </button>
                  <button
                    type="button"
                    onClick={handleTestKey}
                    disabled={testing}
                    className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                    <span>Test Key</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GOOGLE APP PASSWORD */}
          {activeTab === 'google' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-blue-50/60 rounded-xl border border-blue-100">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">
                    Google 16-Character App Password (Direct Gmail Linking)
                  </h3>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Connects directly to your Google account with zero third-party relay needed.
                  </p>
                </div>
                <a
                  href="https://myaccount.google.com/apppasswords"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shrink-0"
                >
                  <span>Open Google App Passwords</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Step by step */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
                  How to generate your 16-character Google password:
                </span>
                <ol className="space-y-2.5 text-xs text-neutral-700 list-decimal list-inside leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <li className="pl-1">
                    Open{' '}
                    <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">
                      Google Security Settings
                    </a>{' '}
                    and ensure <strong>2-Step Verification</strong> is turned ON.
                  </li>
                  <li className="pl-1">
                    Open{' '}
                    <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">
                      myaccount.google.com/apppasswords
                    </a>.
                  </li>
                  <li className="pl-1">
                    In the app name box, enter <strong>&quot;Custom Email&quot;</strong> and click <strong>Create</strong>.
                  </li>
                  <li className="pl-1">
                    Google will show a 16-character code (e.g.{' '}
                    <code className="font-mono bg-white px-1 py-0.5 rounded border border-neutral-300 font-bold">abcd efgh ijkl mnop</code>).
                  </li>
                  <li className="pl-1">
                    Paste it below. You can leave the spaces in; our app automatically strips them.
                  </li>
                </ol>
              </div>

              {/* Input Box */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase mb-1.5">
                  Paste Your 16-Character Google App Password:
                </label>
                <div className="flex gap-2">
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
                    className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateState({
                        googleAppPassword: 'abcd efgh ijkl mnop',
                        smtpConfig: { ...state.smtpConfig, pass: 'abcd efgh ijkl mnop' },
                      });
                    }}
                    className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold border border-neutral-300 transition-colors shrink-0"
                  >
                    Insert Sample
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CLOUDFLARE API TOKEN */}
          {activeTab === 'cloudflare' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-amber-50/60 rounded-xl border border-amber-100">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">
                    Cloudflare API Token (1-Click Automated DNS Push)
                  </h3>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Pushes all MX and SPF records to your domain on Cloudflare with zero copy-pasting.
                  </p>
                </div>
                <a
                  href="https://dash.cloudflare.com/profile/api-tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors shrink-0"
                >
                  <span>Open Cloudflare Tokens</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Step by step */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
                  How to create your Cloudflare Token:
                </span>
                <ol className="space-y-2.5 text-xs text-neutral-700 list-decimal list-inside leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <li className="pl-1">
                    Open{' '}
                    <a href="https://dash.cloudflare.com/profile/api-tokens" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline font-semibold">
                      Cloudflare API Tokens
                    </a>{' '}
                    and click <strong>Create Token</strong>.
                  </li>
                  <li className="pl-1">
                    Under &quot;API Token Templates&quot;, choose <strong>&quot;Edit zone DNS&quot;</strong>.
                  </li>
                  <li className="pl-1">
                    Under <strong>Zone Resources</strong>, select <strong>Include &gt; Specific zone &gt; {state.domain || 'your domain'}</strong>.
                  </li>
                  <li className="pl-1">
                    Click <strong>Continue to summary</strong>, then click <strong>Create Token</strong> and copy the token.
                  </li>
                </ol>
              </div>

              {/* Input Box */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase mb-1.5">
                  Paste Your Cloudflare API Token:
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={state.cloudflareToken}
                    onChange={(e) => onUpdateState({ cloudflareToken: e.target.value.trim() })}
                    placeholder="7q_8Kx..."
                    className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                  <button
                    type="button"
                    onClick={handleTestKey}
                    disabled={testing}
                    className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                    <span>Test Token</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Test Status feedback */}
          {testStatus && (
            <div className="p-3.5 rounded-xl bg-neutral-100 border border-neutral-300 text-xs font-medium text-neutral-800 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00838C] shrink-0" />
              <span>{testStatus}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>All keys remain encrypted in your browser session. Never sold or shared.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold transition-colors"
          >
            Save &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
