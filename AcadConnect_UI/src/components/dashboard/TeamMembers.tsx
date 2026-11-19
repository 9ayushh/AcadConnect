import React from 'react';
import { SubgroupMember } from '../../types';
import { GraduationCap, Shield } from 'lucide-react';

interface TeamMembersProps {
  members?: SubgroupMember[];
  teacherName?: string;
}

export const TeamMembers: React.FC<TeamMembersProps> = ({
  members = [],
  teacherName = 'Dr. Rajesh Kumar',
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900">Project Team & Guide</h3>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
          {members.length} / 3 Members
        </span>
      </div>

      <div className="space-y-3">
        {/* Teacher / Mentor */}
        <div className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{teacherName}</p>
              <p className="text-[11px] text-indigo-600 font-medium">Faculty Project Guide</p>
            </div>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
            Guide
          </span>
        </div>

        {/* Students */}
        {members.map((mem, idx) => (
          <div
            key={mem.id || idx}
            className="p-3 rounded-lg border border-slate-100 bg-white flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center border border-slate-200">
                {mem.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">{mem.name}</p>
                <p className="text-[11px] text-slate-500">
                  {mem.rollNumber} • {mem.email}
                </p>
              </div>
            </div>
            {idx === 0 && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 flex items-center gap-1">
                <Shield className="w-3 h-3 text-slate-400" />
                Leader
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
