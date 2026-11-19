import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resourceService } from '../../services/resourceService';
import { groupService } from '../../services/groupService';
import { PageHeader } from '../../components/common/PageHeader';
import { ResourceCard } from '../../components/communication/ResourceCard';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Loader } from '../../components/common/Loader';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createResourceSchema, CreateResourceFormData } from '../../utils/validators';
import toast from 'react-hot-toast';

export const TeacherResourcesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: groups } = useQuery({
    queryKey: ['teacherGroups'],
    queryFn: () => groupService.getAllGroups(),
  });

  const groupId = groups?.[0]?.id || 'group-1';

  const { data: resources, isLoading } = useQuery({
    queryKey: ['resources', groupId],
    queryFn: () => resourceService.getResources(groupId),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateResourceFormData) => resourceService.createResource(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources', groupId] });
      toast.success('Resource posted to course group!');
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => resourceService.deleteResource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources', groupId] });
      toast.success('Resource deleted');
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateResourceFormData>({
    resolver: zodResolver(createResourceSchema),
    defaultValues: {
      type: 'GUIDELINES',
    },
  });

  if (isLoading) {
    return <Loader size="lg" label="Loading course resources..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Guidelines & Reference Materials"
        description="Share official LaTeX templates, grading rubrics, starter repos, and reference manuals"
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Resource
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources?.map((res) => (
          <ResourceCard
            key={res.id}
            resource={res}
            canDelete={true}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Course Resource"
        description="Distribute material to all project groups."
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
              Add Resource
            </Button>
          </>
        }
      >
        <form
          onSubmit={handleSubmit((data) => createMutation.mutate(data))}
          className="space-y-4"
        >
          <Input
            label="Title"
            placeholder="e.g. Official Capstone Project Guidelines & Rubric"
            required
            error={errors.title?.message}
            {...register('title')}
          />

          <Select
            label="Resource Type"
            options={[
              { value: 'GUIDELINES', label: 'Course Guidelines / Rubrics' },
              { value: 'DOCUMENTATION', label: 'Documentation / Thesis Template' },
              { value: 'GITHUB', label: 'Starter GitHub Repository' },
              { value: 'DRIVE', label: 'Google Drive Asset Folder' },
              { value: 'PDF', label: 'PDF Document' },
              { value: 'WEBSITE', label: 'External Website' },
            ]}
            error={errors.type?.message}
            {...register('type')}
          />

          <Input
            label="Resource URL"
            type="url"
            placeholder="https://..."
            required
            error={errors.url?.message}
            {...register('url')}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea
              rows={2}
              placeholder="Instructions or scope of this resource..."
              className="w-full rounded-lg border border-slate-300 text-sm p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register('description')}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
