import React from 'react';
import { Badge } from './Badge';
import { getStatusLabel } from '../../utils/formatters';
import { CheckCircle2, Clock, AlertCircle, XCircle, Info } from 'lucide-react';

export interface StatusPillProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, size = 'md' }) => {
  const norm = status.toUpperCase();

  let variant: 'slate' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'blue' = 'slate';
  let icon = <Clock className="w-3.5 h-3.5" />;

  switch (norm) {
    case 'APPROVED':
    case 'COMPLETED':
      variant = 'emerald';
      icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      break;

    case 'REVISION_REQUIRED':
    case 'LATE':
    case 'DUE_SOON':
      variant = 'amber';
      icon = <AlertCircle className="w-3.5 h-3.5 text-amber-600" />;
      break;

    case 'REJECTED':
      variant = 'rose';
      icon = <XCircle className="w-3.5 h-3.5 text-rose-600" />;
      break;

    case 'SUBMITTED':
    case 'UNDER_REVIEW':
      variant = 'blue';
      icon = <Info className="w-3.5 h-3.5 text-blue-600" />;
      break;

    case 'IN_PROGRESS':
    case 'OPEN':
      variant = 'indigo';
      icon = <Clock className="w-3.5 h-3.5 text-indigo-600" />;
      break;

    case 'DRAFT':
    case 'PENDING':
    case 'NOT_STARTED':
    case 'LOCKED':
    case 'CLOSED':
    default:
      variant = 'slate';
      icon = <Clock className="w-3.5 h-3.5 text-slate-500" />;
      break;
  }

  return (
    <Badge variant={variant} size={size} icon={icon}>
      {getStatusLabel(norm)}
    </Badge>
  );
};
