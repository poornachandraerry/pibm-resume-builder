/**
 * ==========================================================
 * PIBM Resume Builder v1.0
 * SkillService.gs
 * Production Ready
 * ==========================================================
 */

/**
 * Get Skills
 */
function getSkills(studentId) {

  if (!studentId) {
    throw new Error("Student ID is required.");
  }

  const sheet = getSheet(CONFIG.SHEETS.SKILLS);
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) return [];

  const headers = data.shift();

  return data
    .filter(function (row) {
      return String(row[0]).trim() === String(studentId).trim();
    })
    .map(function (row) {
      return rowToObject(headers, row);
    });

}

/**
 * Save Skills
 */
function saveSkills(studentId, skillList) {

  if (!studentId) {
    throw new Error("Student ID is required.");
  }

  if (!Array.isArray(skillList) || skillList.length === 0) {
    return {
      success: true,
      message: "No skills found."
    };
  }

  deleteSkills(studentId);

  const sheet = getSheet(CONFIG.SHEETS.SKILLS);
  const headers = getHeaders(sheet);

  const rows = skillList.map(function (skill) {

    skill.Student_ID = studentId;

    sanitizeSkill_(skill);
    validateSkill(skill);

    skill.Skill_ID = skill.Skill_ID || Utilities.getUuid();
    skill.Created_On = skill.Created_On || now();
    skill.Updated_On = now();

    return headers.map(function (header) {
      return skill[header] !== undefined ? skill[header] : "";
    });

  });

  sheet.getRange(
    sheet.getLastRow() + 1,
    1,
    rows.length,
    rows[0].length
  ).setValues(rows);

  return {
    success: true,
    message: "Skills saved successfully."
  };

}

/**
 * Delete All Skills
 */
function deleteSkills(studentId) {

  const sheet = getSheet(CONFIG.SHEETS.SKILLS);
  const data = sheet.getDataRange().getValues();

  for (let i = data.length - 1; i >= 1; i--) {
    if (String(data[i][0]) === String(studentId)) {
      sheet.deleteRow(i + 1);
    }
  }

}

/**
 * Add Skill
 */
function addSkill(skill) {

  sanitizeSkill_(skill);
  validateSkill(skill);

  const sheet = getSheet(CONFIG.SHEETS.SKILLS);
  const headers = getHeaders(sheet);

  skill.Skill_ID = skill.Skill_ID || Utilities.getUuid();
  skill.Created_On = now();
  skill.Updated_On = now();

  const row = headers.map(function (header) {
    return skill[header] !== undefined ? skill[header] : "";
  });

  sheet.appendRow(row);

  return {
    success: true,
    message: "Skill added successfully."
  };

}

/**
 * Update Skill
 */
function updateSkill(skill) {

  sanitizeSkill_(skill);
  validateSkill(skill);

  const sheet = getSheet(CONFIG.SHEETS.SKILLS);
  const data = sheet.getDataRange().getValues();

  const headers = data[0];
  const idIndex = headers.indexOf("Skill_ID");

  if (idIndex === -1) {
    throw new Error("Skill_ID column not found.");
  }

  for (let i = 1; i < data.length; i++) {

    if (String(data[i][idIndex]) === String(skill.Skill_ID)) {

      skill.Updated_On = now();

      const row = headers.map(function (header) {
        return skill[header] !== undefined
          ? skill[header]
          : data[i][headers.indexOf(header)];
      });

      sheet.getRange(i + 1, 1, 1, row.length).setValues([row]);

      return {
        success: true,
        message: "Skill updated successfully."
      };
    }
  }

  throw new Error("Skill not found.");

}

/**
 * Delete Skill
 */
function deleteSkill(skillId) {

  const sheet = getSheet(CONFIG.SHEETS.SKILLS);
  const data = sheet.getDataRange().getValues();

  const headers = data[0];
  const idIndex = headers.indexOf("Skill_ID");

  for (let i = data.length - 1; i >= 1; i--) {

    if (String(data[i][idIndex]) === String(skillId)) {

      sheet.deleteRow(i + 1);

      return {
        success: true,
        message: "Skill deleted successfully."
      };
    }
  }

  throw new Error("Skill not found.");

}

/**
 * Validate Skill
 */
function validateSkill(skill) {

  if (!skill.Student_ID)
    throw new Error("Student ID is required.");

  if (!skill.Skill_Name)
    throw new Error("Skill Name is required.");

  if (!skill.Skill_Category)
    throw new Error("Skill Category is required.");

  if (skill.Proficiency_Level) {
    const allowed = getSkillLevels();
    if (allowed.indexOf(skill.Proficiency_Level) === -1) {
      throw new Error("Invalid proficiency level.");
    }
  }

}

/**
 * Skill Categories
 */
function getSkillCategories() {
  return [
    "Technical","Functional","Domain","Software","Programming",
    "Analytics","Marketing","Finance","HR","Operations",
    "Sales","Communication","Leadership","Soft Skills",
    "Language","Certification","Other"
  ];
}

/**
 * Proficiency Levels
 */
function getSkillLevels() {
  return ["Beginner","Intermediate","Advanced","Expert"];
}

/**
 * ATS Keywords
 */
function getATSKeywords(studentId) {

  const skills = getSkills(studentId);
  const keywords = [];

  skills.forEach(function (skill) {

    if (skill.Skill_Name) {
      keywords.push(skill.Skill_Name.trim());
    }

    if (skill.Tags) {
      skill.Tags.split(",").forEach(function (tag) {
        tag = tag.trim();
        if (tag) keywords.push(tag);
      });
    }

  });

  return [...new Set(keywords)].sort();

}

/**
 * Resume Skills
 */
function getResumeSkills(studentId) {

  const grouped = {};

  getSkills(studentId).forEach(function (skill) {

    const category = skill.Skill_Category || "Other";

    if (!grouped[category]) {
      grouped[category] = [];
    }

    grouped[category].push({
      name: skill.Skill_Name,
      level: skill.Proficiency_Level || ""
    });

  });

  return grouped;

}

/**
 * Internal Helper
 */
function sanitizeSkill_(skill) {

  [
    "Skill_Name",
    "Skill_Category",
    "Proficiency_Level",
    "Tags"
  ].forEach(function (field) {

    if (typeof skill[field] === "string") {
      skill[field] = skill[field].trim();
    }

  });

}
