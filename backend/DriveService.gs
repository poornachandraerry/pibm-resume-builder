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
 * Generates (via ResumeService.generateResume, which already saves
 * into the student's Drive folder) and returns the file info.
 * Kept as a separate entry point so the UI has an explicit
 * "Save to Drive" action distinct from "Generate PDF".
 */
function saveResumeToDrive(studentId, templateName) {

  if (!studentId) {
    throw new Error("Student ID is required.");
  }

  return generateResume(studentId, templateName);
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
