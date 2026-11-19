import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupService } from '../../services/groupService';
import { PageHeader } from '../../components/common/PageHeader';
import { GroupCard } from '../../components/group/GroupCard';
import { SubgroupCard } from '../../components/group/SubgroupCard';
import { CreateGroupModal } from '../../components/group/CreateGroupModal';
import { InviteLinkBox } from '../../components/group/InviteLinkBox';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { Plus, Users, FolderGit2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const TeacherGroupsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('group-1');

  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: ['teacherGroups'],
    queryFn: () => groupService.getAllGroups(),
  });

  const activeGroup = groups?.find((g) => g.id === selectedGroupId) || groups?.[0];

  const { data: subgroups, isLoading: subsLoading } = useQuery({
    queryKey: ['groupSubgroups', activeGroup?.id],
    queryFn: () => groupService.getGroupSubgroups(activeGroup?.id || 'group-1'),
    enabled: !!activeGroup?.id,
  });

  const createGroupMutation = useMutation({
    mutationFn: (data: { name: string; description: string }) => groupService.createGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherGroups'] });
      toast.success('Main academic group created successfully!');
    },
    onError: (err: unknown) => {
      toast.error((err as { message?: string })?.message || 'Failed to create group');
    },
  });

  if (groupsLoading) {
    return <Loader size="lg" label="Loading instructor groups..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Groups Management"
        description="Create main course divisions, generate student invite links, and supervise project subgroups"
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Create Main Group
          </Button>
        }
      />

      {/* Group selector tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {groups?.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setSelectedGroupId(g.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeGroup?.id === g.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {activeGroup && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <GroupCard group={activeGroup} showActions={false} />
            </div>
            <div>
              <InviteLinkBox inviteCode={activeGroup.inviteCode} groupName={activeGroup.name} />
            </div>
          </div>

          {/* Subgroups in this Main Group */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Subgroups in {activeGroup.name}
                </h3>
                <p className="text-xs text-slate-500">
                  All active project subgroups created by students (max 3 students per subgroup)
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                {subgroups?.length || 0} Subgroups
              </span>
            </div>

            {subsLoading ? (
              <Loader label="Loading subgroups..." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {subgroups?.map((sg) => (
                  <SubgroupCard
                    key={sg.id}
                    subgroup={sg}
                    isTeacherView={true}
                    onOpen={() => window.location.assign(`/teacher/submissions`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={async (data) => {
          await createGroupMutation.mutateAsync(data);
        }}
        loading={createGroupMutation.isPending}
      />
    </div>
  );
};
