/**
 * ==========================================================
 * PIBM Resume Builder v1.0
 * DashboardService.gs
 * ----------------------------------------------------------
 * Dashboard Service
 * ==========================================================
 */

/**
 * Load Dashboard (Controller Entry)
 */
function loadDashboard() {

  const user = getCurrentUser();

  try {

    return success(
      "Dashboard loaded successfully.",
      getDashboardData(user.studentId)
    );

  } catch (e) {

    return failure(e.message);

  }

}


/**
 * Get Dashboard Data
 */
function getDashboardData(studentId) {

  if (isEmpty(studentId)) {
    throw new Error("Student ID is required.");
  }

  const profile = getStudentProfile(studentId);

  if (!profile) {
    throw new Error("Student profile not found.");
  }

  return {

    student: buildDashboardStudent(profile),

    completion: calculateCompletionStatus(studentId),

    activity: buildRecentActivity(studentId)

  };

}


/**
 * Calculate Completion Status
 */
function calculateCompletionStatus(studentId) {

  const completion = getBlankCompletionStatus();

  const profile = getStudentProfile(studentId);

  completion.personal = isPersonalProfileComplete(profile);
  completion.education = safeLength(getEducations, studentId) > 0;
  completion.experience = safeLength(getExperiences, studentId) > 0;
  completion.internship = safeLength(getInternships, studentId) > 0;
  completion.projects = safeLength(getProjects, studentId) > 0;
  completion.skills = safeLength(getSkills, studentId) >= 5;
  completion.certifications = safeLength(getCertifications, studentId) > 0;
  completion.achievements = safeLength(getAchievements, studentId) > 0;

  completion.overall = calculateOverallCompletion(completion);

  return completion;

}


/**
 * Build Dashboard Student
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
 * Personal Profile Check
 */
function isPersonalProfileComplete(profile) {

  if (!profile) return false;

  return (
    !isEmpty(profile.Full_Name) &&
    !isEmpty(profile.Email) &&
    !isEmpty(profile.Mobile)
  );

}


/**
 * Safe Length
 */
function safeLength(serviceFunction, studentId) {

  try {

    if (typeof serviceFunction !== "function") {
      return 0;
    }

    const data = serviceFunction(studentId);

    return Array.isArray(data) ? data.length : 0;

  } catch (e) {

    return 0;

  }

}


/**
 * Overall Completion
 */
function calculateOverallCompletion(c) {

  let completed = 0;

  [
    c.personal,
    c.education,
    c.experience,
    c.internship,
    c.projects,
    c.skills,
    c.certifications,
    c.achievements
  ].forEach(function(v) {

    if (v) completed++;

  });

  return Math.round((completed / 8) * 100);

}


/**
 * Recent Activity
 */
function buildRecentActivity(studentId) {

  return [];

}
