import React from 'react';
import { StatCard } from '../common/StatCard';
import { FolderGit2, CheckCircle2, AlertCircle, Users } from 'lucide-react';

interface QuickStatsProps {
  activeProjectTitle?: string;
  submissionStatus?: string;
  memberCount?: number;
  upcomingDue?: string;
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  activeProjectTitle = 'Major Capstone',
  submissionStatus = 'Submitted',
  memberCount = 3,
  upcomingDue = 'Nov 15',
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        label="Active Project"
        value="1 Project"
        description={activeProjectTitle}
        icon={<FolderGit2 className="w-5 h-5" />}
      />
      <StatCard
        label="Submission Status"
        value={submissionStatus}
        description="Sprint 3 Deliverable"
        icon={<CheckCircle2 className="w-5 h-5" />}
        trendType={submissionStatus === 'Approved' ? 'positive' : 'neutral'}
      />
      <StatCard
        label="Group Members"
        value={`${memberCount} / 3`}
        description="Subgroup Capacity Filled"
        icon={<Users className="w-5 h-5" />}
      />
      <StatCard
        label="Next Deadline"
        value={upcomingDue}
        description="Prototype Review"
        icon={<AlertCircle className="w-5 h-5 text-amber-600" />}
        trend="Due Soon"
        trendType="negative"
      />
    </div>
  );
};
