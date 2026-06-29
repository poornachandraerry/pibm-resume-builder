/**
 * ============================================================
 * PIBM Resume Builder v1.0
 * Code.gs
 * ------------------------------------------------------------
 * Application Entry Point
 * ============================================================
 */


/**
 * ============================================================
 * Web App Entry
 * ============================================================
 */
function doGet(e) {

  const page = (e && e.parameter.page)
    ? e.parameter.page
    : "dashboard";

  const template = HtmlService.createTemplateFromFile("Index");

  template.PAGE = page;

  return template
    .evaluate()
    .setTitle("PIBM Resume Builder")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

}


/**
 * ============================================================
 * Include HTML Partials
 * ============================================================
 */
function include(filename) {

  try {

    return HtmlService
      .createHtmlOutputFromFile(filename)
      .getContent();

  } catch (e) {

    throw new Error(
      "Unable to include HTML file: " + filename
    );

  }

}


/**
 * ============================================================
 * Get Logged In User
 * (Temporary)
 * ============================================================
 *
 * Later this will come from Login Session.
 */
function getCurrentUser() {

  return {

    studentId: "STU000001",

    name: "Demo Student",

    role: "Student"

  };

}


/**
 * ============================================================
 * Dashboard Data
 * ============================================================
 */
function getDashboardData() {

  const user = getCurrentUser();

  return {

    user: user,

    student: getStudentProfile(user.studentId),

    education: getEducation(user.studentId).length,

    experience: getExperience(user.studentId).length,

    internships: getInternships(user.studentId).length,

    projects: getProjects(user.studentId).length,

    skills: getSkills(user.studentId).length,

    certifications: getCertifications(user.studentId).length,

    achievements: getAchievements(user.studentId).length

  };

}

/**
 * Load Dashboard Page
 */
function getDashboardPage(){

  return HtmlService
    .createHtmlOutputFromFile("Dashboard")
    .getContent();

}