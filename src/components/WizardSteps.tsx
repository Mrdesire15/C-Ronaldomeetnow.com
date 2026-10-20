import React from 'react';
import { Globe, ArrowRightLeft, Send, LayoutDashboard, CheckCircle2 } from 'lucide-react';
import { Step } from '../types';

interface WizardStepsProps {
  currentStep: Step;
  onSelectStep: (step: Step) => void;
  isDomainVerified?: boolean;
  isInboundConfigured?: boolean;
  isOutboundConfigured?: boolean;
}

export const WizardSteps: React.FC<WizardStepsProps> = ({
  currentStep,
  onSelectStep,
  isDomainVerified,
  isInboundConfigured,
  isOutboundConfigured,
}) => {
  const steps: Array<{
    id: Step;
    number: string;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    completed?: boolean;
  }> = [
    {
      id: 'connect',
      number: '1',
      label: 'Connect Domain',
      sublabel: 'DNS & MX records',
      icon: <Globe className="w-4 h-4" />,
      completed: isDomainVerified,
    },
    {
      id: 'inbound',
      number: '2',
      label: 'Set Up Forwarding',
      sublabel: 'Cloudflare -> Gmail',
      icon: <ArrowRightLeft className="w-4 h-4" />,
      completed: isInboundConfigured,
    },
    {
      id: 'outbound',
      number: '3',
      label: 'Configure "Send As"',
      sublabel: 'Gmail relay & alias',
      icon: <Send className="w-4 h-4" />,
      completed: isOutboundConfigured,
    },
    {
      id: 'dashboard',
      number: '4',
      label: 'Status Dashboard',
      sublabel: 'Aliases & health monitor',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
  ];

  return (
    <div className="bg-slate-900/60 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-3 no-scrollbar" aria-label="Wizard Steps">
          {steps.map((step) => {
            const isActive = currentStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => onSelectStep(step.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all whitespace-nowrap border ${
                  isActive
                    ? 'bg-blue-600/15 border-blue-500/40 text-blue-400 shadow-sm'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 ${
                    step.completed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {step.completed ? <CheckCircle2 className="w-4 h-4" /> : step.icon}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-200">{step.label}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 hidden sm:block">{step.sublabel}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
