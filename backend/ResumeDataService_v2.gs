/**
 * ==========================================================
 * ResumeDataService.gs V2
 * Consolidates all resume sections for rendering
 * ==========================================================
 */

function getResumeData(studentId) {
  try {

    const profile = studentId
      ? getStudentProfile(studentId)
      : getStudentProfile(getCurrentStudentId_());

    if (!profile) {
      throw new Error("Student profile not found.");
    }

    const id = profile.Student_ID || profile.StudentId;

    return {
      personal: profile,
      education: safeCall_("getEducationList", id),
      experience: safeCall_("getExperienceList", id),
      internships: safeCall_("getInternshipList", id),
      projects: safeCall_("getProjectList", id),
      skills: safeCall_("getSkillList", id),
      certifications: safeCall_("getCertificationList", id),
      achievements: safeCall_("getAchievementList", id),
      generatedOn: new Date()
    };

  } catch (err) {
    console.error(err);
    throw new Error("Unable to prepare resume data: " + err.message);
  }
}

/**
 * Safely invokes a service method if it exists.
 */
function safeCall_(functionName, studentId) {

  if (typeof this[functionName] !== "function") {
    return [];
  }

  try {
    return this[functionName](studentId) || [];
  } catch (e) {
    console.warn(functionName + " failed: " + e.message);
    return [];
  }
}

/**
 * Returns the logged-in/current student id.
 * Replace with your authentication implementation if required.
 */
function getCurrentStudentId_() {

  if (typeof getLoggedInStudent === "function") {
    const student = getLoggedInStudent();
    if (student) {
      return student.Student_ID || student.StudentId;
    }
  }

  throw new Error("Current student could not be determined.");
}

/**
 * Simple completeness check for UI progress.
 */
function getResumeCompletion(studentId) {

  const data = getResumeData(studentId);

  const sections = {
    Personal: !!data.personal,
    Education: data.education.length > 0,
    Experience: data.experience.length > 0,
    Internships: data.internships.length > 0,
    Projects: data.projects.length > 0,
    Skills: data.skills.length > 0,
    Certifications: data.certifications.length > 0,
    Achievements: data.achievements.length > 0
  };

  const completed = Object.values(sections).filter(Boolean).length;

  return {
    sections: sections,
    completed: completed,
    total: Object.keys(sections).length,
    percentage: Math.round((completed / Object.keys(sections).length) * 100)
  };
}
