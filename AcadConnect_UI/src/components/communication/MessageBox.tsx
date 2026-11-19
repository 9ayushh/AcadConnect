import React, { useState } from 'react';
import { SubgroupMessage } from '../../types';
import { formatDateTime } from '../../utils/formatters';
import { MessageSquare, Send, User } from 'lucide-react';
import { Button } from '../common/Button';

interface MessageBoxProps {
  messages: SubgroupMessage[];
  canSend?: boolean;
  targetSubgroupName?: string;
  onSendMessage?: (content: string) => Promise<void>;
  loading?: boolean;
}

export const MessageBox: React.FC<MessageBoxProps> = ({
  messages,
  canSend = false,
  targetSubgroupName = 'Subgroup',
  onSendMessage,
  loading = false,
}) => {
  const [content, setContent] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !onSendMessage) return;
    await onSendMessage(content.trim());
    setContent('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[480px]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Direct Discussion — {targetSubgroupName}
          </h3>
        </div>
        <span className="text-xs text-slate-400">{messages.length} messages</span>
      </div>

      {/* Messages stream */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
            <MessageSquare className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-xs">No direct messages exchanged yet.</p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1 bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-900">{m.senderName}</span>
                  <span className="text-[10px] text-slate-400">{formatDateTime(m.createdAt)}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{m.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Send message input */}
      {canSend && onSendMessage && (
        <form onSubmit={handleSend} className="p-3 border-t border-slate-100 bg-white flex gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Message ${targetSubgroupName}...`}
            className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Button type="submit" size="sm" loading={loading} icon={<Send className="w-3.5 h-3.5" />}>
            Send
          </Button>
        </form>
      )}
    </div>
  );
};
