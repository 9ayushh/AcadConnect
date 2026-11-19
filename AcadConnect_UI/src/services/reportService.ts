import api from './api';
import { ENDPOINTS } from './endpoints';
import { FilterParams } from '../types';

export const reportService = {
  async downloadBlob(url: string, defaultFilename: string, params?: Record<string, unknown>): Promise<void> {
    const res = await api.get(url, {
      params,
      responseType: 'blob',
    });

    // Extract filename from header if present
    let filename = defaultFilename;
    const disposition = res.headers['content-disposition'];
    if (disposition && disposition.indexOf('filename=') !== -1) {
      const match = disposition.match(/filename="?([^";]+)"?/);
      if (match && match[1]) {
        filename = match[1];
      }
    }

    // Trigger download in browser
    const blob = new Blob([res.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },

  async exportGroupExcel(groupId: string): Promise<void> {
    await this.downloadBlob(ENDPOINTS.EXPORT_GROUP_EXCEL(groupId), `AcadConnect_Group_${groupId}_Export.xlsx`);
  },

  async exportSubgroupExcel(subgroupId: string): Promise<void> {
    await this.downloadBlob(ENDPOINTS.EXPORT_SUBGROUP_EXCEL(subgroupId), `AcadConnect_Subgroup_${subgroupId}_Export.xlsx`);
  },

  async exportAssignmentExcel(assignmentId: string): Promise<void> {
    await this.downloadBlob(ENDPOINTS.EXPORT_ASSIGNMENT_EXCEL(assignmentId), `AcadConnect_Assignment_${assignmentId}_Export.xlsx`);
  },

  async exportFilteredReports(filters: FilterParams): Promise<void> {
    await this.downloadBlob(ENDPOINTS.EXPORT_REPORTS, 'AcadConnect_Filtered_Report.xlsx', filters as Record<string, unknown>);
  },
};
