/**
 * ==========================================================
 * DriveService.gs
 * PIBM Resume Builder v1.0
 * ==========================================================
 */

const DRIVE_CONFIG = {
  ROOT_FOLDER_NAME: "PIBM Resume Builder",
  RESUME_FOLDER: "Generated Resumes"
};

/**
 * Creates (if required) and returns the application root folder.
 */
function getResumeRootFolder() {
  const folders = DriveApp.getFoldersByName(DRIVE_CONFIG.ROOT_FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(DRIVE_CONFIG.ROOT_FOLDER_NAME);
}

/**
 * Creates (if required) and returns the Generated Resumes folder.
 */
function getGeneratedResumeFolder() {
  const root = getResumeRootFolder();
  const folders = root.getFoldersByName(DRIVE_CONFIG.RESUME_FOLDER);
  if (folders.hasNext()) return folders.next();
  return root.createFolder(DRIVE_CONFIG.RESUME_FOLDER);
}

/**
 * Creates/returns a student folder.
 */
function getStudentResumeFolder(studentId, studentName) {
  const parent = getGeneratedResumeFolder();
  const folderName = studentId + " - " + studentName;

  const folders = parent.getFoldersByName(folderName);
  if (folders.hasNext()) return folders.next();

  return parent.createFolder(folderName);
}

/**
 * Saves PDF blob into Drive.
 */
function saveResumeToDrive(templateName) {

  const data = getResumeData();

  const result = generateResume(templateName);

  const pdfBlob = UrlFetchApp.fetch(result.url)
      .getBlob()
      .setName(templateName + ".pdf");

  const studentId =
    (data.personal && (data.personal.Student_ID || data.personal.StudentId))
      || "UNKNOWN";

  const studentName =
    ((data.personal?.First_Name || "") + " " +
     (data.personal?.Last_Name || "")).trim() || "Student";

  const folder = getStudentResumeFolder(studentId, studentName);

  const file = folder.createFile(pdfBlob);

  return {
    success: true,
    fileId: file.getId(),
    fileName: file.getName(),
    folderId: folder.getId(),
    url: file.getUrl()
  };
}

/**
 * Returns all resume PDFs for a student folder.
 */
function listStudentResumes(studentId, studentName) {

  const folder = getStudentResumeFolder(studentId, studentName);

  const files = folder.getFiles();

  const output = [];

  while (files.hasNext()) {
    const f = files.next();

    output.push({
      id: f.getId(),
      name: f.getName(),
      url: f.getUrl(),
      created: f.getDateCreated(),
      updated: f.getLastUpdated()
    });
  }

  return output;
}
