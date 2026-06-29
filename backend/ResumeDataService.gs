/**
 * ==========================================================
 * Resume Data Service
 * ----------------------------------------------------------
 * Builds Complete Resume Object
 * ==========================================================
 */


/**
 * ==========================================================
 * Get Complete Resume Data
 * ==========================================================
 */
function getResumeData(studentId) {

  if (!studentId) {
    throw new Error("Student ID is required.");
  }

  const resume = createResumeObject();

  resume.personal = buildPersonal(studentId);

resume.education = buildEducation(studentId);

resume.experience = buildExperience(studentId);

resume.internships = buildInternships(studentId);

resume.projects = buildProjects(studentId);

resume.skills = buildSkills(studentId);

resume.certifications = buildCertifications(studentId);

resume.achievements = buildAchievements(studentId);

resume.summary = buildResumeSummary(resume);

resume.validation = buildValidation(resume);

resume.ats = buildATSData(resume);

return resume;

}


/**
 * ==========================================================
 * Create Resume Object
 * ==========================================================
 */
function createResumeObject() {

  return {

    personal: {},

    education: [],

    experience: [],

    internships: [],

    projects: [],

    skills: [],

    certifications: [],

    achievements: [],

    summary: {},

    validation: {},

    ats: {}

  };

}


/**
 * ==========================================================
 * Build Personal Details
 * ==========================================================
 */
function buildPersonal(studentId) {

  const student = getStudentProfile(studentId);

  if (!student) {

    throw new Error("Student not found.");

  }

  return {

    studentId: student.Student_ID,

    name: student.Full_Name,

    email: student.Email,

    mobile: student.Mobile,

    alternateMobile: student.Alternate_Mobile,

    dob: student.Date_of_Birth,

    gender: student.Gender,

    address: student.Address,

    city: student.City,

    state: student.State,

    pincode: student.Pincode,

    linkedin: student.LinkedIn_URL,

    github: student.GitHub_URL,

    portfolio: student.Portfolio_URL,

    photo: student.Photo_File_ID,

    signature: student.Signature_File_ID,

    objective: student.Career_Objective,

    headline: student.Resume_Headline,

    currentLocation: student.Current_Location,

    preferredLocation: student.Preferred_Location,

    nationality: student.Nationality,

    languages: student.Languages_Known,

    strengths: student.Strengths,

    hobbies: student.Hobbies,

    declaration: student.Declaration,

    resumeType: student.Resume_Type,

    profileStatus: student.Profile_Status,

    createdOn: student.Created_On,

    updatedOn: student.Updated_On

  };

}


/**
 * ==========================================================
 * Build Education
 * ==========================================================
 */
function buildEducation(studentId) {

  const education = getEducation(studentId);

  if (!education || education.length === 0) {

    return [];

  }

  education.sort(function(a, b) {

    return Number(b.Passing_Year) - Number(a.Passing_Year);

  });

  return education.map(function(item) {

    return {

      type: item.Education_Type,

      degree: item.Degree,

      course: item.Course,

      specialization: item.Specialization,

      institute: item.Institute,

      university: item.University,

      board: item.Board,

      cgpa: item.CGPA_Percentage,

      startYear: item.Start_Year,

      endYear: item.End_Year,

      passingYear: item.Passing_Year,

      city: item.City,

      state: item.State

    };

  });

}


/**
 * ==========================================================
 * Build Experience
 * ==========================================================
 */
function buildExperience(studentId) {

  const experience = getExperience(studentId);

  if (!experience || experience.length === 0) {

    return [];

  }

  experience.sort(function(a, b) {

    return new Date(b.End_Date || new Date()) -

           new Date(a.End_Date || new Date());

  });

  return experience.map(function(item) {

    return {

      company: item.Company_Name,

      industry: item.Industry,

      department: item.Department,

      designation: item.Designation,

      employmentType: item.Employment_Type,

      location: item.Location,

      startDate: item.Start_Date,

      endDate: item.End_Date,

      duration: item.Duration,

      currentCTC: item.Current_CTC,

      responsibilities: item.Responsibilities,

      achievements: item.Achievements,

      teamSize: item.Team_Size,

      reportingManager: item.Reporting_Manager,

      tools: item.Software_Tools,

      certificate: item.Experience_Certificate

    };

  });

}
/**
 * ==========================================================
 * Build Internships
 * ==========================================================
 */
