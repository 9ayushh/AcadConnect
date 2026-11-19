import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { announcementService } from '../../services/announcementService';
import { groupService } from '../../services/groupService';
import { PageHeader } from '../../components/common/PageHeader';
import { AnnouncementCard } from '../../components/communication/AnnouncementCard';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';

export const StudentAnnouncementsPage: React.FC = () => {
  const { data: myGroup } = useQuery({
    queryKey: ['myGroup'],
    queryFn: () => groupService.getMyGroup(),
  });

  const groupId = myGroup?.mainGroup?.id || 'group-1';

  const { data: announcements, isLoading } = useQuery({
    queryKey: ['announcements', groupId],
    queryFn: () => announcementService.getAnnouncements(groupId),
  });

  if (isLoading) {
    return <Loader size="lg" label="Loading course announcements..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Announcements"
        description="Official notices, schedules, and evaluation instructions from your course instructor"
      />

      {announcements && announcements.length > 0 ? (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <AnnouncementCard key={ann.id} announcement={ann} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Announcements Yet"
          description="Your instructor has not posted any announcements to this group yet."
        />
      )}
    </div>
  );
};
