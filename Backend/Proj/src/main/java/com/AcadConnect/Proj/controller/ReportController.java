package com.AcadConnect.Proj.controller;

import com.AcadConnect.Proj.enums.SubmissionStatusType;
import com.AcadConnect.Proj.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    private static final String EXCEL_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    @GetMapping({"/api/reports/export", "/api/v1/reports/projects/export", "/reports/export"})
    public ResponseEntity<byte[]> exportReports(
            @RequestParam(required = false) Long groupId,
            @RequestParam(required = false) Long subgroupId,
            @RequestParam(required = false) Long assignmentId,
            @RequestParam(required = false) SubmissionStatusType status
    ) {
        byte[] bytes = reportService.generateExcelReport(groupId, subgroupId, assignmentId, status);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"AcadConnect_Report.xlsx\"")
                .contentType(MediaType.parseMediaType(EXCEL_MIME))
                .body(bytes);
    }

    @GetMapping({"/api/groups/{groupId}/export/excel", "/api/v1/groups/{groupId}/export/excel", "/groups/{groupId}/export/excel"})
    public ResponseEntity<byte[]> exportGroupExcel(@PathVariable Long groupId) {
        byte[] bytes = reportService.generateExcelReport(groupId, null, null, null);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"AcadConnect_Group_" + groupId + "_Export.xlsx\"")
                .contentType(MediaType.parseMediaType(EXCEL_MIME))
                .body(bytes);
    }

    @GetMapping({"/api/subgroups/{subgroupId}/export/excel", "/api/v1/subgroups/{subgroupId}/export/excel", "/subgroups/{subgroupId}/export/excel"})
    public ResponseEntity<byte[]> exportSubgroupExcel(@PathVariable String subgroupId) {
        Long sId = Long.parseLong(subgroupId.replace("subgroup-", ""));
        byte[] bytes = reportService.generateExcelReport(null, sId, null, null);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"AcadConnect_Subgroup_" + subgroupId + "_Export.xlsx\"")
                .contentType(MediaType.parseMediaType(EXCEL_MIME))
                .body(bytes);
    }

    @GetMapping({"/api/assignments/{assignmentId}/export/excel", "/api/v1/assignments/{assignmentId}/export/excel", "/assignments/{assignmentId}/export/excel"})
    public ResponseEntity<byte[]> exportAssignmentExcel(@PathVariable Long assignmentId) {
        byte[] bytes = reportService.generateExcelReport(null, null, assignmentId, null);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"AcadConnect_Assignment_" + assignmentId + "_Export.xlsx\"")
                .contentType(MediaType.parseMediaType(EXCEL_MIME))
                .body(bytes);
    }
}

