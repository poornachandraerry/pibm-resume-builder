/**
 * ============================================================
 * PIBM Resume Builder v1.0
 * IdGenerator.gs
 * ------------------------------------------------------------
 * ID Generation Utility Functions
 * ============================================================
 */


/**
 * ============================================================
 * Generate Student ID
 * Format : STU000001
 * ============================================================
 */
function generateStudentID() {

  const value = new Date().getTime() % 1000000;

  return "STU" + Utilities.formatString("%06d", value);

}


/**
 * ============================================================
 * Generate Generic UUID
 * ============================================================
 */
function generateId() {

  return Utilities.getUuid();

}


/**
 * ============================================================
 * Generate Resume ID
 * Format : RES202607010001
 * ============================================================
 */
function generateResumeID() {

  return "RES" + Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    "yyyyMMddHHmmss"
  );

}


/**
 * ============================================================
 * Generate Certificate ID
 * ============================================================
 */
function generateCertificateID() {

  return "CERT-" + Utilities.getUuid().substring(0, 8).toUpperCase();

}