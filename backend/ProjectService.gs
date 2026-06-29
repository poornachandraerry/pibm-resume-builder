/**
 * ==========================================================
 * PIBM Resume Builder v1.0
 * ProjectService.gs
 * ----------------------------------------------------------
 * Production Ready Project Service
 * Compatible with existing architecture
 * ==========================================================
 */

/**
 * Get Project Records
 */
function getProjects(studentId) {

  if (!studentId) {
    throw new Error("Student ID is required.");
  }

  const sheet = getSheet(CONFIG.SHEETS.PROJECTS);
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) return [];

  const headers = data.shift();

  return data
    .filter(function (row) {
      return String(row[0]).trim() === String(studentId).trim();
    })
    .map(function (row) {
      return rowToObject(headers, row);
    });

}

/**
 * Save Project Records
 */
function saveProjects(studentId, projectList) {

  if (!studentId) {
    throw new Error("Student ID is required.");
  }

  if (!Array.isArray(projectList) || projectList.length === 0) {
    return {
      success: true,
      message: "No project records."
    };
  }

  deleteProjects(studentId);

  const sheet = getSheet(CONFIG.SHEETS.PROJECTS);
  const headers = getHeaders(sheet);

  const rows = projectList.map(function (project) {

    project.Student_ID = studentId;
    sanitizeProject_(project);
    validateProject(project);

    project.Project_ID = project.Project_ID || Utilities.getUuid();
    project.Created_On = project.Created_On || now();
    project.Updated_On = now();

    return headers.map(function (header) {
      return project[header] !== undefined ? project[header] : "";
    });

  });

  sheet.getRange(
    sheet.getLastRow() + 1,
    1,
    rows.length,
    rows[0].length
  ).setValues(rows);

  return {
    success: true,
    message: "Projects saved successfully."
  };

}

/**
 * Delete All Projects
 */
function deleteProjects(studentId) {

  const sheet = getSheet(CONFIG.SHEETS.PROJECTS);
  const data = sheet.getDataRange().getValues();

  for (let i = data.length - 1; i >= 1; i--) {
    if (String(data[i][0]) === String(studentId)) {
      sheet.deleteRow(i + 1);
    }
  }

}

/**
 * Add Project
 */
function addProject(project) {

  sanitizeProject_(project);
  validateProject(project);

  const sheet = getSheet(CONFIG.SHEETS.PROJECTS);
  const headers = getHeaders(sheet);

  project.Project_ID = project.Project_ID || Utilities.getUuid();
  project.Created_On = now();
  project.Updated_On = now();

  const row = headers.map(function (header) {
    return project[header] !== undefined ? project[header] : "";
  });

  sheet.appendRow(row);

  return {
    success: true,
    message: "Project added successfully."
  };

}

/**
 * Update Project
 */
function updateProject(project) {

  sanitizeProject_(project);
  validateProject(project);

  const sheet = getSheet(CONFIG.SHEETS.PROJECTS);
  const data = sheet.getDataRange().getValues();

  const headers = data[0];
  const idIndex = headers.indexOf("Project_ID");

  if (idIndex === -1) {
    throw new Error("Project_ID column not found.");
  }

  for (let i = 1; i < data.length; i++) {

    if (String(data[i][idIndex]) === String(project.Project_ID)) {

      project.Updated_On = now();

      const row = headers.map(function (header) {
        return project[header] !== undefined
          ? project[header]
          : data[i][headers.indexOf(header)];
      });

      sheet.getRange(i + 1, 1, 1, row.length).setValues([row]);

      return {
        success: true,
        message: "Project updated successfully."
      };
    }
  }

  throw new Error("Project not found.");

}

/**
 * Delete Project
 */
function deleteProject(projectId) {

  const sheet = getSheet(CONFIG.SHEETS.PROJECTS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf("Project_ID");

  for (let i = data.length - 1; i >= 1; i--) {

    if (String(data[i][idIndex]) === String(projectId)) {

      sheet.deleteRow(i + 1);

      return {
        success: true,
        message: "Project deleted successfully."
      };
    }
  }

  throw new Error("Project not found.");

}

/**
 * Validate Project
 */
function validateProject(project) {

  if (!project.Student_ID)
    throw new Error("Student ID is required.");

  if (!project.Project_Title)
    throw new Error("Project Title is required.");

  if (!project.Description)
    throw new Error("Project Description is required.");

  if (project.Start_Date && project.End_Date) {

    const start = new Date(project.Start_Date);
    const end = new Date(project.End_Date);

    if (end < start) {
      throw new Error("End Date cannot be earlier than Start Date.");
    }
  }

}

/**
 * Project Types
 */
function getProjectTypes() {
  return [
    "Academic Project",
    "Capstone Project",
    "Industry Project",
    "Live Project",
    "Research Project",
    "Consulting Project",
    "Summer Internship Project",
    "Winter Internship Project",
    "MBA Project",
    "Dissertation",
    "Case Study",
    "Freelance Project",
    "Startup Project",
    "Personal Project",
    "Open Source Contribution",
    "Other"
  ];
}

/**
 * Project Status
 */
function getProjectStatus() {
  return [
    "Completed",
    "Ongoing",
    "Planned"
  ];
}

/**
 * Resume Project Data
 */
function getResumeProjects(studentId) {

  return getProjects(studentId).sort(function (a, b) {

    const d1 = new Date(a.End_Date || a.Start_Date || "1900-01-01");
    const d2 = new Date(b.End_Date || b.Start_Date || "1900-01-01");

    return d2 - d1;

  });

}

/**
 * Internal Helper
 */
function sanitizeProject_(project) {

  [
    "Project_Title",
    "Description",
    "Role",
    "Organization",
    "Technologies",
    "Project_Type",
    "Project_Status"
  ].forEach(function (field) {

    if (typeof project[field] === "string") {
      project[field] = project[field].trim();
    }

  });

}
