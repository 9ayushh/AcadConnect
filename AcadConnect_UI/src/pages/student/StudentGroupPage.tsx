import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupService } from '../../services/groupService';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { SubgroupCard } from '../../components/group/SubgroupCard';
import { MemberList } from '../../components/group/MemberList';
import { InviteLinkBox } from '../../components/group/InviteLinkBox';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { Plus, LogOut, Users, GraduationCap, ShieldAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSubgroupSchema, CreateSubgroupFormData } from '../../utils/validators';
import toast from 'react-hot-toast';

export const StudentGroupPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['myGroup'],
    queryFn: () => groupService.getMyGroup(),
  });

  const createSubgroupMutation = useMutation({
    mutationFn: (formData: CreateSubgroupFormData) =>
      groupService.createSubgroup(data?.mainGroup.id || 'group-1', formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myGroup'] });
      toast.success('Project subgroup created successfully!');
      setIsCreateModalOpen(false);
    },
    onError: (err: unknown) => {
      toast.error((err as { message?: string })?.message || 'Failed to create subgroup');
    },
  });

  const leaveGroupMutation = useMutation({
    mutationFn: () => groupService.leaveGroup(data?.mainGroup.id || 'group-1'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myGroup'] });
      toast.success('You have left the group.');
      setIsLeaveDialogOpen(false);
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateSubgroupFormData>({
    resolver: zodResolver(createSubgroupSchema),
    defaultValues: {
      name: '',
      description: '',
      memberEmail1: '',
      memberEmail2: '',
    },
  });

  const member1 = watch('memberEmail1');
  const member2 = watch('memberEmail2');
  const filledSlots = 1 + (member1?.trim() ? 1 : 0) + (member2?.trim() ? 1 : 0);

  if (isLoading) {
    return <Loader size="lg" label="Loading group information..." />;
  }

  const mainGroup = data?.mainGroup;
  const subgroup = data?.subgroup;

  return (
    <div className="space-y-6">
      <PageHeader
        title={mainGroup?.name || 'Academic Project Group'}
        description={`Instructed by ${mainGroup?.teacherName || 'Faculty Guide'}`}
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLeaveDialogOpen(true)}
            icon={<LogOut className="w-4 h-4 text-red-500" />}
          >
            Leave Group
          </Button>
        }
      />

      {/* Main Group Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Course Division
            </span>
            <h2 className="text-xl font-bold text-slate-900">{mainGroup?.name}</h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {mainGroup?.description}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>{mainGroup?.teacherName}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>{mainGroup?.memberCount} Students</span>
            </div>
          </div>
        </div>

        {/* Invite link box */}
        {mainGroup && (
          <div className="mt-5">
            <InviteLinkBox inviteCode={mainGroup.inviteCode} groupName={mainGroup.name} />
          </div>
        )}
      </div>

      {/* Student's Subgroup Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">My Project Subgroup</h3>
            <p className="text-xs text-slate-500">
              Subgroups are limited to a maximum of 3 students (§0, §14).
            </p>
          </div>
          {!subgroup && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              Create Subgroup
            </Button>
          )}
        </div>

        {subgroup ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <SubgroupCard subgroup={subgroup} />
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 mb-3">Subgroup Members</h4>
                <MemberList members={subgroup.members} />
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs">
                <ShieldAlert className="w-4 h-4 text-indigo-600" />
                <span>Academic Subgroup Rules</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>A project subgroup cannot exceed 3 members total.</li>
                <li>All subgroup members share the same project submission and grading.</li>
                <li>Students cannot access other subgroups' private workspaces.</li>
              </ul>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No Subgroup Formed Yet"
            description="You are currently in the main course group. Form a project subgroup with up to 2 other peers to start working on your capstone deliverable."
            actionLabel="Create Subgroup (Max 3 Members)"
            onAction={() => setIsCreateModalOpen(true)}
          />
        )}
      </div>

      {/* Create Subgroup Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Project Subgroup"
        description="Form your capstone project team. Enforce maximum 3 students including yourself."
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={createSubgroupMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit((data) => createSubgroupMutation.mutate(data))}
              loading={createSubgroupMutation.isPending}
            >
              Create Subgroup
            </Button>
          </>
        }
      >
        <form
          onSubmit={handleSubmit((data) => createSubgroupMutation.mutate(data))}
          className="space-y-4"
        >
          <Input
            label="Subgroup Name"
            placeholder="e.g. Alpha Synapse"
            required
            error={errors.name?.message}
            {...register('name')}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Project Description</label>
            <textarea
              rows={2}
              placeholder="Brief summary of your project theme..."
              className="w-full rounded-lg border border-slate-300 text-sm p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register('description')}
            />
          </div>

          {/* Member Slots Counter */}
          <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-900">Subgroup Capacity</span>
            <span className="text-xs font-bold text-indigo-700">{filledSlots} of 3 slots used</span>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-700">Add Team Members by Email:</p>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                1
              </span>
              <span>
                {user?.name} ({user?.email}) — <em>Creator / Leader</em>
              </span>
            </div>

            <Input
              label="Teammate 2 Email"
              type="email"
              placeholder="peer1@example.com (optional)"
              error={errors.memberEmail1?.message}
              {...register('memberEmail1')}
            />

            <Input
              label="Teammate 3 Email"
              type="email"
              placeholder="peer2@example.com (optional)"
              error={errors.memberEmail2?.message}
              {...register('memberEmail2')}
            />
          </div>
        </form>
      </Modal>

      {/* Confirm Leave Group Dialog */}
      <ConfirmDialog
        isOpen={isLeaveDialogOpen}
        onClose={() => setIsLeaveDialogOpen(false)}
        onConfirm={() => leaveGroupMutation.mutate()}
        title="Leave Academic Group?"
        message="Leaving this main group will revoke your access to its course announcements, shared resources, and remove you from your current project subgroup."
        confirmLabel="Leave Group"
        variant="danger"
        loading={leaveGroupMutation.isPending}
      />
    </div>
  );
};
