/**
 * ============================================================
 * PIBM Resume Builder v1.0
 * Response.gs
 * ------------------------------------------------------------
 * Standard Response Helpers
 * ============================================================
 */


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
 * Failure Response
 * ============================================================
 */
function failure(message) {

  return {

    success: false,

    message: message || "Unknown Error",

    data: null

  };

}


/**
 * ============================================================
 * Warning Response
 * ============================================================
 */
function warning(message, data) {

  return {

    success: false,

    warning: true,

    message: message || "",

    data: data || null

  };

}


/**
 * ============================================================
 * Information Response
 * ============================================================
 */
function info(message, data) {

  return {

    success: true,

    info: true,

    message: message || "",

    data: data || null

  };

}