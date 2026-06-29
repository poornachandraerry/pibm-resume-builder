/**
 * ==========================================================
 * ResumeService.gs V2 (Foundation)
 * Production-ready foundation for PIBM Resume Builder
 * ==========================================================
 */

function generateResume(templateName) {
  try {
    if (!templateName) throw new Error("Template name is required.");

    const data = getResumeData();
    validateResumeData_(data);

    const html = renderResumeTemplate_(templateName, data);

    const pdfBlob = HtmlService
      .createHtmlOutput(html)
      .getBlob()
      .getAs(MimeType.PDF)
      .setName(buildResumeFileName_(data));

    const file = DriveApp.createFile(pdfBlob);

    return {
      success: true,
      fileId: file.getId(),
      url: file.getUrl(),
      fileName: file.getName()
    };

  } catch (err) {
    console.error(err);
    throw new Error("Resume generation failed: " + err.message);
  }
}

function renderResumeTemplate_(templateName, data) {
  const template = HtmlService.createTemplateFromFile(
    'templates/' + templateName + '/' + templateName
  );

  let html = template.evaluate().getContent();

  const replacements = buildReplacementMap_(data);

  Object.keys(replacements).forEach(function (key) {
    html = html.replace(new RegExp(escapeRegExp_(key), "g"), replacements[key]);
  });

  return html;
}

function buildReplacementMap_(data) {
  const p = data.personal || {};

  return {
    "{{FULL_NAME}}": htmlEscape_(((p.First_Name || "") + " " + (p.Last_Name || "")).trim()),
    "{{EMAIL}}": htmlEscape_(p.Email || ""),
    "{{MOBILE}}": htmlEscape_(p.Mobile || ""),
    "{{LINKEDIN}}": htmlEscape_(p.LinkedIn || ""),
    "{{ADDRESS}}": htmlEscape_(p.Address || ""),
    "{{CAREER_OBJECTIVE}}": htmlEscape_(p.Career_Objective || ""),
    "{{SKILLS}}": buildSkills(data.skills || []),
    "{{EDUCATION_BLOCK}}": buildEducation(data.education || []),
    "{{EXPERIENCE_BLOCK}}": buildExperience(data.experience || []),
    "{{INTERNSHIP_BLOCK}}": buildInternships(data.internships || []),
    "{{PROJECT_BLOCK}}": buildProjects(data.projects || []),
    "{{CERTIFICATION_BLOCK}}": buildCertifications(data.certifications || []),
    "{{ACHIEVEMENT_BLOCK}}": buildAchievements(data.achievements || [])
  };
}

function validateResumeData_(data) {
  if (!data || !data.personal) {
    throw new Error("Student profile not found.");
  }
}

function buildResumeFileName_(data) {
  const p = data.personal || {};
  return ((p.First_Name || "Resume") + "_" + (p.Last_Name || "")).trim() + ".pdf";
}

function htmlEscape_(v) {
  return String(v || "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;");
}

function escapeRegExp_(s){
  return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
}

function buildEducation(list){
  return list.map(e=>"<div><strong>"+htmlEscape_(e.Qualification||"")+
    "</strong><br>"+htmlEscape_(e.Institute||"")+" ("+
    htmlEscape_(e.Year||"")+")</div>").join("");
}

function buildExperience(list){
  return list.map(e=>"<div><strong>"+htmlEscape_(e.Designation||"")+
    "</strong> - "+htmlEscape_(e.Company||"")+
    "<p>"+htmlEscape_(e.Responsibilities||"")+"</p></div>").join("");
}

function buildInternships(list){
  return list.map(i=>"<div><strong>"+htmlEscape_(i.Organization||"")+
    "</strong> - "+htmlEscape_(i.Role||"")+"</div>").join("");
}

function buildProjects(list){
  return list.map(p=>"<div><strong>"+htmlEscape_(p.Project_Title||"")+
    "</strong><p>"+htmlEscape_(p.Description||"")+"</p></div>").join("");
}

function buildCertifications(list){
  return list.map(c=>"<li>"+htmlEscape_(c.Certification_Name||"")+"</li>").join("");
}

function buildAchievements(list){
  return list.map(a=>"<li>"+htmlEscape_(a.Title||"")+"</li>").join("");
}

function buildSkills(list){
  return list.map(s=>"<span>"+htmlEscape_(s.Skill_Name||s.Name||s)+"</span>").join(" ");
}
