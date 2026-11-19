import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Settings, Shield, Bell, Database } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminSettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="System Configuration & Preferences"
        description="Global platform parameters, academic calendar cycles, and security policies"
      />

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            <span>Academic Constraints & Policies</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Enforced across all student subgroup creation and project workflows
          </p>
        </div>

        <div className="space-y-4 text-sm text-slate-700">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <p className="font-semibold text-slate-900">Maximum Subgroup Size</p>
              <p className="text-xs text-slate-500">Strictly locked at 3 students per subgroup</p>
            </div>
            <span className="font-bold text-indigo-600 bg-white px-3 py-1 rounded-lg border border-slate-200">
              3 Students
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <p className="font-semibold text-slate-900">Public Registration Role</p>
              <p className="text-xs text-slate-500">
                Self-service registration restricted to STUDENT accounts only
              </p>
            </div>
            <span className="font-bold text-emerald-600 bg-white px-3 py-1 rounded-lg border border-slate-200">
              STUDENT Only
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <p className="font-semibold text-slate-900">Institutional Email Alerts</p>
              <p className="text-xs text-slate-500">
                Dispatch notifications on announcements and grading updates
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success('Settings updated successfully')}
            >
              Enabled
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
