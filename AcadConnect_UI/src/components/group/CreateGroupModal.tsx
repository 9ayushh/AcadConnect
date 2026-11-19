import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createMainGroupSchema, CreateMainGroupFormData } from '../../utils/validators';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMainGroupFormData) => Promise<void>;
  loading?: boolean;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMainGroupFormData>({
    resolver: zodResolver(createMainGroupSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const handleFormSubmit = async (data: CreateMainGroupFormData) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Main Academic Group"
      description="Create a course or capstone division to organize student subgroups and project submissions."
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit(handleFormSubmit)}
            loading={loading}
          >
            Create Group
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Group Name"
          placeholder="e.g. CS491 - Capstone Major Projects 2026"
          required
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="Course section details, project deliverables, and scope..."
            className={`w-full rounded-lg border text-sm p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.description ? 'border-red-300 bg-red-50/20' : 'border-slate-300'
            }`}
            {...register('description')}
          />
          {errors.description && (
            <p className="text-xs text-red-600 font-medium">{errors.description.message}</p>
          )}
        </div>
      </form>
    </Modal>
  );
};
