import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectService } from '../../services/projectService';
import { PageHeader } from '../../components/common/PageHeader';
import { ProjectCard } from '../../components/project/ProjectCard';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';

export const TeacherProjectsPage: React.FC = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['teacherProjects'],
    queryFn: () => projectService.getProjects(),
  });

  if (isLoading) {
    return <Loader size="lg" label="Loading supervised projects..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Supervised Capstone Projects"
        description="Monitor student project deliverables, milestone completion rates, and status"
      />

      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} to="/teacher/submissions" />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Projects Under Supervision"
          description="There are currently no active projects linked to your instructor profile."
        />
      )}
    </div>
  );
};
