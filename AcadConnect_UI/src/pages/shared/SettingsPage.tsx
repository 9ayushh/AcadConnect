import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Bell, Eye, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Settings & Preferences"
        description="Configure notifications, UI accessibility, and credential management"
      />

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Notification Preferences</h3>
          <p className="text-xs text-slate-500">
            Choose what alerts and digest emails you receive from your capstone groups
          </p>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-xs font-semibold text-slate-900">Email on New Announcements</p>
                <p className="text-[11px] text-slate-500">Receive immediate copy of class broadcasts</p>
              </div>
            </div>
            <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500" />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-xs font-semibold text-slate-900">Evaluation Feedback Alerts</p>
                <p className="text-[11px] text-slate-500">Instant notification when instructor grades a milestone</p>
              </div>
            </div>
            <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500" />
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button variant="primary" size="sm" onClick={() => toast.success('Preferences saved!')}>
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};
