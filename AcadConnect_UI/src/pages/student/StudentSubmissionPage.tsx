import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submissionService, CreateSubmissionPayload } from '../../services/submissionService';
import { groupService } from '../../services/groupService';
import { projectService } from '../../services/projectService';
import { PageHeader } from '../../components/common/PageHeader';
import { SubmissionHeader } from '../../components/submission/SubmissionHeader';
import { GithubInput } from '../../components/submission/GithubInput';
import { FileUpload } from '../../components/common/FileUpload';
import { SubmissionChecklist } from '../../components/submission/SubmissionChecklist';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Loader } from '../../components/common/Loader';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submissionSchema, SubmissionFormData } from '../../utils/validators';
import { ALLOWED_PROJECT_EXTENSIONS, ALLOWED_SYNOPSIS_EXTENSIONS } from '../../utils/constants';
import toast from 'react-hot-toast';
import { Link2, Save, Send, AlertTriangle } from 'lucide-react';

export const StudentSubmissionPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [projectFile, setProjectFile] = useState<File | null>(null);
  const [synopsisFile, setSynopsisFile] = useState<File | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<SubmissionFormData | null>(null);

  // Queries
  const { data: submissions, isLoading: subLoading } = useQuery({
    queryKey: ['submissions'],
    queryFn: () => submissionService.getSubmissions(),
  });

  const { data: myGroupData } = useQuery({
    queryKey: ['myGroup'],
    queryFn: () => groupService.getMyGroup(),
  });

  const { data: projects } = useQuery({
    queryKey: ['studentProjects'],
    queryFn: () => projectService.getProjects(),
  });

  const currentSubmission = submissions && submissions.length > 0 ? submissions[0] : null;
  const project = projects && projects.length > 0 ? projects[0] : null;
  const isLocked = currentSubmission?.isLocked || false;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      title: '',
      description: '',
      githubUrl: '',
      otherLink: '',
    },
  });

  // Prepopulate if submission exists
  useEffect(() => {
    if (currentSubmission) {
      reset({
        title: currentSubmission.projectTitle || '',
        description: currentSubmission.description || '',
        githubUrl: currentSubmission.githubUrl || '',
        otherLink: currentSubmission.otherLink || '',
      });
    } else if (project) {
      reset({
        title: project.title,
        description: project.description,
        githubUrl: 'https://github.com/myteam/capstone-project',
        otherLink: '',
      });
    }
  }, [currentSubmission, project, reset]);

  const titleWatch = watch('title');
  const descWatch = watch('description');
  const githubWatch = watch('githubUrl');

  const submitMutation = useMutation({
    mutationFn: (payload: CreateSubmissionPayload) => {
      if (currentSubmission?.id) {
        return submissionService.updateSubmission(currentSubmission.id, payload);
      }
      return submissionService.createSubmission(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      queryClient.invalidateQueries({ queryKey: ['myGroup'] });
      toast.success('Project submission successfully uploaded for teacher review!');
      setIsConfirmOpen(false);
    },
    onError: (err: unknown) => {
      toast.error((err as { message?: string })?.message || 'Submission failed');
    },
  });

  const onPreSubmit = (data: SubmissionFormData) => {
    if (!projectFile && !currentSubmission?.projectFileName) {
      toast.error('Please upload your project source archive file');
      return;
    }
    if (!synopsisFile && !currentSubmission?.synopsisFileName) {
      toast.error('Please upload your project synopsis document');
      return;
    }
    setPendingFormData(data);
    setIsConfirmOpen(true);
  };

  const handleFinalSubmit = () => {
    if (!pendingFormData) return;
    const payload: CreateSubmissionPayload = {
      projectId: project?.id || 'project-1',
      title: pendingFormData.title,
      description: pendingFormData.description,
      githubUrl: pendingFormData.githubUrl,
      otherLink: pendingFormData.otherLink,
      projectFileName: projectFile?.name || currentSubmission?.projectFileName || 'project_source.zip',
      synopsisFileName: synopsisFile?.name || currentSubmission?.synopsisFileName || 'synopsis.pdf',
    };
    submitMutation.mutate(payload);
  };

  if (subLoading) {
    return <Loader size="lg" label="Loading submission portal..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Deliverable Submission"
        description="Submit source repository, executable build, and IEEE project synopsis for instructor evaluation"
      />

      {/* Submission Context Header */}
      <SubmissionHeader
        projectTitle={project?.title || currentSubmission?.projectTitle || 'Capstone Major Project'}
        groupName={myGroupData?.mainGroup?.name || 'Academic Group'}
        subgroupName={myGroupData?.subgroup?.name || 'My Subgroup'}
        assignmentTitle="Sprint 3: Core Prototype & Architecture Review"
        deadline="2026-11-15T23:59:59.000Z"
        status={currentSubmission?.status || 'PENDING'}
        isLocked={isLocked}
      />

      {isLocked && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-xs text-amber-800 font-medium">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            This submission has been locked for grading by your instructor. Further modifications
            are disabled until evaluations conclude.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Submission Form (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <form onSubmit={handleSubmit(onPreSubmit)} className="space-y-5">
            <Input
              label="Project Title"
              placeholder="e.g. Distributed Health Record AI Orchestrator"
              required
              disabled={isLocked}
              error={errors.title?.message}
              {...register('title')}
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Project Summary & Technical Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Key architecture modules, frameworks used, setup requirements, and completed milestone objectives..."
                disabled={isLocked}
                className={`w-full rounded-lg border text-sm p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.description ? 'border-red-300 bg-red-50/20' : 'border-slate-300'
                } disabled:bg-slate-50 disabled:text-slate-500`}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-xs text-red-600 font-medium">{errors.description.message}</p>
              )}
            </div>

            {/* GitHub Repo URL Input */}
            <GithubInput
              disabled={isLocked}
              error={errors.githubUrl?.message}
              {...register('githubUrl')}
            />

            {/* Project File Upload */}
            <div className="pt-2">
              <FileUpload
                label="Project Source / Executable Archive"
                helperText={`Accepted formats: ${ALLOWED_PROJECT_EXTENSIONS.join(', ')} (Max 25 MB)`}
                required
                onFileSelect={(f) => setProjectFile(f)}
                selectedFileName={currentSubmission?.projectFileName}
              />
            </div>

            {/* Synopsis Upload */}
            <div className="pt-2">
              <FileUpload
                label="Project Synopsis / Thesis Document"
                helperText={`Accepted formats: ${ALLOWED_SYNOPSIS_EXTENSIONS.join(', ')} (Max 25 MB)`}
                required
                onFileSelect={(f) => setSynopsisFile(f)}
                selectedFileName={currentSubmission?.synopsisFileName}
              />
            </div>

            {/* Other Link */}
            <Input
              label="Live Demo or Staging URL (Optional)"
              placeholder="https://myteam-demo.app"
              leftIcon={<Link2 className="w-4 h-4" />}
              disabled={isLocked}
              error={errors.otherLink?.message}
              {...register('otherLink')}
            />

            {/* Form Actions */}
            {!isLocked && (
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => toast.success('Draft saved successfully!')}
                  icon={<Save className="w-4 h-4" />}
                >
                  Save Draft
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={submitMutation.isPending}
                  icon={<Send className="w-4 h-4" />}
                >
                  {currentSubmission ? 'Update Submission' : 'Submit Project'}
                </Button>
              </div>
            )}
          </form>
        </div>

        {/* Requirements Checklist & Guidelines (1 Col) */}
        <div className="space-y-6">
          <SubmissionChecklist
            hasTitle={!!titleWatch && titleWatch.length >= 3}
            hasDescription={!!descWatch && descWatch.length >= 10}
            hasGithub={!!githubWatch && /^https:\/\/github\.com\/[\w-]+\/[\w.-]+/.test(githubWatch)}
            hasProjectFile={!!projectFile || !!currentSubmission?.projectFileName}
            hasSynopsis={!!synopsisFile || !!currentSubmission?.synopsisFileName}
          />

          {/* Teacher remarks note if returned */}
          {currentSubmission?.teacherRemarks && (
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-5 shadow-xs">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                Instructor Remarks
              </h4>
              <p className="text-xs text-amber-800 italic leading-relaxed">
                "{currentSubmission.teacherRemarks}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Submission Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleFinalSubmit}
        title="Submit Project for Review?"
        message="Your deliverables (GitHub repo, project file, and synopsis) will be forwarded to your faculty guide for evaluation. You can edit this submission until the assignment deadline is locked."
        confirmLabel="Confirm & Submit"
        variant="primary"
        loading={submitMutation.isPending}
      />
    </div>
  );
};
