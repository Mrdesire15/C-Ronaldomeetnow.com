import React from 'react';
import { Mail, ShieldCheck, Sparkles, Activity, FileText, Send, RefreshCw } from 'lucide-react';
import { Step } from '../types';

interface HeaderProps {
  currentStep: Step;
  onSelectStep: (step: Step) => void;
  onOpenTestModal: () => void;
  onOpenGmailGuide: () => void;
  onOpenSelfHostModal: () => void;
  onOpenDnsChecker: () => void;
  domain: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onSelectStep,
  onOpenTestModal,
  onOpenGmailGuide,
  onOpenSelfHostModal,
  onOpenDnsChecker,
  domain,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectStep('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-100 tracking-tight">MailRelay Free</span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  100% Free Tier
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-medium rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Jan 2027 Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Custom Domain Inbound & Outbound Forwarder for Gmail
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenDnsChecker}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
              title="Inspect live DNS records"
            >
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden md:inline">Live DNS Health</span>
            </button>

            <button
              onClick={onOpenGmailGuide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
              title="Gmail Send As Setup Simulator"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Gmail Simulator</span>
            </button>

            <button
              onClick={onOpenTestModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-sm shadow-blue-500/30"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Test Email</span>
            </button>

            <button
              onClick={onOpenSelfHostModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
              title="Documentation and self-host instructions"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden lg:inline">Docs & README</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
