import React from 'react';
import { Project } from '../../types';
import { StatusPill } from '../common/StatusPill';
import { ProgressBar } from '../dashboard/ProgressBar';
import { formatDate } from '../../utils/formatters';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
  to?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, to }) => {
  const detailLink = to || `/student/project`;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
              {project.mainGroupName || 'Academic Group'}
            </span>
            <h3 className="mt-1 text-lg font-bold text-slate-900 leading-snug">
              {project.title}
            </h3>
          </div>
          <StatusPill status={project.status} size="sm" />
        </div>

        <p className="mt-3 text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        <div className="mt-5">
          <ProgressBar progress={project.progress} label="Milestones Progress" />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-400" />
            {project.teacherName}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {formatDate(project.deadline)}
          </span>
        </div>

        <Link
          to={detailLink}
          className="font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
        >
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
