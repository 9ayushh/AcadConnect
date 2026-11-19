import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { groupService } from '../../services/groupService';
import { reportService } from '../../services/reportService';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/common/Select';
import { FileSpreadsheet, Download, Info, CheckCircle2 } from 'lucide-react';
import { SubmissionStatusType } from '../../types';
import toast from 'react-hot-toast';

export const TeacherReportsPage: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('group-1');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const { data: groups } = useQuery({
    queryKey: ['teacherGroups'],
    queryFn: () => groupService.getAllGroups(),
  });

  const handleExport = async (type: 'GROUP' | 'SUBGROUP' | 'FILTERED') => {
    setIsExporting(true);
    try {
      if (type === 'GROUP') {
        await reportService.exportGroupExcel(selectedGroup);
      } else if (type === 'SUBGROUP') {
        await reportService.exportSubgroupExcel('subgroup-1');
      } else {
        await reportService.exportFilteredReports({
          groupId: selectedGroup,
          status: selectedStatus ? (selectedStatus as SubmissionStatusType) : undefined,
        });
      }
      toast.success('Excel workbook exported successfully!');
    } catch {
      toast.error('Failed to export Excel report');
    } finally {
      setIsExporting(false);
    }
  };

  const workbookColumns = [
    'S.No.',
    'Group Name',
    'Student Name',
    'Email ID',
    'Roll Number',
    'Project Name/Title',
    'GitHub Repository/Link',
    'Project File Reference',
    'Synopsis Document Reference',
    'Other Link',
    'Submission Status',
    'Submission Date',
    'Teacher Remarks',
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Excel Reports & Gradebook Export"
        description="Generate formatted spreadsheet deliverables for accreditation, department archives, and grading records"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Scopes & Filter Controls (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <span>Export Scopes (§6.8)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Select Academic Main Group"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                options={
                  groups?.map((g) => ({
                    value: g.id,
                    label: g.name,
                  })) || [{ value: 'group-1', label: 'CS491 - Capstone Major Projects' }]
                }
              />

              <Select
                label="Filter by Submission Status (Optional)"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                placeholder="All Statuses"
                options={[
                  { value: 'APPROVED', label: 'Approved Only' },
                  { value: 'SUBMITTED', label: 'Submitted / Under Review' },
                  { value: 'REVISION_REQUIRED', label: 'Revision Required' },
                  { value: 'LATE', label: 'Late Submissions' },
                ]}
              />
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => handleExport('GROUP')}
                loading={isExporting}
                icon={<Download className="w-4 h-4" />}
              >
                Entire Main Group
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={() => handleExport('SUBGROUP')}
                loading={isExporting}
                icon={<Download className="w-4 h-4" />}
              >
                Individual Subgroup
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={() => handleExport('FILTERED')}
                loading={isExporting}
                icon={<Download className="w-4 h-4" />}
              >
                Export Filtered View
              </Button>
            </div>
          </div>

          {/* Export Schema / Column Spec (§6.8) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-indigo-600" />
              <h4 className="text-sm font-bold text-slate-900">
                Workbook Column Specification (§6.8)
              </h4>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              The generated <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700">.xlsx</code> spreadsheet embeds stable download links, repeat project headers for multi-student teams, and clean formatting:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {workbookColumns.map((col, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs font-medium text-slate-700 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{col}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Info Card */}
        <div className="bg-indigo-50/60 rounded-2xl border border-indigo-100 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
            <span>Accreditation Ready</span>
          </div>
          <p className="text-xs text-indigo-800 leading-relaxed">
            All spreadsheet outputs are generated server-side with authentic response headers and can
            be opened in Microsoft Excel, LibreOffice Calc, or Google Sheets.
          </p>
          <ul className="text-xs text-indigo-700 space-y-1.5 list-disc pl-4 leading-relaxed">
            <li>Includes student roll numbers, emails, and group affiliations</li>
            <li>Links to GitHub repository and uploaded project synopsis</li>
            <li>Records faculty grading status, submission dates, and feedback</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
