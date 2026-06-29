/**
 * ==========================================================
 * ResumeService.gs (Starter Template Engine)
 * Compatible with PIBM Resume Builder v1.0
 * ==========================================================
 */

function generateResume(templateName) {

  const data = getResumeData();

  const template = HtmlService
    .createTemplateFromFile('templates/' + templateName + '/' + templateName);

  let html = template.evaluate().getContent();

  html = mergeResumeTemplate(html, data);

  const blob = Utilities.newBlob(html, 'text/html', 'resume.html')
      .getAs('application/pdf')
      .setName((data.personal?.First_Name || 'Resume') + '.pdf');

  const folder = DriveApp.getRootFolder();
  const file = folder.createFile(blob);

  return {
    success: true,
    fileId: file.getId(),
    url: file.getUrl()
  };
}

function mergeResumeTemplate(html, data) {

  const personal = data.personal || {};

  const map = {
    "{{FULL_NAME}}": ((personal.First_Name || "") + " " + (personal.Last_Name || "")).trim(),
    "{{EMAIL}}": personal.Email || "",
    "{{MOBILE}}": personal.Mobile || "",
    "{{LINKEDIN}}": personal.LinkedIn || "",
    "{{ADDRESS}}": personal.Address || "",
    "{{CAREER_OBJECTIVE}}": personal.Career_Objective || "",
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

function buildEducation(list){
  return list.map(function(e){
    return "<div><strong>" + (e.Qualification||"") +
      "</strong><br>" +
      (e.Institute||"") +
      " (" + (e.Year||"") + ")</div>";
  }).join("");
}

function buildExperience(list){
  return list.map(function(e){
    return "<div><strong>" + (e.Designation||"") +
      "</strong> - " + (e.Company||"") +
      "<br><p>" + (e.Responsibilities||"") + "</p></div>";
  }).join("");
}

function buildInternships(list){
  return list.map(function(i){
    return "<div><strong>" + (i.Organization||"") +
      "</strong> - " + (i.Role||"") + "</div>";
  }).join("");
}

function buildProjects(list){
  return list.map(function(p){
    return "<div><strong>" + (p.Project_Title||"") +
      "</strong><br>" + (p.Description||"") + "</div>";
  }).join("");
}

function buildCertifications(list){
  return list.map(function(c){
    return "<li>" + (c.Certification_Name||"") + "</li>";
  }).join("");
}

function buildAchievements(list){
  return list.map(function(a){
    return "<li>" + (a.Title||"") + "</li>";
  }).join("");
}

function buildSkills(list){
  return list.map(function(s){
    return "<span>" + (s.Skill_Name || s.Name || s) + "</span> ";
  }).join("");
}
