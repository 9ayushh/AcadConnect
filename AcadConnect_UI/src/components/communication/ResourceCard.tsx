import React from 'react';
import { Resource } from '../../types';
import {
  ExternalLink,
  GitBranch,
  FileText,
  FileCode,
  Globe,
  Trash2,
  BookOpen,
} from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
  canDelete?: boolean;
  onDelete?: (id: string) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  canDelete = false,
  onDelete,
}) => {
  const getTypeBadge = (type: Resource['type']) => {
    switch (type) {
      case 'GITHUB':
        return {
          icon: <GitBranch className="w-3.5 h-3.5" />,
          label: 'GitHub Repo',
          color: 'bg-slate-100 text-slate-800',
        };
      case 'DRIVE':
      case 'DOCUMENTATION':
        return {
          icon: <FileCode className="w-3.5 h-3.5" />,
          label: 'Documentation',
          color: 'bg-indigo-50 text-indigo-700',
        };
      case 'PDF':
        return {
          icon: <FileText className="w-3.5 h-3.5" />,
          label: 'PDF Document',
          color: 'bg-rose-50 text-rose-700',
        };
      case 'GUIDELINES':
        return {
          icon: <BookOpen className="w-3.5 h-3.5" />,
          label: 'Guidelines',
          color: 'bg-emerald-50 text-emerald-700',
        };
      case 'WEBSITE':
      default:
        return {
          icon: <Globe className="w-3.5 h-3.5" />,
          label: 'Web Link',
          color: 'bg-blue-50 text-blue-700',
        };
    }
  };

  const badge = getTypeBadge(resource.type);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${badge.color}`}
          >
            {badge.icon}
            <span>{badge.label}</span>
          </span>

          {canDelete && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(resource.id)}
              className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
              title="Delete resource"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <h4 className="text-sm font-bold text-slate-900 leading-snug">{resource.title}</h4>
        {resource.description && (
          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {resource.description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-400 text-[11px]">Shared by {resource.sharedByName}</span>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800"
        >
          <span>Open</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
