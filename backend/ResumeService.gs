/**
 * ==========================================================
 * ResumeService.gs (Template Merge Engine)
 * Compatible with PIBM Resume Builder v1.0
 * ----------------------------------------------------------
 * Field names below MUST match the object shape returned by
 * getResumeData(studentId) in ResumeDataService.gs
 * ==========================================================
 */

/**
 * Generates a resume PDF and saves it into the student's
 * Drive folder (via DriveService). Returns file info.
 */
function generateResume(studentId, templateName) {

  if (!studentId) {
    throw new Error("Student ID is required.");
  }

  templateName = templateName || CONFIG.DEFAULT_TEMPLATE;

  const data = getResumeData(studentId);

  const template = HtmlService
    .createTemplateFromFile('templates/' + templateName + '/' + templateName);

  let html = template.evaluate().getContent();

  html = mergeResumeTemplate(html, data);

  const blob = Utilities.newBlob(html, 'text/html', 'resume.html')
      .getAs('application/pdf')
      .setName((data.personal.name || 'Resume') + ' - ' + templateName + '.pdf');

  const folder = getStudentResumeFolder(studentId, data.personal.name || "Student");
  const file = folder.createFile(blob);

  logResumeGeneration(studentId, templateName, file.getId());

  return {
    success: true,
    fileId: file.getId(),
    url: file.getUrl(),
    fileName: file.getName()
  };
}

/**
 * Merges resume data into the chosen HTML template string.
 */
function mergeResumeTemplate(html, data) {

  const personal = data.personal || {};

  const map = {
    "{{FULL_NAME}}": personal.name || "",
    "{{EMAIL}}": personal.email || "",
    "{{MOBILE}}": personal.mobile || "",
    "{{LINKEDIN}}": personal.linkedin || "",
    "{{ADDRESS}}": [personal.address, personal.city, personal.state, personal.pincode]
        .filter(Boolean).join(", "),
    "{{CAREER_OBJECTIVE}}": personal.objective || "",
    "{{SKILLS}}": buildSkills(data.skills || []),
    "{{EDUCATION_BLOCK}}": buildEducation(data.education || []),
    "{{EXPERIENCE_BLOCK}}": buildExperience(data.experience || []),
    "{{INTERNSHIP_BLOCK}}": buildInternships(data.internships || []),
    "{{PROJECT_BLOCK}}": buildProjects(data.projects || []),
    "{{CERTIFICATION_BLOCK}}": buildCertifications(data.certifications || []),
    "{{ACHIEVEMENT_BLOCK}}": buildAchievements(data.achievements || [])
  };

  Object.keys(map).forEach(function(key){
    html = html.split(key).join(map[key]);
  });

  return html;
}

function escapeHtml(str){
  return String(str == null ? "" : str)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;");
}

function buildEducation(list){
  if (!list.length) return "<p class='small'>No education details added.</p>";
  return list.map(function(e){
    return "<div class='item'><div class='item-title'>" + escapeHtml(e.degree || e.course || "") +
      (e.specialization ? " - " + escapeHtml(e.specialization) : "") + "</div>" +
      "<div>" + escapeHtml(e.institute || "") + (e.university ? ", " + escapeHtml(e.university) : "") + "</div>" +
      "<div class='small'>" + escapeHtml(e.passingYear || e.endYear || "") +
      (e.cgpa ? " | CGPA/%: " + escapeHtml(e.cgpa) : "") + "</div></div>";
  }).join("");
}

function buildExperience(list){
  if (!list.length) return "<p class='small'>No work experience added.</p>";
  return list.map(function(e){
    return "<div class='item'><div class='item-title'>" + escapeHtml(e.designation || "") +
      " - " + escapeHtml(e.company || "") + "</div>" +
      "<div class='small'>" + escapeHtml(e.startDate || "") + " - " + escapeHtml(e.endDate || "Present") + "</div>" +
      "<p>" + escapeHtml(e.responsibilities || "") + "</p></div>";
  }).join("");
}

function buildInternships(list){
  if (!list.length) return "<p class='small'>No internships added.</p>";
  return list.map(function(i){
    return "<div class='item'><div class='item-title'>" + escapeHtml(i.designation || i.role || "") +
      " - " + escapeHtml(i.company || "") + "</div>" +
      "<div class='small'>" + escapeHtml(i.startDate || "") + " - " + escapeHtml(i.endDate || "") + "</div>" +
      "<p>" + escapeHtml(i.responsibilities || "") + "</p></div>";
  }).join("");
}

function buildProjects(list){
  if (!list.length) return "<p class='small'>No projects added.</p>";
  return list.map(function(p){
    return "<div class='item'><div class='item-title'>" + escapeHtml(p.title || "") + "</div>" +
      "<p>" + escapeHtml(p.description || "") + "</p>" +
      (p.technologies ? "<div class='small'>Technologies: " + escapeHtml(p.technologies) + "</div>" : "") +
      "</div>";
  }).join("");
}

function buildCertifications(list){
  if (!list.length) return "<li class='small'>No certifications added.</li>";
  return list.map(function(c){
    return "<li>" + escapeHtml(c.name || "") +
      (c.organization ? " - " + escapeHtml(c.organization) : "") + "</li>";
  }).join("");
}

function buildAchievements(list){
  if (!list.length) return "<li class='small'>No achievements added.</li>";
  return list.map(function(a){
    return "<li>" + escapeHtml(a.title || "") + "</li>";
  }).join("");
}

function buildSkills(list){
  if (!list.length) return "<span class='small'>No skills added.</span>";
  return list.map(function(s){
    return "<span class='skill-pill'>" + escapeHtml(s.name || "") + "</span> ";
  }).join("");
}

/**
 * Logs every resume generation to the Resume_Log sheet
 * if it exists, so admins can audit usage. Fails silently if the
 * sheet/columns aren't set up yet.
 */
function logResumeGeneration(studentId, templateName, fileId){
  try {
    const sheet = getSheet(CONFIG.SHEETS.RESUME_LOG);
    sheet.appendRow([studentId, templateName, fileId, now()]);
  } catch (e) {
    // Resume_Log sheet not present yet - safe to ignore.
  }
}
