import React from 'react';
import { Project } from '../../types';
import { StatusPill } from '../common/StatusPill';
import { ProgressBar } from './ProgressBar';
import { formatDate } from '../../utils/formatters';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ActiveProjectCardProps {
  project?: Project | null;
}

export const ActiveProjectCard: React.FC<ActiveProjectCardProps> = ({ project }) => {
  if (!project) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-800">Active Capstone Project</h3>
        <p className="mt-2 text-sm text-slate-500">
          No project has been assigned to your subgroup yet. Contact your course instructor.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow transition-shadow">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            {project.mainGroupName || 'Academic Group Project'}
          </span>
          <h3 className="mt-1 text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            {project.title}
          </h3>
        </div>
        <StatusPill status={project.status} />
      </div>

      <p className="mt-3 text-sm text-slate-600 line-clamp-2 leading-relaxed">
        {project.description}
      </p>

      {/* Progress Bar */}
      <div className="mt-5">
        <ProgressBar progress={project.progress} label="Milestone Completion" />
      </div>

      {/* Meta Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Guide: <strong className="text-slate-700 font-medium">{project.teacherName}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Due: <strong className="text-slate-700 font-medium">{formatDate(project.deadline)}</strong></span>
          </div>
        </div>

        <Link
          to="/student/project"
          className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700"
        >
          <span>View Project Details</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
