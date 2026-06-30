/**
 * ==========================================================
 * PIBM Resume Builder v1.0
 * DashboardModel.gs
 * ----------------------------------------------------------
 * Dashboard Model
 * ==========================================================
 */


/**
 * ==========================================================
 * Blank Completion Status
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
 * Blank Dashboard Student
 * ==========================================================
 */
function getBlankDashboardStudent() {

  return {

    studentId: "",

    name: "",

    email: "",

    mobile: "",

    batch: "",

    program: "",

    specialization: "",

    photo: ""

  };

}


/**
 * ==========================================================
 * Blank Dashboard
 * ==========================================================
 */
function getBlankDashboard() {

  return {

    student: getBlankDashboardStudent(),

    completion: getBlankCompletionStatus(),

    activity: []

  };

}


/**
 * ==========================================================
 * Build Dashboard Student
 * ==========================================================
 */
function buildDashboardStudent(profile) {

  const student = getBlankDashboardStudent();

  if (!profile) {
    return student;
  }

  student.studentId = profile.Student_ID || "";
  student.name = profile.Full_Name || "";
  student.email = profile.Email || "";
  student.mobile = profile.Mobile || "";
  student.batch = profile.Batch || "";
  student.program = profile.Program || "";
  student.specialization = profile.Specialization || "";
  student.photo = profile.Photo_File_ID || "";

  return student;

}


/**
 * ==========================================================
 * Build Recent Activity
 * Placeholder for v1
 * ==========================================================
 */
function buildRecentActivity(studentId) {

  return [];

}
