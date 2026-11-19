import React, { useState } from 'react';
import { Copy, Check, Link as LinkIcon, Share2 } from 'lucide-react';
import { Button } from '../common/Button';
import toast from 'react-hot-toast';

interface InviteLinkBoxProps {
  inviteCode: string;
  groupName: string;
}

export const InviteLinkBox: React.FC<InviteLinkBoxProps> = ({ inviteCode, groupName }) => {
  const [copied, setCopied] = useState(false);
  const fullInviteUrl = `${window.location.origin}/join/${inviteCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullInviteUrl);
    setCopied(true);
    toast.success('Invite link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-5 shadow-xs">
      <div className="flex items-center gap-2 mb-2 text-indigo-900 font-semibold text-sm">
        <Share2 className="w-4 h-4 text-indigo-600" />
        <span>Invite Students to {groupName}</span>
      </div>
      <p className="text-xs text-indigo-700/80 mb-3 leading-relaxed">
        Share this unique invitation link with students. When they click it, they will be registered into this academic project group.
      </p>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-indigo-200 text-xs font-mono text-slate-700 truncate shadow-2xs">
          <LinkIcon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span className="truncate">{fullInviteUrl}</span>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={copyToClipboard}
          icon={copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          className="shrink-0"
        >
          {copied ? 'Copied' : 'Copy Link'}
        </Button>
      </div>
    </div>
  );
};
