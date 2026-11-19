import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { assignmentService } from '../../services/assignmentService';
import { groupService } from '../../services/groupService';
import { PageHeader } from '../../components/common/PageHeader';
import { AssignmentCard } from '../../components/communication/AssignmentCard';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { useNavigate } from 'react-router-dom';

export const StudentAssignmentsPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: myGroup } = useQuery({
    queryKey: ['myGroup'],
    queryFn: () => groupService.getMyGroup(),
  });

  const groupId = myGroup?.mainGroup?.id || 'group-1';

  const { data: assignments, isLoading } = useQuery({
    queryKey: ['assignments', groupId],
    queryFn: () => assignmentService.getAssignments(groupId),
  });

  if (isLoading) {
    return <Loader size="lg" label="Loading group assignments..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Assignment Deliverables"
        description="Review project milestone deliverables, submission deadlines, and lock states"
      />

      {assignments && assignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments.map((assign) => (
            <AssignmentCard
              key={assign.id}
              assignment={assign}
              onAction={() => navigate('/student/submission')}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Assignments Posted"
          description="Your course instructor has not posted any active assignments yet."
        />
      )}
    </div>
  );
};
