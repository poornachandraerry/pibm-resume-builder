/**
 * ============================================================
 * PIBM Resume Builder v1.0
 * StudentController.gs
 * ------------------------------------------------------------
 * Controller between UI and Student Services
 * ============================================================
 */


/**
 * ============================================================
 * Load Student Profile
 * ============================================================
 */
function loadStudentProfile(studentId) {

  try {

    const student = getStudentProfile(studentId);

    if (!student) {
      return failure("Student profile not found.");
    }

    return success(
      "Student profile loaded.",
      student
    );

  } catch (error) {

    return failure(error.toString());

  }

}


/**
 * ============================================================
 * Save Student Profile
 * ============================================================
 */
function saveStudent(student) {

  try {

    if (!student.Student_ID) {

      student.Student_ID = generateStudentID();

      return saveStudentProfile(student);

    }

    return updateStudentProfile(student);

  }

  catch (error) {

    return failure(error.toString());

  }

}


/**
 * ============================================================
 * Get Empty Student Object
 * ============================================================
 */
function getBlankStudent() {

  return {

    Student_ID: "",

    Full_Name: "",

    Email: "",

    Mobile: "",

    Alternate_Mobile: "",

    Date_of_Birth: "",

    Gender: "",

    LinkedIn_URL: "",

    Portfolio_URL: "",

    GitHub_URL: "",

    Address: "",

    City: "",

    State: "",

    Pincode: "",

    Photo_File_ID: "",

    Signature_File_ID: "",

    Career_Objective: "",

    Resume_Headline: "",

    Current_Location: "",

    Preferred_Location: "",

    Nationality: "",

    Languages_Known: "",

    Strengths: "",

    Hobbies: "",

    Declaration: "",

    Resume_Type: CONFIG.DEFAULT_TEMPLATE,

    Profile_Status: CONFIG.PROFILE_STATUS.DRAFT

  };

}


/**
 * ============================================================
 * Validate Student
 * ============================================================
 */
function validateStudent(student) {

  if (isEmpty(student.Full_Name)) {
    throw new Error("Full Name is required.");
  }

  if (isEmpty(student.Email)) {
    throw new Error("Email is required.");
  }

  if (isEmpty(student.Mobile)) {
    throw new Error("Mobile Number is required.");
  }

  return true;

}


/**
 * ============================================================
 * Save Student With Validation
 * ============================================================
 */
function saveValidatedStudent(student) {

  try {

    validateStudent(student);

    return saveStudent(student);

  }

  catch (error) {

    return failure(error.message);

  }

}


/**
 * ============================================================
 * Dashboard Controller
 * ============================================================
 */
function loadDashboard(studentId) {

  try {

    const dashboard = getDashboardData(studentId);

    return success(
      "Dashboard loaded successfully.",
      dashboard
    );

  }

  catch (error) {

    return failure(error.toString());

  }

}


/**
 * ============================================================
 * Profile Completion Controller
 * ============================================================
 */
function loadCompletionStatus(studentId) {

  try {

    const completion = calculateCompletionStatus(studentId);

    return success(
      "Completion status loaded.",
      completion
    );

  }

  catch (error) {

    return failure(error.toString());

  }

}