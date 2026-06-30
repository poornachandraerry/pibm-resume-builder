/**
 * ============================================================
 * PIBM Resume Builder v1.0
 * Config.gs
 * ------------------------------------------------------------
 * Global Configuration Constants
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
  // Resume Templates
  // ==========================================================

  RESUME_TYPES: {

    FR1: "FR1",

    FR2: "FR2",

    ER1: "ER1",

    ER2: "ER2",

    ER3: "ER3",

    ER4: "ER4"

  },

  DEFAULT_TEMPLATE: "FR1",

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

  // ==========================================================
  // Resume Limits
  // ==========================================================

  MAX_EDUCATION: 5,

  MAX_PROJECTS: 6,

  MAX_EXPERIENCE: 8,

  MAX_INTERNSHIPS: 3,

  MAX_CERTIFICATIONS: 10,

  MAX_ACHIEVEMENTS: 10,

  MAX_SKILLS_PER_CATEGORY: 15,

  // ==========================================================
  // ATS Configuration
  // ==========================================================

  MIN_PROFILE_COMPLETION: 80,

  MIN_RESUME_READINESS: 75,

  MAX_KEYWORDS: 50,

  // ==========================================================
  // Date Formats
  // ==========================================================

  DATE_FORMAT: "dd-MMM-yyyy",

  DATETIME_FORMAT: "dd-MMM-yyyy HH:mm:ss"

};