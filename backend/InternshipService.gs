/**
 * ==========================================================
 * Internship Service
 * ==========================================================
 */


/**
 * Get Internship Records
 */
function getInternships(studentId) {

  const sheet = getSheet(CONFIG.SHEETS.INTERNSHIPS);

  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return [];
  }

  const headers = data.shift();

  return data
    .filter(function(row) {
      return row[0] == studentId;
    })
    .map(function(row) {
      return rowToObject(headers, row);
    });

}


/**
 * Save Internship Records
 */
function saveInternships(studentId, internshipList) {

  if (!internshipList || internshipList.length === 0) {

    return {
      success: true,
      message: "No internship records."
    };

  }

  deleteInternships(studentId);

  const sheet = getSheet(CONFIG.SHEETS.INTERNSHIPS);

  const headers = getHeaders(sheet);

  const rows = internshipList.map(function(internship) {

    validateInternship(internship);

    internship.Student_ID = studentId;
    internship.Internship_ID =
      internship.Internship_ID || generateId();

    internship.Created_On = now();
    internship.Updated_On = now();

    return headers.map(function(header) {
      return internship[header] || "";
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

  return success(
    "Internships saved successfully."
  );

}


/**
 * Delete All Internships
 */
function deleteInternships(studentId) {

  const sheet = getSheet(CONFIG.SHEETS.INTERNSHIPS);

  const data = sheet.getDataRange().getValues();

  for (let i = data.length - 1; i >= 1; i--) {

    if (data[i][0] == studentId) {

      sheet.deleteRow(i + 1);

    }

  }

}


/**
 * Add Internship
 */
function addInternship(record) {

  validateInternship(record);

  const sheet = getSheet(CONFIG.SHEETS.INTERNSHIPS);

  const headers = getHeaders(sheet);

  record.Internship_ID =
    record.Internship_ID || generateId();

  record.Created_On = now();
  record.Updated_On = now();

  const row = headers.map(function(header) {

    return record[header] || "";

  });

  sheet.appendRow(row);

  return success(
    "Internship added successfully."
  );

}


/**
 * Update Internship
 */
function updateInternship(record) {

  validateInternship(record);

  const sheet = getSheet(CONFIG.SHEETS.INTERNSHIPS);

  const data = sheet.getDataRange().getValues();

  const headers = data[0];

  const idIndex = headers.indexOf("Internship_ID");

  for (let i = 1; i < data.length; i++) {

    if (data[i][idIndex] == record.Internship_ID) {

      record.Updated_On = now();

      const row = headers.map(function(header) {

        if (record[header] !== undefined) {
          return record[header];
        }

        return data[i][headers.indexOf(header)];

      });

      sheet
        .getRange(i + 1, 1, 1, row.length)
        .setValues([row]);

      return success(
        "Internship updated successfully."
      );

    }

  }

  throw new Error(
    "Internship record not found."
  );

}


/**
 * Delete Internship
 */
function deleteInternship(internshipId) {

  const sheet = getSheet(CONFIG.SHEETS.INTERNSHIPS);

  const data = sheet.getDataRange().getValues();

  const headers = data[0];

  const idIndex = headers.indexOf("Internship_ID");

  for (let i = data.length - 1; i >= 1; i--) {

    if (data[i][idIndex] == internshipId) {

      sheet.deleteRow(i + 1);

      return success(
        "Internship deleted successfully."
      );

    }

  }

  throw new Error(
    "Internship record not found."
  );

}


/**
 * Validate Internship
 */
function validateInternship(record) {

  if (!record.Student_ID) {

    throw new Error(
      "Student ID is required."
    );

  }

  if (!record.Company_Name) {

    throw new Error(
      "Organization Name is required."
    );

  }

  if (!record.Designation) {

    throw new Error(
      "Designation is required."
    );

  }

  if (!record.Start_Date) {

    throw new Error(
      "Start Date is required."
    );

  }

}


/**
 * Internship Types
 */
function getInternshipTypes() {

  return [

    "Summer Internship",

    "Winter Internship",

    "Virtual Internship",

    "Industry Internship",

    "Research Internship",

    "Corporate Internship",

    "NGO Internship",

    "Government Internship",

    "Startup Internship",

    "International Internship",

    "Other"

  ];

}


/**
 * Resume Internship Data
 */
function getResumeInternships(studentId) {

  return getInternships(studentId)
    .sort(function(a, b) {

      const d1 = new Date(
        a.End_Date || a.Start_Date || 0
      );

      const d2 = new Date(
        b.End_Date || b.Start_Date || 0
      );

      return d2 - d1;

    });

}