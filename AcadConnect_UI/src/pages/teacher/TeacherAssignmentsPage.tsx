import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentService } from '../../services/assignmentService';
import { groupService } from '../../services/groupService';
import { reportService } from '../../services/reportService';
import { PageHeader } from '../../components/common/PageHeader';
import { AssignmentCard } from '../../components/communication/AssignmentCard';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Loader } from '../../components/common/Loader';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createAssignmentSchema, CreateAssignmentFormData } from '../../utils/validators';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const TeacherAssignmentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: groups } = useQuery({
    queryKey: ['teacherGroups'],
    queryFn: () => groupService.getAllGroups(),
  });

  const groupId = groups?.[0]?.id || 'group-1';

  const { data: assignments, isLoading } = useQuery({
    queryKey: ['assignments', groupId],
    queryFn: () => assignmentService.getAssignments(groupId),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateAssignmentFormData) =>
      assignmentService.createAssignment(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments', groupId] });
      toast.success('Assignment deliverable created successfully!');
      setIsModalOpen(false);
    },
    onError: (err: unknown) => {
      toast.error((err as { message?: string })?.message || 'Failed to create assignment');
    },
  });

  const toggleLockMutation = useMutation({
    mutationFn: (id: string) => assignmentService.toggleLock(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['assignments', groupId] });
      toast.success(`Assignment status updated to ${data.status}`);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAssignmentFormData>({
    resolver: zodResolver(createAssignmentSchema),
    defaultValues: {
      deadline: '2026-11-25T23:59',
    },
  });

  const handleExportAssignment = async (id: string) => {
    try {
      await reportService.exportAssignmentExcel(id);
      toast.success('Assignment submissions workbook exported!');
    } catch {
      toast.error('Failed to export assignment report');
    }
  };

  if (isLoading) {
    return <Loader size="lg" label="Loading assignment deliverables..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Deliverables & Assignment Milestones"
        description="Schedule project submission windows, lock submissions during evaluations, and export assignment records"
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Create Assignment
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignments?.map((assign) => (
          <AssignmentCard
            key={assign.id}
            assignment={assign}
            isTeacher={true}
            onToggleLock={(id) => toggleLockMutation.mutate(id)}
            onExportExcel={handleExportAssignment}
            onAction={() => navigate('/teacher/submissions')}
          />
        ))}
      </div>

      {/* Create Assignment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Assignment Deliverable"
        description="Schedule a project milestone deadline with submission requirements."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit((data) => createMutation.mutate(data))}
              loading={createMutation.isPending}
            >
              Publish Assignment
            </Button>
          </>
        }
      >
        <form
          onSubmit={handleSubmit((data) => createMutation.mutate(data))}
          className="space-y-4"
        >
          <Input
            label="Assignment Title"
            placeholder="e.g. Sprint 4: Final Verification & Test Suite"
            required
            error={errors.title?.message}
            {...register('title')}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Deliverable Description & Requirements
            </label>
            <textarea
              rows={3}
              placeholder="What files, reports, or test suites students must upload..."
              className={`w-full rounded-lg border text-sm p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.description ? 'border-red-300 bg-red-50/20' : 'border-slate-300'
              }`}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-xs text-red-600 font-medium">{errors.description.message}</p>
            )}
          </div>

          <Input
            label="Deadline Date & Time"
            type="datetime-local"
            required
            error={errors.deadline?.message}
            helperText="Students will see countdown urgency and can submit until locked."
            {...register('deadline')}
          />
        </form>
      </Modal>
    </div>
  );
};
