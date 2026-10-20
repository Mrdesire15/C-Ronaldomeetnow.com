export type NavTab = 'webmail' | 'forwarders' | 'gmail' | 'dns';
export type Step = 'connect' | 'inbound' | 'outbound' | 'dashboard';

export type RelayProvider = 'resend' | 'brevo' | 'smtp';

export interface WebmailMessage {
  id: string;
  from: string;
  fromName: string;
  to: string;
  subject: string;
  body: string;
  html?: string;
  date: string;
  read: boolean;
  folder: 'inbox' | 'sent';
}

export interface DnsRecord {
  type: 'MX' | 'TXT' | 'CNAME' | 'A';
  name: string;
  value: string;
  priority?: number;
  purpose: 'Inbound Forwarding' | 'SPF Authentication' | 'DKIM Signature' | 'DMARC Policy' | 'Domain Verification';
  status?: 'verified' | 'propagating' | 'missing' | 'optional';
}

export interface DnsCheckResult {
  domain: string;
  timestamp: string;
  ns: string[];
  isCloudflareNs: boolean;
  mx: Array<{ priority: number; exchange: string }>;
  isCloudflareMx: boolean;
  spf: {
    raw: string | null;
    found: boolean;
    hasCloudflare: boolean;
    hasResend: boolean;
    hasBrevo: boolean;
  };
  dkim: {
    raw: string | null;
    found: boolean;
    selector: string;
  };
  dmarc: {
    raw: string | null;
    found: boolean;
  };
}

export interface ForwardingAlias {
  id: string;
  aliasPrefix: string; // e.g. "contact", "hello", "*"
  forwardTo: string; // e.g. "user@gmail.com"
  enabled: boolean;
  notes?: string;
}

export interface SetupState {
  domain: string;
  primaryEmail: string; // the destination Gmail address
  aliasPrefix: string; // e.g. "contact"
  selectedRelay: RelayProvider;
  resendApiKey: string;
  brevoApiKey: string;
  smtpConfig: {
    host: string;
    port: number;
    user: string;
    pass: string;
    secure: boolean;
  };
  cloudflareToken: string;
  currentTab: NavTab;
  step?: Step;
  gmailLinked?: boolean;
  googleAppPassword?: string;
  aliases: ForwardingAlias[];
}
