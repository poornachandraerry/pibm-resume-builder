/**
 * ============================================================
 * PIBM Resume Builder v1.0
 * Validation.gs
 * ------------------------------------------------------------
 * Validation Utility Functions
 * ============================================================
 */


/**
 * ============================================================
 * Check Empty
 * ============================================================
 */
function isEmpty(value) {

  return (

    value === null ||

    value === undefined ||

    String(value).trim() === ""

  );

}


/**
 * ============================================================
 * Check Email
 * ============================================================
 */
function isValidEmail(email) {

  if (isEmpty(email)) {

    return false;

  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(email);

}


/**
 * ============================================================
 * Check Mobile Number
 * ============================================================
 */
function isValidMobile(mobile) {

  if (isEmpty(mobile)) {

    return false;

  }

  return /^[6-9]\d{9}$/.test(String(mobile).trim());

}


/**
 * ============================================================
 * Required Field Validation
 * ============================================================
 */
function requireField(value, fieldName) {

  if (isEmpty(value)) {

    throw new Error(fieldName + " is required.");

  }

}


/**
 * ============================================================
 * Required Email
 * ============================================================
 */
function requireEmail(email) {

  requireField(email, "Email");

  if (!isValidEmail(email)) {

    throw new Error("Invalid email address.");

  }

}


/**
 * ============================================================
 * Required Mobile
 * ============================================================
 */
function requireMobile(mobile) {

  requireField(mobile, "Mobile Number");

  if (!isValidMobile(mobile)) {

    throw new Error("Invalid mobile number.");

  }

}