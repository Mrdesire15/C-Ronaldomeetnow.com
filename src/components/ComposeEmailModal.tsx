import React, { useState } from 'react';
import { X, Send, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Mail } from 'lucide-react';
import { SetupState } from '../types';

interface ComposeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromEmail: string;
  defaultTo?: string;
  defaultSubject?: string;
  state: SetupState;
  onEmailSent?: () => void;
}

export const ComposeEmailModal: React.FC<ComposeEmailModalProps> = ({
  isOpen,
  onClose,
  fromEmail,
  defaultTo = '',
  defaultSubject = '',
  state,
  onEmailSent,
}) => {
  const [fromName, setFromName] = useState('Contact');
  const [toEmail, setToEmail] = useState(defaultTo || state.primaryEmail || '');
  const [subject, setSubject] = useState(defaultSubject || '');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toEmail.trim() || !subject.trim() || !body.trim()) return;

    setLoading(true);
    setStatus(null);

    try {
      // Determine best relay
      let provider = 'instant';
      let apiKey = '';

      if (state.selectedRelay === 'resend' && state.resendApiKey) {
        provider = 'resend';
        apiKey = state.resendApiKey;
      } else if (state.selectedRelay === 'brevo' && state.brevoApiKey) {
        provider = 'brevo';
        apiKey = state.brevoApiKey;
      } else if (state.selectedRelay === 'smtp' && state.smtpConfig.pass) {
        provider = 'smtp';
      }

      const res = await fetch('/api/email/test-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          apiKey,
          smtpConfig: state.smtpConfig,
          fromEmail,
          fromName,
          toEmail: toEmail.trim(),
          subject: subject.trim(),
          customBody: body.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatus({
          success: false,
          message: data.error || 'Failed to dispatch email. Check parameters.',
        });
      } else {
        setStatus({
          success: true,
          message: `Email successfully delivered to ${toEmail} with zero watermarks!`,
        });
        if (onEmailSent) onEmailSent();
        setTimeout(() => {
          onClose();
          setStatus(null);
          setSubject('');
          setBody('');
        }, 1500);
      }
    } catch (err: any) {
      setStatus({
        success: false,
        message: err.message || 'Network error sending email',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl border border-neutral-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00838C] text-white flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Compose Clean Message</h2>
              <p className="text-[11px] text-neutral-400">
                Sending from <span className="font-mono text-emerald-400">{fromEmail}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSend} className="p-5 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 uppercase mb-1">
                From Name
              </label>
              <input
                type="text"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#00838C]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 uppercase mb-1">
                From Address
              </label>
              <input
                type="text"
                readOnly
                value={fromEmail}
                className="w-full px-3 py-2 bg-neutral-100 border border-neutral-300 rounded-lg text-xs font-mono text-neutral-700 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 uppercase mb-1">
              Recipient Email (To)
            </label>
            <input
              type="email"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              placeholder="recipient@example.com or your Gmail"
              required
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#00838C]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 uppercase mb-1">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject of your message"
              required
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#00838C]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 uppercase mb-1">
              Email Body (No Watermarks, Pure Text)
            </label>
            <textarea
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your email here... It will be sent exactly as typed with no advertising or watermarks."
              required
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#00838C] leading-relaxed resize-none font-sans"
            />
          </div>

          {status && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                status.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {status.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{status.message}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-100">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Clean &amp; Unbranded Headers</span>
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-lg text-neutral-600 hover:bg-neutral-100 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-[#00838C] hover:bg-[#006f77] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? 'Sending...' : 'Send Message'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
