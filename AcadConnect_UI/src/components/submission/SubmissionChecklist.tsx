import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface SubmissionChecklistProps {
  hasTitle: boolean;
  hasDescription: boolean;
  hasGithub: boolean;
  hasProjectFile: boolean;
  hasSynopsis: boolean;
}

export const SubmissionChecklist: React.FC<SubmissionChecklistProps> = ({
  hasTitle,
  hasDescription,
  hasGithub,
  hasProjectFile,
  hasSynopsis,
}) => {
  const items = [
    { label: 'Project Title & Scope Defined', valid: hasTitle },
    { label: 'Executive Summary & Description', valid: hasDescription },
    { label: 'Verified GitHub Repository Link', valid: hasGithub },
    { label: 'Project Source Code / Executable Archive', valid: hasProjectFile },
    { label: 'IEEE Synopsis / Thesis Document (.pdf/.docx)', valid: hasSynopsis },
  ];

  const totalComplete = items.filter((i) => i.valid).length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-slate-900">Submission Requirements Checklist</h4>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
          {totalComplete} / {items.length} Completed
        </span>
      </div>

      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2 text-xs">
            {item.valid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-slate-300 shrink-0" />
            )}
            <span
              className={
                item.valid ? 'text-slate-800 font-medium' : 'text-slate-400'
              }
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
