import React from 'react';
import { reportService } from '../../services/reportService';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { FileSpreadsheet, Download, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminReportsPage: React.FC = () => {
  const handleExportSystem = async () => {
    try {
      await reportService.exportFilteredReports({});
      toast.success('System audit workbook exported successfully!');
    } catch {
      toast.error('Failed to export system report');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institution Reports & Audits"
        description="Comprehensive Excel spreadsheets for academic councils, accreditation boards, and Dean offices"
      />

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Institution-Wide Master Ledger</h3>
            <p className="text-xs text-slate-500">
              Aggregated rows for all enrolled students, project deliverables, GitHub links, and marks
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Accreditation ready (.xlsx)
          </span>
          <Button
            variant="primary"
            size="md"
            onClick={handleExportSystem}
            icon={<Download className="w-4 h-4" />}
          >
            Download System Master Workbook
          </Button>
        </div>
      </div>
    </div>
  );
};
