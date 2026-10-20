import React, { useState } from 'react';
import { X, Copy, Check, FileText, Download, Terminal, ShieldAlert } from 'lucide-react';

interface SelfHostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SelfHostModal: React.FC<SelfHostModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const readmeContent = `# Free Custom Domain Email Forwarder & Outbound Relay

A 100% free web app and configuration engine that allows you to set up a custom email address (e.g. \`contact@yourdomain.com\`) forwarding incoming mail to your existing personal Gmail inbox, while allowing you to send and reply directly from Gmail showing your custom domain in the "From:" header (not your underlying @gmail.com address).

## Free-Tier Components & Quotas
- **Inbound Forwarding:** Cloudflare Email Routing (Free forever, up to 200 custom aliases).
- **Outbound Relay:** 
  - **Resend:** 3,000 emails/month free (100 emails/day)
  - **Brevo:** 300 emails/day free (9,000 emails/month)
  - **Custom SMTP:** Zero platform fees.
- **Zero Cost:** Never requires Google Workspace ($6/user/mo) or Microsoft 365 ($6/user/mo).

## Google Jan 2027 Deprecation Note
Google is phasing out third-party unauthenticated external "Send mail as" SMTP in January 2027. This tool integrates modern authenticated SMTP relays (Resend / Brevo) with cryptographic SPF and DKIM signatures to ensure 100% compliance and inbox delivery.

## Local Setup & Development
\`\`\`bash
# 1. Clone the repository
git clone https://github.com/your-username/custom-domain-email-forwarder.git
cd custom-domain-email-forwarder

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# App runs at http://localhost:3000
\`\`\`

## Deployment Options

### Deploy to Vercel
1. Push your repository to GitHub.
2. Import project into Vercel.
3. Build command: \`npm run build\`
4. Output directory: \`dist\`

### Deploy to Cloudflare Pages / Workers
1. Connect your GitHub repository to Cloudflare Pages.
2. Framework preset: Vite.
3. Build command: \`npm run build\`
4. Build output directory: \`dist\`

### Deploy with Docker
\`\`\`dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## Disclaimers & Limits
1. **DNS Propagation:** DNS changes (MX, TXT records) typically take between 1 to 5 minutes to propagate worldwide, though in rare situations with certain registrars it may take up to 24 hours.
2. **Privacy:** No user passwords or email contents are stored on this application. All API relays use encrypted TLS endpoints.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(readmeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([readmeContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Self-Hosting Documentation &amp; README</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Open Source
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Setup guide, deployment steps, and free tier architectural documentation.
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
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              README.md Specification
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Markdown' : 'Copy README'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .md</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-96 select-all leading-relaxed whitespace-pre-wrap">
            {readmeContent}
          </div>

          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <ShieldAlert className="w-4 h-4" />
              <span>Free Tier Limits &amp; Propagation Disclaimers</span>
            </div>
            <p className="leading-relaxed">
              • <strong>Cloudflare Email Routing</strong> is free forever for up to 200 address rules. No credit card required.
              <br />
              • <strong>Resend</strong> allows 3,000 free emails/month. <strong>Brevo</strong> allows 300 free emails/day.
              <br />
              • DNS record propagation usually occurs in 1 to 5 minutes across global resolvers.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