function buildInternships(studentId) {

  const internships = getInternships(studentId);

  if (!internships || internships.length === 0) {
    return [];
  }

  internships.sort(function (a, b) {

    return new Date(b.End_Date || new Date()) -
           new Date(a.End_Date || new Date());

  });

  return internships.map(function (item) {

    return {

      type: item.Internship_Type,

      company: item.Company_Name,

      industry: item.Industry,

      department: item.Department,

      designation: item.Designation,

      location: item.Location,

      startDate: item.Start_Date,

      endDate: item.End_Date,

      duration: item.Duration,

      projectTitle: item.Project_Title,

      guide: item.Guide_Name,

      responsibilities: item.Responsibilities,

      achievements: item.Achievements,

      softwareTools: item.Software_Tools,

      certificate: item.Internship_Certificate

    };

  });

}


/**
 * ==========================================================
 * Build Projects
 * ==========================================================
 */
function buildProjects(studentId) {

  const projects = getProjects(studentId);

  if (!projects || projects.length === 0) {
    return [];
  }

  projects.sort(function (a, b) {

    return new Date(b.End_Date || new Date()) -
           new Date(a.End_Date || new Date());

  });

  return projects.map(function (item) {

    return {

      projectNo: item.Project_No,

      title: item.Project_Title,

      organization: item.Organization,

      client: item.Client_Name,

      duration: item.Duration,

      startDate: item.Start_Date,

      endDate: item.End_Date,

      guide: item.Guide_Name,

      role: item.Role,

      description: item.Description,

      technologies: item.Technologies_Used,

      outcome: item.Outcome,

      github: item.GitHub_Link,

      projectUrl: item.Project_URL

    };

  });

}


/**
 * ==========================================================
 * Build Skills
 * ==========================================================
 */
function buildSkills(studentId) {

  const skills = getSkills(studentId);

  if (!skills || skills.length === 0) {
    return [];
  }

  skills.sort(function (a, b) {

    if (a.Skill_Category === b.Skill_Category) {
      return a.Skill_Name.localeCompare(b.Skill_Name);
    }

    return a.Skill_Category.localeCompare(b.Skill_Category);

  });

  return skills.map(function (item) {

    return {

      skillNo: item.Skill_No,

      category: item.Skill_Category,

      name: item.Skill_Name,

      proficiency: item.Proficiency,

      experienceYears: item.Experience_Years,

      lastUsed: item.Last_Used

    };

  });

}


/**
 * ==========================================================
 * Build Certifications
 * ==========================================================
 */
function buildCertifications(studentId) {

  const certifications = getCertifications(studentId);

  if (!certifications || certifications.length === 0) {
    return [];
  }

  certifications.sort(function (a, b) {

    return new Date(b.Issue_Date || new Date()) -
           new Date(a.Issue_Date || new Date());

  });

  return certifications.map(function (item) {

    return {

      certificationNo: item.Certification_No,

      name: item.Certification_Name,

      organization: item.Issuing_Organization,

      platform: item.Platform,

      credentialId: item.Credential_ID,

      credentialUrl: item.Credential_URL,

      issueDate: item.Issue_Date,

      expiryDate: item.Expiry_Date,

      certificateFile: item.Certificate_File,

      skillsGained: item.Skills_Gained

    };

  });

}


/**
 * ==========================================================
 * Build Achievements
 * ==========================================================
 */
function buildAchievements(studentId) {

  const achievements = getAchievements(studentId);

  if (!achievements || achievements.length === 0) {
    return [];
  }

  achievements.sort(function (a, b) {

    return new Date(b.Date || new Date()) -
           new Date(a.Date || new Date());

  });

  return achievements.map(function (item) {

    return {

      achievementNo: item.Achievement_No,

      category: item.Category,

      title: item.Achievement_Title,

      description: item.Description,

      date: item.Date,

      organization: item.Organization,

      document: item.Supporting_Document

    };

  });

}

