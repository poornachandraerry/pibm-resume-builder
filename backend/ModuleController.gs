/**
 * ============================================================
 * ModuleController.gs
 * PIBM Resume Builder v1.0
 * ------------------------------------------------------------
 * Thin wrappers called by module HTML files via google.script.run
 * They auto-resolve the current studentId so modules don't need
 * to pass it explicitly.
 *
 * Naming convention used by module HTML files:
 *   get<Entity>List()   → load data
 *   save<Entity>List()  → save data
 * ============================================================
 */

function _sid() {
  return getCurrentUser().studentId || "STU000001";
}

// ── Personal ─────────────────────────────────────────────────

function loadStudentProfile() {
  try {
    const data = getStudentProfile(_sid());
    return data || {};
  } catch(e) { return {}; }
}

function saveValidatedStudent(obj) {
  try {
    obj.Student_ID = _sid();
    return saveStudent(obj);
  } catch(e) { return failure(e.toString()); }
}

// ── Education ─────────────────────────────────────────────────

function getEducationList() {
  try {
    const rows = getEducations(_sid());
    return Array.isArray(rows) ? rows : [];
  } catch(e) { return []; }
}

function saveEducationList(list) {
  try {
    return saveEducation(_sid(), list);
  } catch(e) { return failure(e.toString()); }
}

// ── Experience ────────────────────────────────────────────────

function getExperienceList() {
  try {
    const rows = getExperiences(_sid());
    return Array.isArray(rows) ? rows : [];
  } catch(e) { return []; }
}

function saveExperienceList(list) {
  try {
    return saveExperience(_sid(), list);
  } catch(e) { return failure(e.toString()); }
}

// ── Internships ───────────────────────────────────────────────

function getInternshipList() {
  try {
    const rows = getInternships(_sid());
    return Array.isArray(rows) ? rows : [];
  } catch(e) { return []; }
}

function saveInternshipList(list) {
  try {
    return saveInternships(_sid(), list);
  } catch(e) { return failure(e.toString()); }
}

// ── Projects ──────────────────────────────────────────────────

function getProjectList() {
  try {
    const rows = getProjects(_sid());
    return Array.isArray(rows) ? rows : [];
  } catch(e) { return []; }
}

function saveProjectList(list) {
  try {
    return saveProjects(_sid(), list);
  } catch(e) { return failure(e.toString()); }
}

// ── Achievements ──────────────────────────────────────────────

function getAchievementList() {
  try {
    const rows = getAchievements(_sid());
    return Array.isArray(rows) ? rows : [];
  } catch(e) { return []; }
}

function saveAchievementList(list) {
  try {
    return saveAchievements(_sid(), list);
  } catch(e) { return failure(e.toString()); }
}

// ── Certifications ────────────────────────────────────────────

function getCertificationList() {
  try {
    const rows = getCertifications(_sid());
    return Array.isArray(rows) ? rows : [];
  } catch(e) { return []; }
}

function saveCertificationList(list) {
  try {
    return saveCertifications(_sid(), list);
  } catch(e) { return failure(e.toString()); }
}

// ── Skills ────────────────────────────────────────────────────

function getSkillList() {
  try {
    const rows = getSkills(_sid());
    return Array.isArray(rows) ? rows : [];
  } catch(e) { return []; }
}

function saveSkillList(list) {
  try {
    return saveSkills(_sid(), list);
  } catch(e) { return failure(e.toString()); }
}
