/**
 * ==========================================================
 * PIBM Resume Builder v1.0
 * DashboardService.gs
 * ----------------------------------------------------------
 * Dashboard Service
 * Business Logic Layer
 * ==========================================================
 */


/**
 * ==========================================================
 * Get Dashboard Data
 * ==========================================================
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
 * ==========================================================
 * Calculate Dashboard Completion Status
 * ==========================================================
 */
function calculateCompletionStatus(studentId) {

  const profile = getStudentProfile(studentId);

  if (!profile) {
    throw new Error("Student profile not found.");
  }

  const completion = getBlankCompletionStatus();

  /**
   * Personal
   */
  completion.personal =
    isPersonalProfileComplete(profile);


  /**
   * Education
   */
  completion.education =
    safeLength(getEducations, studentId) > 0;


  /**
   * Experience
   * (Freshers can be handled later)
   */
  completion.experience =
    safeLength(getExperiences, studentId) > 0;


  /**
   * Internship
   */
  completion.internship =
    safeLength(getInternships, studentId) > 0;


  /**
   * Projects
   */
  completion.projects =
    safeLength(getProjects, studentId) > 0;


  /**
   * Skills
   */
  completion.skills =
    safeLength(getSkills, studentId) >= 5;


  /**
   * Certifications
   */
  completion.certifications =
    safeLength(getCertifications, studentId) > 0;


  /**
   * Achievements
   */
  completion.achievements =
    safeLength(getAchievements, studentId) > 0;


  /**
   * Overall Completion
   */
  completion.overall =
    calculateOverallCompletion(completion);

  return completion;

}