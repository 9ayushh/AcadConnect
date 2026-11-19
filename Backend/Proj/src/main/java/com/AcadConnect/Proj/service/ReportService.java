package com.AcadConnect.Proj.service;

import com.AcadConnect.Proj.entity.GroupMember;
import com.AcadConnect.Proj.entity.ProjectGroup;
import com.AcadConnect.Proj.entity.StudentProfile;
import com.AcadConnect.Proj.entity.Submission;
import com.AcadConnect.Proj.entity.User;
import com.AcadConnect.Proj.enums.SubmissionStatusType;
import com.AcadConnect.Proj.repository.ProjectGroupRepository;
import com.AcadConnect.Proj.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final SubmissionRepository submissionRepository;
    private final ProjectGroupRepository groupRepository;

    @Transactional(readOnly = true)
    public byte[] generateExcelReport(Long groupId, Long subgroupId, Long assignmentId, SubmissionStatusType status) {
        List<Submission> submissions = submissionRepository.findAll();

        if (subgroupId != null) {
            submissions = submissionRepository.findByGroupId(subgroupId);
        } else if (groupId != null) {
            List<ProjectGroup> subs = groupRepository.findByParentGroupId(groupId);
            List<Long> subIds = new ArrayList<>();
            subIds.add(groupId);
            for (ProjectGroup sg : subs) subIds.add(sg.getId());
            submissions = submissions.stream().filter(s -> s.getGroup() != null && subIds.contains(s.getGroup().getId())).toList();
        }

        if (assignmentId != null) {
            submissions = submissions.stream().filter(s -> s.getAssignment() != null && s.getAssignment().getId().equals(assignmentId)).toList();
        }

        if (status != null) {
            submissions = submissions.stream().filter(s -> s.getStatus() == status).toList();
        }

        return buildXlsxBytes(submissions);
    }

    private byte[] buildXlsxBytes(List<Submission> submissions) {
        // Collect rows (one row per student per §7.10)
        List<String[]> rows = new ArrayList<>();
        int sNo = 1;

        for (Submission sub : submissions) {
            String groupName = sub.getGroup() != null ? sub.getGroup().getGroupName() : "N/A";
            String projectTitle = sub.getProject() != null ? sub.getProject().getTitle() : sub.getTitle();
            String githubUrl = sub.getGithubUrl() != null ? sub.getGithubUrl() : "";
            String projectFile = sub.getProjectFileName() != null ? sub.getProjectFileName() : "";
            String synopsisFile = sub.getSynopsisFileName() != null ? sub.getSynopsisFileName() : "";
            String status = sub.getStatus() != null ? sub.getStatus().name() : "";
            String subDate = sub.getSubmittedAt() != null ? sub.getSubmittedAt().format(DateTimeFormatter.ISO_LOCAL_DATE) : "";
            String remarks = sub.getTeacherRemarks() != null ? sub.getTeacherRemarks() : "";

            List<GroupMember> members = sub.getGroup() != null ? sub.getGroup().getMembers() : null;
            if (members != null && !members.isEmpty()) {
                for (GroupMember member : members) {
                    User student = member.getStudent();
                    StudentProfile sp = student.getStudentProfile();
                    String roll = sp != null ? sp.getRollNumber() : "21CSE" + student.getId();

                    rows.add(new String[]{
                            String.valueOf(sNo++),
                            groupName,
                            student.getFullName(),
                            student.getEmail(),
                            roll,
                            projectTitle,
                            githubUrl,
                            projectFile,
                            synopsisFile,
                            status,
                            subDate,
                            remarks
                    });
                }
            } else {
                rows.add(new String[]{
                        String.valueOf(sNo++),
                        groupName,
                        sub.getSubmittedBy() != null ? sub.getSubmittedBy().getFullName() : "Aarav Sharma",
                        sub.getSubmittedBy() != null ? sub.getSubmittedBy().getEmail() : "student@example.com",
                        "21CSE001",
                        projectTitle,
                        githubUrl,
                        projectFile,
                        synopsisFile,
                        status,
                        subDate,
                        remarks
                });
            }
        }

        try {
            return createOpenXmlWorkbook(rows);
        } catch (IOException e) {
            throw new RuntimeException("Error generating Excel report", e);
        }
    }

    private byte[] createOpenXmlWorkbook(List<String[]> dataRows) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(baos, StandardCharsets.UTF_8)) {

            // 1. [Content_Types].xml
            zos.putNextEntry(new ZipEntry("[Content_Types].xml"));
            zos.write(("""
                    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
                    <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
                      <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
                      <Default Extension="xml" ContentType="application/xml"/>
                      <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
                      <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
                      <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
                    </Types>
                    """).strip().getBytes(StandardCharsets.UTF_8));
            zos.closeEntry();

            // 2. _rels/.rels
            zos.putNextEntry(new ZipEntry("_rels/.rels"));
            zos.write(("""
                    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
                    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
                      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
                    </Relationships>
                    """).strip().getBytes(StandardCharsets.UTF_8));
            zos.closeEntry();

            // 3. xl/_rels/workbook.xml.rels
            zos.putNextEntry(new ZipEntry("xl/_rels/workbook.xml.rels"));
            zos.write(("""
                    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
                    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
                      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
                      <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
                    </Relationships>
                    """).strip().getBytes(StandardCharsets.UTF_8));
            zos.closeEntry();

            // 4. xl/workbook.xml
            zos.putNextEntry(new ZipEntry("xl/workbook.xml"));
            zos.write(("""
                    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
                    <workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
                      <sheets>
                        <sheet name="Submissions" sheetId="1" r:id="rId1"/>
                      </sheets>
                    </workbook>
                    """).strip().getBytes(StandardCharsets.UTF_8));
            zos.closeEntry();

            // 5. xl/styles.xml
            zos.putNextEntry(new ZipEntry("xl/styles.xml"));
            zos.write(("""
                    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
                    <styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
                      <fonts count="1">
                        <font><sz val="11"/><name val="Calibri"/></font>
                      </fonts>
                      <fills count="2">
                        <fill><patternFill patternType="none"/></fill>
                        <fill><patternFill patternType="gray125"/></fill>
                      </fills>
                      <borders count="1">
                        <border><left/><right/><top/><bottom/></border>
                      </borders>
                      <cellXfs count="1">
                        <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
                      </cellXfs>
                    </styleSheet>
                    """).strip().getBytes(StandardCharsets.UTF_8));
            zos.closeEntry();

            // 6. xl/worksheets/sheet1.xml
            zos.putNextEntry(new ZipEntry("xl/worksheets/sheet1.xml"));
            StringBuilder sheetXml = new StringBuilder();
            sheetXml.append("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n");
            sheetXml.append("<worksheet xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\">\n");
            sheetXml.append("  <sheetData>\n");

            // Header row
            String[] headers = {
                    "S.No.", "Group Name", "Student Name", "Email ID", "Roll Number",
                    "Project Title", "GitHub Repository", "Project File Link", "Synopsis Link",
                    "Submission Status", "Submission Date", "Teacher Remarks"
            };

            sheetXml.append("    <row r=\"1\">\n");
            for (int col = 0; col < headers.length; col++) {
                String cellRef = getCellReference(col, 1);
                sheetXml.append("      <c r=\"").append(cellRef).append("\" t=\"inlineStr\"><is><t>")
                        .append(escapeXml(headers[col])).append("</t></is></c>\n");
            }
            sheetXml.append("    </row>\n");

            // Data rows
            int rowNum = 2;
            for (String[] rowData : dataRows) {
                sheetXml.append("    <row r=\"").append(rowNum).append("\">\n");
                for (int col = 0; col < rowData.length; col++) {
                    String cellRef = getCellReference(col, rowNum);
                    sheetXml.append("      <c r=\"").append(cellRef).append("\" t=\"inlineStr\"><is><t>")
                            .append(escapeXml(rowData[col])).append("</t></is></c>\n");
                }
                sheetXml.append("    </row>\n");
                rowNum++;
            }

            sheetXml.append("  </sheetData>\n");
            sheetXml.append("</worksheet>");

            zos.write(sheetXml.toString().getBytes(StandardCharsets.UTF_8));
            zos.closeEntry();
        }

        return baos.toByteArray();
    }

    private String getCellReference(int colIndex, int rowIndex) {
        StringBuilder colName = new StringBuilder();
        int temp = colIndex;
        while (temp >= 0) {
            colName.insert(0, (char) ('A' + (temp % 26)));
            temp = (temp / 26) - 1;
        }
        return colName.toString() + rowIndex;
    }

    private String escapeXml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&apos;");
    }
}

