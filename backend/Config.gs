/**
 * ============================================================
 * PIBM Resume Builder v1.0
 * Config.gs
 * ------------------------------------------------------------
 * Global Configuration
 * ============================================================
 */

const CONFIG = {

  // ==========================================================
  // Spreadsheet
  // ==========================================================

  SPREADSHEET: SpreadsheetApp.getActiveSpreadsheet(),

  // ==========================================================
  // Sheet Names
  // ==========================================================

  SHEETS: {

    STUDENT_MASTER: "Student_Master",

    EDUCATION: "Education",

    EXPERIENCE: "Experience",

    INTERNSHIPS: "Internships",

    PROJECTS: "Projects",

    SKILLS: "Skills",

    CERTIFICATIONS: "Certifications",

    ACHIEVEMENTS: "Achievements",

    RESUME_MASTER: "Resume_Master",

    TEMPLATE_MASTER: "Template_Master",

    RESUME_LOG: "Resume_Log",

    USERS: "Users",

    SETTINGS: "Settings",

    EMAIL_LOGS: "Email_Logs"

  },

  // ==========================================================
  // Resume Types
  // ==========================================================

  RESUME_TYPES: {

    FR1: "FR1",

    FR2: "FR2",

    ER1: "ER1",

    ER2: "ER2",

    ER3: "ER3",

    ER4: "ER4"

  },

  // ==========================================================
  // Profile Status
  // ==========================================================

  PROFILE_STATUS: {

    DRAFT: "Draft",

    SUBMITTED: "Submitted",

    UNDER_REVIEW: "Under Review",

    APPROVED: "Approved",

    REJECTED: "Rejected",

    COMPLETED: "Completed"

  },

  // ==========================================================
  // Resume Status
  // ==========================================================

  RESUME_STATUS: {

    GENERATED: "Generated",

    APPROVED: "Approved",

    PUBLISHED: "Published"

  },

  // ==========================================================
  // Date Formats
  // ==========================================================

  DATE_FORMAT: "dd-MMM-yyyy",

  DATETIME_FORMAT: "dd-MMM-yyyy HH:mm:ss",

  // ==========================================================
// Resume Engine Settings
// ==========================================================

// Default Resume Template
DEFAULT_TEMPLATE: "FR1",

// Maximum Records to Display in Resume
MAX_EDUCATION: 5,

MAX_PROJECTS: 6,

MAX_EXPERIENCE: 8,

MAX_INTERNSHIPS: 3,

MAX_CERTIFICATIONS: 10,

MAX_ACHIEVEMENTS: 10,

MAX_SKILLS_PER_CATEGORY: 15,

// ATS Configuration
MIN_PROFILE_COMPLETION: 80,

MIN_RESUME_READINESS: 75,

MAX_KEYWORDS: 50


// ==========================================================
// User Roles
// ==========================================================

USER_ROLES: {

  ADMIN: "Admin",

  STUDENT: "Student",

  REVIEWER: "Reviewer"

},

// ==========================================================
// Resume Sections
// ==========================================================

RESUME_SECTIONS: {

  PERSONAL: "Personal",

  EDUCATION: "Education",

  EXPERIENCE: "Experience",

  INTERNSHIPS: "Internships",

  PROJECTS: "Projects",

  SKILLS: "Skills",

  CERTIFICATIONS: "Certifications",

  ACHIEVEMENTS: "Achievements"

},

/**
 * ============================================================
 * Returns Sheet
 * ============================================================
 */

function getSheet(sheetName) {

  const sheet = CONFIG.SPREADSHEET.getSheetByName(sheetName);

  if (!sheet) {

    throw new Error("Sheet not found : " + sheetName);

  }

  return sheet;

}



/**
 * ============================================================
 * Current Timestamp
 * ============================================================
 */

function getCurrentTimestamp() {

  return Utilities.formatDate(

    new Date(),

    Session.getScriptTimeZone(),

    CONFIG.DATETIME_FORMAT

  );

}



/**
 * ============================================================
 * Alias
 * ============================================================
 */

function now() {

  return getCurrentTimestamp();

}



/**
 * ============================================================
 * Generate Student ID
 * STU000001
 * ============================================================
 */

function generateStudentID() {

  const value = new Date().getTime() % 1000000;

  return "STU" + Utilities.formatString("%06d", value);

}



/**
 * ============================================================
 * Generate UUID
 * ============================================================
 */

function generateId() {

  return Utilities.getUuid();

}



/**
 * ============================================================
 * Get Headers
 * ============================================================
 */

function getHeaders(sheet) {

  return sheet

    .getRange(1, 1, 1, sheet.getLastColumn())

    .getValues()[0];

}



/**
 * ============================================================
 * Convert Row to Object
 * ============================================================
 */

function rowToObject(headers, row) {

  const obj = {};

  headers.forEach(function(header, index) {

    obj[header] = row[index];

  });

  return obj;

}



/**
 * ============================================================
 * Find Row
 * ============================================================
 */

function findRow(sheet, columnName, value) {

  const headers = getHeaders(sheet);

  const columnIndex = headers.indexOf(columnName);

  if (columnIndex === -1) {

    return -1;

  }

  const values = sheet

    .getRange(

      2,

      columnIndex + 1,

      Math.max(sheet.getLastRow() - 1, 0),

      1

    )

    .getValues();

  for (let i = 0; i < values.length; i++) {

    if (String(values[i][0]).trim() === String(value).trim()) {

      return i + 2;

    }

  }

  return -1;

}



/**
 * ============================================================
 * Check Empty
 * ============================================================
 */

function isEmpty(value) {

  return (

    value === null ||

    value === undefined ||

    value === ""

  );

}



/**
 * ============================================================
 * Success Response
 * ============================================================
 */

function success(message, data) {

  return {

    success: true,

    message: message || "",

    data: data || null

  };

}



/**
 * ============================================================
 * Error Response
 * ============================================================
 */

function failure(message) {

  return {

    success: false,

    message: message

  };

/**
 * ============================================================
 * Format Date
 * ============================================================
 */
function formatDate(date) {

  if (!date) return "";

  return Utilities.formatDate(
    new Date(date),
    Session.getScriptTimeZone(),
    CONFIG.DATE_FORMAT
  );

}


/**
 * ============================================================
 * Format Date Time
 * ============================================================
 */
function formatDateTime(date) {

  if (!date) return "";

  return Utilities.formatDate(
    new Date(date),
    Session.getScriptTimeZone(),
    CONFIG.DATETIME_FORMAT
  );

}


/**
 * ============================================================
 * Calculate Month Difference
 * ============================================================
 */
function monthsBetween(startDate, endDate) {

  if (!startDate) return 0;

  const start = new Date(startDate);

  const end = endDate
    ? new Date(endDate)
    : new Date();

  let months =
    (end.getFullYear() - start.getFullYear()) * 12;

  months += end.getMonth() - start.getMonth();

  return Math.max(months, 0);

}


/**
 * ============================================================
 * Convert Months to Years & Months
 * ============================================================
 */
function formatExperience(months) {

  const years = Math.floor(months / 12);

  const remainingMonths = months % 12;

  let text = "";

  if (years > 0) {

    text += years + (years === 1 ? " Year " : " Years ");

  }

  if (remainingMonths > 0) {

    text += remainingMonths + (remainingMonths === 1 ? " Month" : " Months");

  }

  return text.trim() || "Fresher";

}

}