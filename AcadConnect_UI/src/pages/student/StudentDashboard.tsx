import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { groupService } from '../../services/groupService';
import { projectService } from '../../services/projectService';
import { WelcomeHeader } from '../../components/dashboard/WelcomeHeader';
import { QuickStats } from '../../components/dashboard/QuickStats';
import { QuickActions } from '../../components/dashboard/QuickActions';
import { ActiveProjectCard } from '../../components/dashboard/ActiveProjectCard';
import { UpcomingDeadline } from '../../components/dashboard/UpcomingDeadline';
import { TeamMembers } from '../../components/dashboard/TeamMembers';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { Loader } from '../../components/common/Loader';
import { PageHeader } from '../../components/common/PageHeader';

export const StudentDashboard: React.FC = () => {
  const { data: groupData, isLoading: groupLoading } = useQuery({
    queryKey: ['myGroup'],
    queryFn: () => groupService.getMyGroup(),
  });

  const { data: projects, isLoading: projectLoading } = useQuery({
    queryKey: ['studentProjects'],
    queryFn: () => projectService.getProjects(),
  });

  if (groupLoading || projectLoading) {
    return <Loader size="lg" label="Loading student workspace..." />;
  }

  const activeProject = projects && projects.length > 0 ? projects[0] : null;
  const subgroup = groupData?.subgroup;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Project Workspace"
        description="Monitor project progress, review milestones, and submit capstone deliverables"
      />

      <WelcomeHeader
        nextStepMessage="Sprint 3 submission is currently under review by Dr. Rajesh Kumar. Check feedback below."
      />

      <QuickStats
        activeProjectTitle={activeProject?.title || 'Distributed Health AI'}
        submissionStatus={subgroup?.submissionStatus || 'Submitted'}
        memberCount={subgroup?.members.length || 3}
        upcomingDue="Nov 15"
      />

      {/* Primary Immediate Action buttons per §1.1 & §6.2 */}
      <QuickActions />

      {/* Split layout: Active Project beside Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActiveProjectCard project={activeProject} />
        </div>
        <div>
          <UpcomingDeadline />
        </div>
      </div>

      {/* Team Members & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamMembers
          members={subgroup?.members || []}
          teacherName={groupData?.mainGroup?.teacherName || 'Dr. Rajesh Kumar'}
        />
        <RecentActivity />
      </div>
    </div>
  );
};
