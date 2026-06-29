/**
 * ==========================================================
 * PIBM Resume Builder v1.0
 * DashboardModel.gs
 * ----------------------------------------------------------
 * Dashboard Model
 * Contains reusable business logic and calculations.
 * ==========================================================
 */


/**
 * ==========================================================
 * Empty Completion Object
 * ==========================================================
 */
function getBlankCompletionStatus() {

  return {

    personal: false,

    education: false,

    experience: false,

    internship: false,

    projects: false,

    skills: false,

    certifications: false,

    achievements: false,

    overall: 0

  };

}


/**
 * ==========================================================
 * Calculate Overall Completion
 * ==========================================================
 */
function calculateOverallCompletion(completion) {

  const keys = [

    "personal",

    "education",

    "experience",

    "internship",

    "projects",

    "skills",

    "certifications",

    "achievements"

  ];

  let completed = 0;

  keys.forEach(function (key) {

    if (completion[key]) {

      completed++;

    }

  });

  return Math.round((completed / keys.length) * 100);

}



/**
 * ==========================================================
 * Safe Length
 * ==========================================================
 */
function safeLength(serviceFunction, studentId) {

  try {

    if (typeof serviceFunction !== "function") {

      return 0;

    }

    const result = serviceFunction(studentId);

    if (!result) {

      return 0;

    }

    return result.length;

  }

  catch (e) {

    return 0;

  }

}



/**
 * ==========================================================
 * Personal Profile Complete?
 * ==========================================================
 */
function isPersonalProfileComplete(profile) {

  if (!profile) {

    return false;

  }

  return (

    !isEmpty(profile.Full_Name) &&

    !isEmpty(profile.Email) &&

    !isEmpty(profile.Mobile)

  );

}



/**
 * ==========================================================
 * Build Student Summary
 * ==========================================================
 */
function buildDashboardStudent(profile) {

  return {

    studentId: profile.Student_ID || "",

    name: profile.Full_Name || "",

    email: profile.Email || "",

    mobile: profile.Mobile || "",

    batch: profile.Batch || "",

    program: profile.Program || "",

    specialization: profile.Specialization || "",

    photo: profile.Photo_File_ID || ""

  };

}



/**
 * ==========================================================
 * Placeholder Recent Activity
 * ==========================================================
 */
function buildRecentActivity(studentId) {

  return [];

}