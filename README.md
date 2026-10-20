# Free Custom Domain Email Forwarder & Outbound Relay

A 100% free web app and configuration engine that allows you to set up a custom email address (e.g. `contact@yourdomain.com`) forwarding incoming mail to your existing personal Gmail inbox, while allowing you to send and reply directly from Gmail showing your custom domain in the "From:" header (not your underlying @gmail.com address).

## Features
- **100% Free Tiers:** Cloudflare Email Routing (free for up to 200 custom aliases) + Resend (3,000 free emails/month) or Brevo (300 free emails/day = 9,000/month). Zero subscription fees forever.
- **Gmail-Centric Inbound & Outbound:** Incoming emails land straight in your Gmail inbox; outbound replies mask your personal `@gmail.com` address.
- **Google Jan 2027 Deprecation Ready:** Uses authenticated SMTP relay with SPF, DKIM, and DMARC alignments instead of deprecated basic external SMTP.
- **Live DNS Diagnostic:** Queries authoritative DNS records (MX, TXT, SPF, DKIM, DMARC, Nameservers) via Node DNS and Google DNS-over-HTTPS.
- **Gmail "Send Mail As" Interactive Simulator:** Interactive visual walkthrough modeling Gmail's exact settings dialog.
- **Live Test Email Dispatcher:** Directly test outbound delivery with real headers verification.
- **Aliases Manager:** Add multiple aliases (`contact@`, `hello@`, `support@`, `*` catch-all) with instant forwarding rules.

## Quick Start
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

App runs at `http://localhost:3000`.

## Architecture & Flow
```
[Sender] ──> [contact@yourdomain.com]
                  │
                  ▼ (Cloudflare Email Routing Free Tier)
             [user@gmail.com (Your Personal Inbox)]
                  │
                  ▼ (User hits "Reply" or "Compose" in Gmail)
             [Gmail "Send As" Alias configured with SMTP Relay]
                  │
                  ▼ (Authenticated Relay: Resend / Brevo)
[Recipient] <── [From: contact@yourdomain.com]
```

## Free Quotas & Disclaimers
1. **Cloudflare Email Routing:** Up to 200 custom aliases per domain. Free forever.
2. **Resend:** 3,000 free emails/month.
3. **Brevo:** 300 free emails/day (9,000 emails/month).
4. **DNS Propagation:** DNS changes (MX, TXT) typically resolve in 1–5 minutes globally, but may take up to 24 hours depending on TTL and registrar cache.
