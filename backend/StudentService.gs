/**
 * ==========================================================
 * Student Service
 * ==========================================================
 */


/**
 * Get Student Profile
 */
function getStudentProfile(studentId) {

  const sheet = getSheet(CONFIG.SHEETS.STUDENT_MASTER);

  const rowNumber = findRow(sheet, "Student_ID", studentId);

  if (rowNumber === -1) {
    return null;
  }

  const headers = getHeaders(sheet);

  const row = sheet
    .getRange(rowNumber, 1, 1, headers.length)
    .getValues()[0];

  const student = rowToObject(headers, row);

  student.ProfileCompletion = getProfileCompletion(student);

  return student;

}


/**
 * Save Student Profile
 */
function saveStudentProfile(student) {

  validateStudent(student);

  const sheet = getSheet(CONFIG.SHEETS.STUDENT_MASTER);

  const exists = findRow(
    sheet,
    "Student_ID",
    student.Student_ID
  );

  if (exists !== -1) {
    throw new Error("Student already exists.");
  }

  student.Created_On = now();
  student.Updated_On = now();
  student.Profile_Status = CONFIG.PROFILE_STATUS.DRAFT;

  const headers = getHeaders(sheet);

  const row = headers.map(function (header) {
    return student[header] || "";
  });

  sheet.appendRow(row);

  return {
    success: true,
    message: "Student profile created successfully."
  };

}


/**
 * Update Student Profile
 */
function updateStudentProfile(student) {

  validateStudent(student);

  const sheet = getSheet(CONFIG.SHEETS.STUDENT_MASTER);

  const rowNumber = findRow(
    sheet,
    "Student_ID",
    student.Student_ID
  );

  if (rowNumber === -1) {
    throw new Error("Student not found.");
  }

  const existing = getStudentProfile(student.Student_ID);

  student.Created_On = existing.Created_On;
  student.Updated_On = now();

  if (!student.Profile_Status) {
    student.Profile_Status = existing.Profile_Status;
  }

  const headers = getHeaders(sheet);

  const row = headers.map(function (header) {

    if (student[header] !== undefined) {
      return student[header];
    }

    return existing[header] || "";

  });

  sheet
    .getRange(rowNumber, 1, 1, row.length)
    .setValues([row]);

  return {
    success: true,
    message: "Student profile updated."
  };

}


/**
 * Delete Student
 */
function deleteStudent(studentId) {

  const sheet = getSheet(CONFIG.SHEETS.STUDENT_MASTER);

  const rowNumber = findRow(
    sheet,
    "Student_ID",
    studentId
  );

  if (rowNumber === -1) {
    throw new Error("Student not found.");
  }

  sheet.deleteRow(rowNumber);

  return {
    success: true,
    message: "Student deleted successfully."
  };

}


/**
 * Get All Students
 */
function getAllStudents() {

  const sheet = getSheet(CONFIG.SHEETS.STUDENT_MASTER);

  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return [];
  }

  const headers = data.shift();

  return data.map(function (row) {

    const student = rowToObject(headers, row);

    student.ProfileCompletion = getProfileCompletion(student);

    return student;

  });

}


/**
 * Submit Profile
 */
function submitStudentProfile(studentId) {

  const student = getStudentProfile(studentId);

  if (!student) {
    throw new Error("Student not found.");
  }

  student.Profile_Status = CONFIG.PROFILE_STATUS.SUBMITTED;

  return updateStudentProfile(student);

}


/**
 * Approve Profile
 */
function approveStudentProfile(studentId) {

  const student = getStudentProfile(studentId);

  if (!student) {
    throw new Error("Student not found.");
  }

  student.Profile_Status = CONFIG.PROFILE_STATUS.APPROVED;

  return updateStudentProfile(student);

}


/**
 * Reject Profile
 */
function rejectStudentProfile(studentId, remarks) {

  const student = getStudentProfile(studentId);

  if (!student) {
    throw new Error("Student not found.");
  }

  student.Profile_Status = CONFIG.PROFILE_STATUS.REJECTED;

  student.Reviewer_Remarks = remarks || "";

  return updateStudentProfile(student);

}


/**
 * Validate Student
 */
function validateStudent(student) {

  if (!student.Student_ID) {
    throw new Error("Student ID is required.");
  }

  if (!student.Full_Name) {
    throw new Error("Student Name is required.");
  }

  if (!student.Email) {
    throw new Error("Email is required.");
  }

  if (!student.Mobile) {
    throw new Error("Mobile Number is required.");
  }

}


/**
 * Profile Completion
 */
function getProfileCompletion(student) {

  let total = 0;
  let completed = 0;

  Object.keys(student).forEach(function (key) {

    if (
      key === "Created_On" ||
      key === "Updated_On" ||
      key === "Profile_Status"
    ) {
      return;
    }

    total++;

    if (
      student[key] !== "" &&
      student[key] !== null &&
      student[key] !== undefined
    ) {
      completed++;
    }

  });

  if (total === 0) {
    return 0;
  }

  return Math.round((completed / total) * 100);

}


/**
 * Dropdown Data
 */
function getStudentDropdownData() {

  return {

    genders: [
      "Male",
      "Female",
      "Other"
    ],

    maritalStatus: [
      "Single",
      "Married"
    ],

    profileStatus: Object.keys(CONFIG.PROFILE_STATUS).map(function (key) {
      return CONFIG.PROFILE_STATUS[key];
    })

  };

}