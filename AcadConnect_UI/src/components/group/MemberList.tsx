import React from 'react';
import { SubgroupMember } from '../../types';
import { Mail, Hash, Trash2 } from 'lucide-react';

interface MemberListProps {
  members: SubgroupMember[];
  canRemove?: boolean;
  onRemoveMember?: (userId: string) => void;
}

export const MemberList: React.FC<MemberListProps> = ({
  members,
  canRemove = false,
  onRemoveMember,
}) => {
  return (
    <div className="divide-y divide-slate-100">
      {members.map((member, index) => (
        <div key={member.id || index} className="py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
              {member.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                {index === 0 && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700">
                    Leader
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Hash className="w-3 h-3 text-slate-400" />
                  {member.rollNumber}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  {member.email}
                </span>
              </div>
            </div>
          </div>

          {canRemove && index !== 0 && onRemoveMember && (
            <button
              type="button"
              onClick={() => onRemoveMember(member.userId)}
              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
              title="Remove member from subgroup"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
