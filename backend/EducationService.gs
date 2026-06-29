/**
 * ==========================================================
 * Education Service
 * ==========================================================
 */


/**
 * Get Education Records
 */
function getEducation(studentId) {

  const sheet = getSheet(CONFIG.SHEETS.EDUCATION);

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
 * Save Education Records
 */
function saveEducation(studentId, educationList) {

  if (!educationList || educationList.length === 0) {

    return {
      success: true,
      message: "No education records."
    };

  }

  deleteEducation(studentId);

  const sheet = getSheet(CONFIG.SHEETS.EDUCATION);

  const headers = getHeaders(sheet);

  const rows = educationList.map(function (education) {

    education.Student_ID = studentId;
    education.Created_On = now();
    education.Updated_On = now();

    return headers.map(function (header) {
      return education[header] || "";
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
    message: "Education saved successfully."

  };

}


/**
 * Delete Education
 */
function deleteEducation(studentId) {

  const sheet = getSheet(CONFIG.SHEETS.EDUCATION);

  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return;
  }

  for (let i = data.length - 1; i >= 1; i--) {

    if (data[i][0] == studentId) {

      sheet.deleteRow(i + 1);

    }

  }

}


/**
 * Add Single Education Record
 */
function addEducationRecord(record) {

  validateEducation(record);

  const sheet = getSheet(CONFIG.SHEETS.EDUCATION);

  record.Created_On = now();
  record.Updated_On = now();

  const headers = getHeaders(sheet);

  const row = headers.map(function (header) {
    return record[header] || "";
  });

  sheet.appendRow(row);

  return {

    success: true,
    message: "Education record added."

  };

}


/**
 * Update Education Record
 */
function updateEducationRecord(record) {

  validateEducation(record);

  const sheet = getSheet(CONFIG.SHEETS.EDUCATION);

  const data = sheet.getDataRange().getValues();

  const headers = data[0];

  const idIndex = headers.indexOf("Education_ID");

  if (idIndex === -1) {
    throw new Error("Education_ID column missing.");
  }

  for (let i = 1; i < data.length; i++) {

    if (data[i][idIndex] == record.Education_ID) {

      record.Updated_On = now();

      const row = headers.map(function (header) {

        if (record[header] !== undefined) {
          return record[header];
        }

        return data[i][headers.indexOf(header)];

      });

      sheet
        .getRange(
          i + 1,
          1,
          1,
          row.length
        )
        .setValues([row]);

      return {

        success: true,
        message: "Education updated."

      };

    }

  }

  throw new Error("Education record not found.");

}


/**
 * Delete Education Record
 */
function deleteEducationRecord(educationId) {

  const sheet = getSheet(CONFIG.SHEETS.EDUCATION);

  const data = sheet.getDataRange().getValues();

  const headers = data[0];

  const idIndex = headers.indexOf("Education_ID");

  for (let i = data.length - 1; i >= 1; i--) {

    if (data[i][idIndex] == educationId) {

      sheet.deleteRow(i + 1);

      return {

        success: true,
        message: "Education deleted."

      };

    }

  }

  throw new Error("Education record not found.");

}


/**
 * Validate Education
 */
function validateEducation(record) {

  if (!record.Student_ID) {
    throw new Error("Student ID required.");
  }

  if (!record.Qualification) {
    throw new Error("Qualification required.");
  }

  if (!record.Institute_Name) {
    throw new Error("Institute Name required.");
  }

  if (!record.Board_University) {
    throw new Error("Board / University required.");
  }

  if (!record.Year_Of_Passing) {
    throw new Error("Year of Passing required.");
  }

  if (
    record.Percentage === "" ||
    record.Percentage === null ||
    record.Percentage === undefined
  ) {
    throw new Error("Percentage / CGPA required.");
  }

}


/**
 * Qualification Dropdown
 */
function getQualificationDropdown() {

  return [

    "SSC",

    "HSC",

    "Diploma",

    "Graduation",

    "Post Graduation",

    "PhD",

    "Professional Certification",

    "Other"

  ];

}