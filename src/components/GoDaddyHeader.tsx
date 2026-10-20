import React from 'react';
import { Mail, ArrowRightLeft, ShieldCheck, PenSquare, Server, Globe, Key, Sparkles, CheckCircle2 } from 'lucide-react';
import { NavTab } from '../types';

interface GoDaddyHeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenCompose: () => void;
  onOpenKeysGuide: () => void;
  onOpenDirectLinker: () => void;
  unreadCount: number;
  domain: string;
  isGmailLinked?: boolean;
}

export const GoDaddyHeader: React.FC<GoDaddyHeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenCompose,
  onOpenKeysGuide,
  onOpenDirectLinker,
  unreadCount,
  domain,
  isGmailLinked,
}) => {
  return (
    <header className="w-full bg-[#111111] text-white border-b border-neutral-800 sticky top-0 z-40">
      {/* Top GoDaddy-style promo banner */}
      <div className="bg-[#00838C] text-white text-[12px] font-semibold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <span>⚡ 100% Free Custom Domain Email • $0.00 / mo Forever • Zero Watermarks • Forward to Gmail</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => onSelectTab('webmail')}
            >
              <div className="w-9 h-9 rounded-full bg-[#00838C] group-hover:bg-[#00a4a6] text-white flex items-center justify-center transition-colors shadow-sm">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-white tracking-tight">GoEmail</span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Free
                  </span>
                </div>
                <span className="text-[11px] text-neutral-400 hidden sm:block -mt-0.5">
                  Custom Domain Forwarder &amp; Webmail
                </span>
              </div>
            </div>

            {/* Main Tabs Navigation */}
            <nav className="hidden md:flex items-center gap-1 ml-4 text-sm font-medium">
              <button
                onClick={() => onSelectTab('webmail')}
                className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  currentTab === 'webmail'
                    ? 'bg-neutral-800 text-white font-semibold'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <Mail className="w-4 h-4 text-[#00a4a6]" />
                <span>Webmail &amp; Inbox</span>
                {unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#00838C] text-white text-[11px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onSelectTab('forwarders')}
                className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  currentTab === 'forwarders'
                    ? 'bg-neutral-800 text-white font-semibold'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
                <span>Email Forwarders</span>
              </button>

              <button
                onClick={() => onSelectTab('gmail')}
                className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  currentTab === 'gmail'
                    ? 'bg-neutral-800 text-white font-semibold'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Gmail &quot;Send As&quot;</span>
              </button>

              <button
                onClick={() => onSelectTab('dns')}
                className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  currentTab === 'dns'
                    ? 'bg-neutral-800 text-white font-semibold'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <Server className="w-4 h-4 text-sky-400" />
                <span>DNS Records</span>
              </button>
            </nav>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              onClick={onOpenKeysGuide}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 transition-colors"
              title="API Keys & Free Guides"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Free API Keys</span>
            </button>

            <button
              onClick={onOpenDirectLinker}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                isGmailLinked
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
              }`}
              title="Link Gmail Directly"
            >
              {isGmailLinked ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Gmail Linked</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Link Gmail</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenCompose}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#00838C] hover:bg-[#006f77] text-white font-semibold text-xs tracking-wide transition-all shadow-sm active:scale-95"
            >
              <PenSquare className="w-3.5 h-3.5" />
              <span>Compose</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav Tabs */}
        <div className="flex md:hidden overflow-x-auto py-2.5 border-t border-neutral-800 gap-1 text-xs">
          <button
            onClick={() => onSelectTab('webmail')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'webmail' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400'
            }`}
          >
            <span>Inbox</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#00838C] text-[10px] text-white font-bold">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onSelectTab('forwarders')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              currentTab === 'forwarders' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400'
            }`}
          >
            Forwarders
          </button>
          <button
            onClick={() => onSelectTab('gmail')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              currentTab === 'gmail' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400'
            }`}
          >
            Gmail Send-As
          </button>
          <button
            onClick={() => onSelectTab('dns')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              currentTab === 'dns' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400'
            }`}
          >
            DNS Records
          </button>
        </div>
      </div>
    </header>
  );
};
