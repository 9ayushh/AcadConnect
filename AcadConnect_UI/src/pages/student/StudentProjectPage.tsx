import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectService } from '../../services/projectService';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusPill } from '../../components/common/StatusPill';
import { ProgressBar } from '../../components/dashboard/ProgressBar';
import { MilestoneList } from '../../components/project/MilestoneList';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';
import { Calendar, User, FolderGit2, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export const StudentProjectPage: React.FC = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['studentProjects'],
    queryFn: () => projectService.getProjects(),
  });

  if (isLoading) {
    return <Loader size="lg" label="Loading project details..." />;
  }

  const project = projects && projects.length > 0 ? projects[0] : null;

  if (!project) {
    return (
      <EmptyState
        title="No Project Assigned"
        description="Your subgroup has not yet been assigned a capstone project. Once your instructor assigns your project, all requirements and milestones will appear here."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={project.title}
        description={`Capstone Track: ${project.mainGroupName || 'Computer Science'}`}
        action={
          <Link to="/student/submission">
            <Button variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
              Open Submission Portal
            </Button>
          </Link>
        }
      />

      {/* Main Project Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                {project.subgroupName}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {project.title}
            </h2>
          </div>
          <StatusPill status={project.status} />
        </div>

        <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-3xl">
          {project.description}
        </p>

        {/* Progress Bar derived from milestones (§6.4) */}
        <div className="mt-6 pt-5 border-t border-slate-100 max-w-xl">
          <ProgressBar progress={project.progress} label="Milestones Completed" size="lg" />
        </div>

        {/* Meta details */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-slate-400" />
            <span>
              Faculty Guide: <strong className="text-slate-800">{project.teacherName}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>
              Final Deadline: <strong className="text-slate-800">{formatDate(project.deadline)}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <FolderGit2 className="w-4 h-4 text-slate-400" />
            <span>
              Subgroup: <strong className="text-slate-800">{project.subgroupName}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Milestones Flow (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-2">Project Milestones</h3>
          <p className="text-xs text-slate-500 mb-6">
            Complete each milestone stage according to the semester schedule. Progress is verified
            by your instructor.
          </p>
          <MilestoneList milestones={project.milestones || []} />
        </div>

        {/* Requirements Box (1 Col) */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <span>Deliverable Requirements</span>
          </div>

          <ul className="space-y-3 text-xs text-slate-600">
            {project.requirements?.map((req, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
