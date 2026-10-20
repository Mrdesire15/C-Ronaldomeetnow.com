import React, { useState, useEffect } from 'react';
import { GoDaddyHeader } from './components/GoDaddyHeader';
import { GoDaddyHero } from './components/GoDaddyHero';
import { WebmailView } from './components/WebmailView';
import { ForwardersView } from './components/ForwardersView';
import { GmailSendAsView } from './components/GmailSendAsView';
import { DnsManagerView } from './components/DnsManagerView';
import { ComposeEmailModal } from './components/ComposeEmailModal';
import { GmailSimulatorModal } from './components/GmailSimulatorModal';
import { CloudflareAutoDnsModal } from './components/CloudflareAutoDnsModal';
import { ApiKeysGuideModal } from './components/ApiKeysGuideModal';
import { GmailDirectLinkerModal } from './components/GmailDirectLinkerModal';
import { SetupState, NavTab, DnsCheckResult, ForwardingAlias } from './types';
import { Mail, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

const STORAGE_KEY = 'godaddy_email_free_v2';

export default function App() {
  const [state, setState] = useState<SetupState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }

    return {
      domain: 'mybranddomain.com',
      primaryEmail: 'emiliajames921@gmail.com',
      aliasPrefix: 'contact',
      selectedRelay: 'resend',
      resendApiKey: '',
      brevoApiKey: '',
      smtpConfig: {
        host: 'smtp.gmail.com',
        port: 587,
        user: 'emiliajames921@gmail.com',
        pass: '',
        secure: false,
      },
      cloudflareToken: '',
      currentTab: 'webmail',
      aliases: [
        {
          id: 'alias-1',
          aliasPrefix: 'contact',
          forwardTo: 'emiliajames921@gmail.com',
          enabled: true,
          notes: 'Main contact address',
        },
        {
          id: 'alias-2',
          aliasPrefix: 'hello',
          forwardTo: 'emiliajames921@gmail.com',
          enabled: true,
          notes: 'General inquiries',
        },
        {
          id: 'alias-3',
          aliasPrefix: 'support',
          forwardTo: 'emiliajames921@gmail.com',
          enabled: true,
          notes: 'Customer support',
        },
      ],
    };
  });

  // Compose Modal
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');

  // Gmail Simulator Modal
  const [isGmailSimulatorOpen, setIsGmailSimulatorOpen] = useState(false);

  // Cloudflare Automated DNS Wizard Modal
  const [isCloudflareWizardOpen, setIsCloudflareWizardOpen] = useState(false);

  // Free API Keys & Setup Guide Modal
  const [isKeysGuideOpen, setIsKeysGuideOpen] = useState(false);

  // Direct Gmail Linker Modal
  const [isDirectLinkerOpen, setIsDirectLinkerOpen] = useState(false);

  // DNS scan state
  const [dnsResult, setDnsResult] = useState<DnsCheckResult | null>(null);
  const [checkingDns, setCheckingDns] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const updateState = (updates: Partial<SetupState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleOpenCompose = (defaultTo = '', defaultSubject = '') => {
    setComposeTo(defaultTo);
    setComposeSubject(defaultSubject);
    setIsComposeOpen(true);
  };

  // Perform live DNS lookup
  const handleLiveDnsCheck = async (targetDomain: string): Promise<DnsCheckResult | null> => {
    if (!targetDomain) return null;
    setCheckingDns(true);

    try {
      const res = await fetch('/api/dns/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: targetDomain }),
      });

      if (!res.ok) throw new Error('DNS check failed');
      const data: DnsCheckResult = await res.json();
      setDnsResult(data);
      return data;
    } catch (err) {
      console.error('DNS error:', err);
      return null;
    } finally {
      setCheckingDns(false);
    }
  };

  const handleAddAlias = (prefix: string, forwardTo: string) => {
    const newAlias: ForwardingAlias = {
      id: 'alias-' + Date.now(),
      aliasPrefix: prefix,
      forwardTo,
      enabled: true,
    };
    setState((prev) => ({
      ...prev,
      aliases: [...prev.aliases, newAlias],
    }));
  };

  const handleRemoveAlias = (id: string) => {
    setState((prev) => ({
      ...prev,
      aliases: prev.aliases.filter((a) => a.id !== id),
    }));
  };

  const customEmail = `${state.aliasPrefix || 'contact'}@${state.domain || 'yourdomain.com'}`;

  return (
    <div className="min-h-screen bg-neutral-100/60 text-neutral-900 flex flex-col font-sans selection:bg-[#00838C] selection:text-white">
      {/* GoDaddy Navigation Header */}
      <GoDaddyHeader
        currentTab={state.currentTab}
        onSelectTab={(tab) => updateState({ currentTab: tab })}
        onOpenCompose={() => handleOpenCompose()}
        onOpenKeysGuide={() => setIsKeysGuideOpen(true)}
        onOpenDirectLinker={() => setIsDirectLinkerOpen(true)}
        unreadCount={unreadCount}
        domain={state.domain}
        isGmailLinked={state.gmailLinked}
      />

      {/* Hero with Domain Input & Price Tag */}
      <GoDaddyHero
        domain={state.domain}
        onDomainChange={(d) => updateState({ domain: d })}
        aliasPrefix={state.aliasPrefix}
        onAliasChange={(a) => updateState({ aliasPrefix: a })}
        primaryEmail={state.primaryEmail}
        onPrimaryEmailChange={(p) => updateState({ primaryEmail: p })}
        onOpenWebmail={() => updateState({ currentTab: 'webmail' })}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {state.currentTab === 'webmail' && (
          <WebmailView
            customEmail={customEmail}
            primaryEmail={state.primaryEmail}
            onOpenCompose={handleOpenCompose}
          />
        )}

        {state.currentTab === 'forwarders' && (
          <ForwardersView
            domain={state.domain}
            primaryEmail={state.primaryEmail}
            aliases={state.aliases}
            onAddAlias={handleAddAlias}
            onRemoveAlias={handleRemoveAlias}
            onOpenCompose={(to) => handleOpenCompose(to)}
          />
        )}

        {state.currentTab === 'gmail' && (
          <GmailSendAsView
            state={state}
            onUpdateState={updateState}
            onOpenSimulator={() => setIsGmailSimulatorOpen(true)}
            onOpenDirectLinker={() => setIsDirectLinkerOpen(true)}
            onOpenKeysGuide={() => setIsKeysGuideOpen(true)}
          />
        )}

        {state.currentTab === 'dns' && (
          <DnsManagerView
            domain={state.domain}
            selectedRelay={state.selectedRelay}
            onLiveCheck={handleLiveDnsCheck}
            dnsResult={dnsResult}
            checkingDns={checkingDns}
            onOpenCloudflareWizard={() => setIsCloudflareWizardOpen(true)}
          />
        )}
      </main>

      {/* GoDaddy-styled Footer */}
      <footer className="bg-[#111111] text-white border-t border-neutral-800 py-10 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#00838C] text-white flex items-center justify-center font-bold">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-base text-white">GoEmail Free</span>
                <p className="text-neutral-400 text-xs">
                  Free custom domain email forwarding to Gmail with unbranded outbound sending.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-neutral-400 font-medium">
              <button
                onClick={() => updateState({ currentTab: 'webmail' })}
                className="hover:text-white transition-colors"
              >
                Webmail Inbox
              </button>
              <button
                onClick={() => updateState({ currentTab: 'forwarders' })}
                className="hover:text-white transition-colors"
              >
                Email Forwarders
              </button>
              <button
                onClick={() => updateState({ currentTab: 'gmail' })}
                className="hover:text-white transition-colors"
              >
                Gmail Send-As
              </button>
              <button
                onClick={() => updateState({ currentTab: 'dns' })}
                className="hover:text-white transition-colors"
              >
                DNS Records
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
            <p>© {new Date().getFullYear()} Free Custom Domain Email Forwarder. 100% Free Forever Tier.</p>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero email watermarks • Zero company branding on messages</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Compose Clean Email Modal (Zero Watermarks) */}
      <ComposeEmailModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        fromEmail={customEmail}
        defaultTo={composeTo}
        defaultSubject={composeSubject}
        state={state}
        onEmailSent={() => setUnreadCount((c) => c + 1)}
      />

      {/* Gmail Simulator Modal */}
      <GmailSimulatorModal
        isOpen={isGmailSimulatorOpen}
        onClose={() => setIsGmailSimulatorOpen(false)}
        state={{
          ...state,
          step: 'outbound',
        }}
      />

      {/* Automated Cloudflare DNS Configuration Wizard Modal */}
      <CloudflareAutoDnsModal
        isOpen={isCloudflareWizardOpen}
        onClose={() => setIsCloudflareWizardOpen(false)}
        domain={state.domain}
        selectedRelay={state.selectedRelay}
        cloudflareToken={state.cloudflareToken}
        onUpdateToken={(t) => updateState({ cloudflareToken: t })}
        onSuccessPush={() => {
          handleLiveDnsCheck(state.domain);
        }}
      />

      {/* Free API Keys & Setup Guides Modal */}
      <ApiKeysGuideModal
        isOpen={isKeysGuideOpen}
        onClose={() => setIsKeysGuideOpen(false)}
        state={state}
        onUpdateState={updateState}
      />

      {/* Direct Gmail Linker Modal */}
      <GmailDirectLinkerModal
        isOpen={isDirectLinkerOpen}
        onClose={() => setIsDirectLinkerOpen(false)}
        state={state}
        onUpdateState={updateState}
        onOpenKeysGuide={() => {
          setIsDirectLinkerOpen(false);
          setIsKeysGuideOpen(true);
        }}
        onRefreshInbox={() => setUnreadCount((c) => c + 1)}
      />
    </div>
  );
}
