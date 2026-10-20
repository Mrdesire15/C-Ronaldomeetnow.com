import React, { useState, useEffect } from 'react';
import {
  Mail,
  Inbox,
  Send,
  Trash2,
  Reply,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
  ShieldCheck,
  PenSquare,
} from 'lucide-react';
import { WebmailMessage } from '../types';

interface WebmailViewProps {
  customEmail: string;
  primaryEmail: string;
  onOpenCompose: (defaultTo?: string, defaultSubject?: string) => void;
}

export const WebmailView: React.FC<WebmailViewProps> = ({
  customEmail,
  primaryEmail,
  onOpenCompose,
}) => {
  const [folder, setFolder] = useState<'inbox' | 'sent'>('inbox');
  const [messages, setMessages] = useState<WebmailMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<WebmailMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch messages from backend
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/webmail/messages?folder=${folder}`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
        if (data.messages.length > 0 && !selectedMessage) {
          setSelectedMessage(data.messages[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [folder]);

  const handleSelectMessage = (msg: WebmailMessage) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      // Mark as read
      fetch('/api/webmail/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: msg.id }),
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
      );
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch('/api/webmail/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const filteredMessages = messages.filter(
    (m) =>
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col min-h-[640px]">
      {/* Top Webmail Action Toolbar */}
      <div className="p-4 sm:p-5 border-b border-neutral-200 bg-neutral-50 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00838C]/10 text-[#00838C] flex items-center justify-center font-bold">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-neutral-900 font-mono">{customEmail}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                Active &amp; Ready
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Inbound messages forward to <span className="text-neutral-700 font-medium">{primaryEmail}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenCompose()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00838C] hover:bg-[#006f77] text-white font-bold text-xs tracking-wide shadow-sm transition-all"
          >
            <PenSquare className="w-3.5 h-3.5" />
            <span>New Message</span>
          </button>

          <button
            onClick={fetchMessages}
            disabled={loading}
            className="p-2 rounded-xl bg-white border border-neutral-300 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            title="Refresh inbox"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Mail layout: 3-column (Folder Sidebar, Message List, Message Viewer) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-full md:w-52 border-b md:border-b-0 md:border-r border-neutral-200 bg-neutral-50/50 p-3 flex flex-row md:flex-col gap-1 shrink-0">
          <button
            onClick={() => {
              setFolder('inbox');
              setSelectedMessage(null);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              folder === 'inbox'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'text-neutral-600 hover:bg-neutral-200/60'
            }`}
          >
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4" />
              <span>Inbox</span>
            </div>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
              folder === 'inbox' ? 'bg-[#00838C] text-white' : 'bg-neutral-200 text-neutral-700'
            }`}>
              {messages.filter((m) => !m.read).length || messages.length}
            </span>
          </button>

          <button
            onClick={() => {
              setFolder('sent');
              setSelectedMessage(null);
            }}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              folder === 'sent'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'text-neutral-600 hover:bg-neutral-200/60'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Sent Messages</span>
          </button>

          <div className="mt-auto hidden md:block pt-4 border-t border-neutral-200 text-[11px] text-neutral-500 space-y-1">
            <div className="flex items-center gap-1 font-semibold text-neutral-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero Watermarks</span>
            </div>
            <p className="leading-tight text-[10px]">
              Outgoing mail contains pure headers with your domain only.
            </p>
          </div>
        </div>

        {/* Middle Column: Message List */}
        <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-neutral-200 flex flex-col bg-white shrink-0">
          {/* Search bar */}
          <div className="p-3 border-b border-neutral-200">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="w-full pl-9 pr-3 py-1.5 bg-neutral-100 rounded-lg text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#00838C]"
              />
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 max-h-[500px]">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-400">
                {loading ? 'Loading messages...' : 'No messages in this folder.'}
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-3.5 cursor-pointer transition-colors relative ${
                      isSelected ? 'bg-neutral-100' : 'hover:bg-neutral-50'
                    } ${!msg.read ? 'font-semibold' : ''}`}
                  >
                    {!msg.read && (
                      <span className="w-2 h-2 rounded-full bg-[#00838C] absolute left-1.5 top-5"></span>
                    )}
                    <div className="flex items-baseline justify-between gap-1 mb-1">
                      <span className="text-xs text-neutral-900 truncate">
                        {folder === 'sent' ? `To: ${msg.to}` : msg.fromName || msg.from}
                      </span>
                      <span className="text-[10px] text-neutral-400 shrink-0">
                        {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-800 truncate mb-1">{msg.subject}</div>
                    <p className="text-[11px] text-neutral-500 truncate line-clamp-1">
                      {msg.body}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Message Reader */}
        <div className="flex-1 bg-white p-6 flex flex-col overflow-y-auto">
          {selectedMessage ? (
            <div className="space-y-6">
              {/* Message Header */}
              <div className="border-b border-neutral-200 pb-5">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-xl font-bold text-neutral-900 leading-snug">
                    {selectedMessage.subject}
                  </h2>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        onOpenCompose(
                          folder === 'sent' ? selectedMessage.to : selectedMessage.from,
                          `Re: ${selectedMessage.subject}`
                        )
                      }
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition-colors"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                    <button
                      onClick={(e) => handleDelete(selectedMessage.id, e)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-neutral-600 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center font-bold text-xs uppercase">
                      {(selectedMessage.fromName || selectedMessage.from).substring(0, 2)}
                    </div>
                    <div>
                      <span className="font-bold text-neutral-900">
                        {selectedMessage.fromName || selectedMessage.from}
                      </span>{' '}
                      <span className="text-neutral-500 font-mono text-[11px]">
                        &lt;{selectedMessage.from}&gt;
                      </span>
                      <p className="text-[11px] text-neutral-400">
                        To: <span className="font-mono">{selectedMessage.to}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-neutral-400">
                    {new Date(selectedMessage.date).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Message Body - Clean without watermark */}
              <div className="text-sm text-neutral-800 leading-relaxed font-sans whitespace-pre-wrap">
                {selectedMessage.body}
              </div>

              {/* Bottom reply helper */}
              <div className="pt-6 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <span>Direct delivery via custom domain forwarder</span>
                <button
                  onClick={() =>
                    onOpenCompose(
                      folder === 'sent' ? selectedMessage.to : selectedMessage.from,
                      `Re: ${selectedMessage.subject}`
                    )
                  }
                  className="text-[#00838C] hover:underline font-semibold"
                >
                  Click to reply as {customEmail}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-neutral-400 space-y-3">
              <Mail className="w-12 h-12 text-neutral-300 stroke-1" />
              <p className="text-sm">Select an email to read its contents</p>
              <button
                onClick={() => onOpenCompose()}
                className="px-4 py-2 rounded-xl bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 transition-colors"
              >
                Compose New Message
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
