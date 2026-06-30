/**
 * ============================================================
 * PIBM Resume Builder v1.0
 * DateUtils.gs
 * ------------------------------------------------------------
 * Date & Time Utility Functions
 * ============================================================
 */


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
 * Format Date
 * ============================================================
 */
function formatDate(date) {

  if (!date) {
    return "";
  }

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

  if (!date) {
    return "";
  }

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

  if (!startDate) {
    return 0;
  }

  const start = new Date(startDate);

  const end = endDate
    ? new Date(endDate)
    : new Date();

  let months =
    (end.getFullYear() - start.getFullYear()) * 12;

  months += end.getMonth() - start.getMonth();

  if (end.getDate() < start.getDate()) {
    months--;
  }

  return Math.max(months, 0);

}


/**
 * ============================================================
 * Convert Months to Experience Text
 * ============================================================
 */
function formatExperience(months) {

  months = Number(months) || 0;

  const years = Math.floor(months / 12);

  const remainingMonths = months % 12;

  const parts = [];

  if (years > 0) {

    parts.push(
      years + (years === 1 ? " Year" : " Years")
    );

  }

  if (remainingMonths > 0) {

    parts.push(
      remainingMonths +
      (remainingMonths === 1 ? " Month" : " Months")
    );

  }

  return parts.length
    ? parts.join(" ")
    : "Fresher";

}