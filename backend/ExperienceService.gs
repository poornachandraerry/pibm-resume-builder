/**
 * ==========================================================
 * Experience Service
 * ==========================================================
 */


/**
 * Get Experience Records
 */
function getExperience(studentId) {

  const sheet = getSheet(CONFIG.SHEETS.EXPERIENCE);

  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return [];
  }

  const headers = data.shift();

  return data
    .filter(function (row) {
      return row[0] == studentId;
    })
    .map(function (row) {
      return rowToObject(headers, row);
    });

}


/**
 * Save Experience Records
 */
function saveExperience(studentId, experienceList) {

  if (!experienceList || experienceList.length === 0) {

    return {
      success: true,
      message: "No experience records."
    };

  }

  deleteExperience(studentId);

  const sheet = getSheet(CONFIG.SHEETS.EXPERIENCE);

  const headers = getHeaders(sheet);

  const rows = experienceList.map(function (experience) {

    validateExperience(experience);

    experience.Student_ID = studentId;
    experience.Created_On = now();
    experience.Updated_On = now();

    if (!experience.Experience_ID) {
      experience.Experience_ID = Utilities.getUuid();
    }

    return headers.map(function (header) {
      return experience[header] || "";
    });

  });

  sheet
    .getRange(
      sheet.getLastRow() + 1,
      1,
      rows.length,
      rows[0].length
    )
    .setValues(rows);

  return {
    success: true,
    message: "Experience saved successfully."
  };

}


/**
 * Delete All Experience
 */
function deleteExperience(studentId) {

  const sheet = getSheet(CONFIG.SHEETS.EXPERIENCE);

  const data = sheet.getDataRange().getValues();

  for (let i = data.length - 1; i >= 1; i--) {

    if (data[i][0] == studentId) {
      sheet.deleteRow(i + 1);
    }

  }

}


/**
 * Add Experience Record
 */
function addExperienceRecord(record) {

  validateExperience(record);

  const sheet = getSheet(CONFIG.SHEETS.EXPERIENCE);

  if (!record.Experience_ID) {
    record.Experience_ID = Utilities.getUuid();
  }

  record.Created_On = now();
  record.Updated_On = now();

  const headers = getHeaders(sheet);

  const row = headers.map(function (header) {
    return record[header] || "";
  });

  sheet.appendRow(row);

  return {
    success: true,
    message: "Experience added."
  };

}


/**
 * Update Experience Record
 */
function updateExperienceRecord(record) {

  validateExperience(record);

  const sheet = getSheet(CONFIG.SHEETS.EXPERIENCE);

  const data = sheet.getDataRange().getValues();

  const headers = data[0];

  const idIndex = headers.indexOf("Experience_ID");

  for (let i = 1; i < data.length; i++) {

    if (data[i][idIndex] == record.Experience_ID) {

      record.Updated_On = now();

      const row = headers.map(function (header) {

        if (record[header] !== undefined) {
          return record[header];
        }

        return data[i][headers.indexOf(header)];

      });

      sheet
        .getRange(i + 1, 1, 1, row.length)
        .setValues([row]);

      return {
        success: true,
        message: "Experience updated."
      };

    }

  }

  throw new Error("Experience record not found.");

}


/**
 * Delete Experience Record
 */
function deleteExperienceRecord(experienceId) {

  const sheet = getSheet(CONFIG.SHEETS.EXPERIENCE);

  const data = sheet.getDataRange().getValues();

  const headers = data[0];

  const idIndex = headers.indexOf("Experience_ID");

  for (let i = data.length - 1; i >= 1; i--) {

    if (data[i][idIndex] == experienceId) {

      sheet.deleteRow(i + 1);

      return {
        success: true,
        message: "Experience deleted."
      };

    }

  }

  throw new Error("Experience record not found.");

}


/**
 * Validate Experience
 */
function validateExperience(record) {

  if (!record.Student_ID) {
    throw new Error("Student ID is required.");
  }

  if (!record.Experience_Type) {
    throw new Error("Experience Type is required.");
  }

  if (!record.Company_Name) {
    throw new Error("Organization Name is required.");
  }

  if (!record.Designation) {
    throw new Error("Designation is required.");
  }

  if (!record.Start_Date) {
    throw new Error("Start Date is required.");
  }

}


/**
 * Experience Types
 */
function getExperienceTypes() {

  return [

    "Full Time",

    "Part Time",

    "Internship",

    "Summer Internship",

    "Winter Internship",

    "Live Project",

    "Freelance",

    "Apprenticeship",

    "Articleship",

    "Consulting",

    "Volunteer",

    "Research",

    "Teaching Assistant",

    "Campus Ambassador",

    "Entrepreneurship",

    "Certification Project",

    "Other"

  ];

}


/**
 * Employment Types
 */
function getEmploymentModes() {

  return [

    "On-site",

    "Hybrid",

    "Remote"

  ];

}