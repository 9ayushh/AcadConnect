import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementService } from '../../services/announcementService';
import { groupService } from '../../services/groupService';
import { PageHeader } from '../../components/common/PageHeader';
import { AnnouncementCard } from '../../components/communication/AnnouncementCard';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Loader } from '../../components/common/Loader';
import { Plus, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createAnnouncementSchema, CreateAnnouncementFormData } from '../../utils/validators';
import toast from 'react-hot-toast';

export const TeacherAnnouncementsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: groups } = useQuery({
    queryKey: ['teacherGroups'],
    queryFn: () => groupService.getAllGroups(),
  });

  const groupId = groups?.[0]?.id || 'group-1';

  const { data: announcements, isLoading } = useQuery({
    queryKey: ['announcements', groupId],
    queryFn: () => announcementService.getAnnouncements(groupId),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateAnnouncementFormData) =>
      announcementService.createAnnouncement(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements', groupId] });
      toast.success('Announcement published and email notifications queued!');
      setIsModalOpen(false);
    },
    onError: (err: unknown) => {
      toast.error((err as { message?: string })?.message || 'Failed to post announcement');
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAnnouncementFormData>({
    resolver: zodResolver(createAnnouncementSchema),
  });

  if (isLoading) {
    return <Loader size="lg" label="Loading announcements..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Announcements"
        description="Broadcast notices, deadlines, and project instructions to all enrolled students"
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Post Announcement
          </Button>
        }
      />

      <div className="space-y-4">
        {announcements?.map((ann) => (
          <AnnouncementCard key={ann.id} announcement={ann} />
        ))}
      </div>

      {/* Post Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Publish Course Announcement"
        description="Share official notices with all students in this course division."
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
              Broadcast Notice
            </Button>
          </>
        }
      >
        <form
          onSubmit={handleSubmit((data) => createMutation.mutate(data))}
          className="space-y-4"
        >
          <Input
            label="Announcement Title"
            placeholder="e.g. Capstone Evaluation Schedule — Division A"
            required
            error={errors.title?.message}
            {...register('title')}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Notice Body</label>
            <textarea
              rows={4}
              placeholder="Detailed guidelines, presentation room numbers, requirements..."
              className={`w-full rounded-lg border text-sm p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.content ? 'border-red-300 bg-red-50/20' : 'border-slate-300'
              }`}
              {...register('content')}
            />
            {errors.content && (
              <p className="text-xs text-red-600 font-medium">{errors.content.message}</p>
            )}
          </div>

          <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center gap-2 text-xs text-indigo-700 font-medium">
            <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Students will also be automatically notified by institutional email.</span>
          </div>
        </form>
      </Modal>
    </div>
  );
};
