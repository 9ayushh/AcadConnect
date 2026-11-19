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
import { EmptyState } from '../../components/common/EmptyState';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createResourceSchema, CreateResourceFormData } from '../../utils/validators';
import toast from 'react-hot-toast';

export const StudentResourcesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('ALL');

  const { data: myGroup } = useQuery({
    queryKey: ['myGroup'],
    queryFn: () => groupService.getMyGroup(),
  });

  const groupId = myGroup?.mainGroup?.id || 'group-1';

  const { data: resources, isLoading } = useQuery({
    queryKey: ['resources', groupId],
    queryFn: () => resourceService.getResources(groupId),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateResourceFormData) => resourceService.createResource(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources', groupId] });
      toast.success('Resource shared successfully!');
      setIsModalOpen(false);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateResourceFormData>({
    resolver: zodResolver(createResourceSchema),
    defaultValues: {
      type: 'DOCUMENTATION',
    },
  });

  if (isLoading) {
    return <Loader size="lg" label="Loading shared resources..." />;
  }

  const filtered =
    filterType === 'ALL'
      ? resources || []
      : (resources || []).filter((r) => r.type === filterType);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Resources & Templates"
        description="Documentation templates, code repositories, IEEE rubrics, and helpful external links"
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Share Resource
          </Button>
        }
      />

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {['ALL', 'GITHUB', 'DOCUMENTATION', 'GUIDELINES', 'PDF', 'WEBSITE'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterType === t
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t === 'ALL' ? 'All Resources' : t}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((res) => (
            <ResourceCard key={res.id} resource={res} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Resources Found"
          description="No resources match the selected filter."
        />
      )}

      {/* Add Resource Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Share Project Resource"
        description="Share a useful template, document, or repository link with your group."
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
              Share Link
            </Button>
          </>
        }
      >
        <form
          onSubmit={handleSubmit((data) => createMutation.mutate(data))}
          className="space-y-4"
        >
          <Input
            label="Resource Title"
            placeholder="e.g. IEEE Conference Paper Template"
            required
            error={errors.title?.message}
            {...register('title')}
          />

          <Select
            label="Resource Type"
            options={[
              { value: 'DOCUMENTATION', label: 'Documentation / Wiki' },
              { value: 'GITHUB', label: 'GitHub Repository' },
              { value: 'DRIVE', label: 'Google Drive Folder' },
              { value: 'GUIDELINES', label: 'Project Guidelines' },
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
              placeholder="Why this resource is helpful..."
              className="w-full rounded-lg border border-slate-300 text-sm p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register('description')}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