/**
 * ==========================================================
 * Resume Summary
 * ==========================================================
 */
function buildResumeSummary(resume) {

  const summary = {};

  summary.educationCount = resume.education.length;

  summary.experienceCount = resume.experience.length;

  summary.internshipCount = resume.internships.length;

  summary.projectCount = resume.projects.length;

  summary.skillCount = resume.skills.length;

  summary.certificationCount = resume.certifications.length;

  summary.achievementCount = resume.achievements.length;

  summary.totalExperienceMonths =
    calculateTotalExperience(resume.experience);

  summary.totalExperience =
    formatExperience(summary.totalExperienceMonths);

  summary.profileCompletion =
    calculateProfileCompletion(resume);

  summary.resumeReadiness =
    calculateResumeReadiness(summary);

  return summary;

}


/**
 * ==========================================================
 * Validation
 * ==========================================================
 */
function buildValidation(resume) {

  const validation = {};

  validation.hasPhoto =
    !!resume.personal.photo;

  validation.hasLinkedIn =
    !!resume.personal.linkedin;

  validation.hasEmail =
    !!resume.personal.email;

  validation.hasMobile =
    !!resume.personal.mobile;

  validation.hasEducation =
    resume.education.length > 0;

  validation.hasExperience =
    resume.experience.length > 0;

  validation.hasInternship =
    resume.internships.length > 0;

  validation.hasProjects =
    resume.projects.length > 0;

  validation.hasSkills =
    resume.skills.length > 0;

  validation.hasCertifications =
    resume.certifications.length > 0;

  validation.hasAchievements =
    resume.achievements.length > 0;

  validation.isPlacementReady =
    resume.summary.resumeReadiness >=
    CONFIG.MIN_RESUME_READINESS;

  return validation;

}


/**
 * ==========================================================
 * ATS Builder
 * ==========================================================
 */
function buildATSData(resume) {

  const ats = {};

  const keywords = [];

  resume.skills.forEach(function(skill){

    keywords.push(skill.name);

  });

  resume.projects.forEach(function(project){

    if(project.technologies){

      project.technologies
        .split(",")
        .forEach(function(t){

          keywords.push(t.trim());

        });

    }

  });

  resume.certifications.forEach(function(cert){

    keywords.push(cert.name);

    if(cert.skillsGained){

      cert.skillsGained
        .split(",")
        .forEach(function(skill){

          keywords.push(skill.trim());

        });

    }

  });

  ats.keywords =

    [...new Set(keywords)]

      .filter(String)

      .sort();

  ats.totalKeywords =
    ats.keywords.length;

  return ats;

}


/**
 * ==========================================================
 * Profile Completion
 * ==========================================================
 */
function calculateProfileCompletion(resume){

  let score = 0;

  if(resume.personal.name) score += 10;

  if(resume.personal.email) score += 5;

  if(resume.personal.mobile) score += 5;

  if(resume.personal.photo) score += 10;

  if(resume.education.length) score += 20;

  if(resume.projects.length) score += 10;

  if(resume.skills.length) score += 15;

  if(resume.internships.length) score += 10;

  if(resume.certifications.length) score += 5;

  if(resume.achievements.length) score += 5;

  if(resume.personal.linkedin) score += 5;

  return Math.min(score,100);

}


/**
 * ==========================================================
 * Resume Readiness
 * ==========================================================
 */
function calculateResumeReadiness(summary){

  let score = summary.profileCompletion;

  if(summary.projectCount===0)
    score-=10;

  if(summary.skillCount===0)
    score-=15;

  if(summary.certificationCount===0)
    score-=5;

  return Math.max(score,0);

}


/**
 * ==========================================================
 * Experience Calculation
 * ==========================================================
 */
function calculateTotalExperience(experience){

  let months = 0;

  experience.forEach(function(job){

    months += monthsBetween(
      job.startDate,
      job.endDate
    );

  });

  return months;

}