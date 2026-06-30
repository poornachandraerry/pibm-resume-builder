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

  const template =
    HtmlService.createTemplateFromFile("index");

  return template
    .evaluate()
    .setTitle("PIBM Resume Builder")
    .setXFrameOptionsMode(
      HtmlService.XFrameOptionsMode.ALLOWALL
    );

}


/**
 * ============================================================
 * Include HTML File
 * ============================================================
 */
function include(filename) {

  return HtmlService
    .createHtmlOutputFromFile(filename)
    .getContent();

}


/**
 * ============================================================
 * Load Module HTML
 * ============================================================
 */
function getModule(moduleName) {

  try {

    return HtmlService
      .createHtmlOutputFromFile(
        "modules/" + moduleName
      )
      .getContent();

  }

  catch (e) {

    return `
      <div class="container py-5">

        <div class="alert alert-danger">

          <h5>Module Not Found</h5>

          <p>${moduleName}</p>

        </div>

      </div>
    `;

  }

}


/**
 * ============================================================
 * Current Logged In User
 * Temporary
 * ============================================================
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
 * Dashboard Module
 * ============================================================
 */
function loadDashboard() {

  const user = getCurrentUser();

  return success(

    "Dashboard Loaded",

    getDashboardData(user.studentId)

  );

}