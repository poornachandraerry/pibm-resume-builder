/**
 * ==========================================================
 * DriveService.gs V2
 * PIBM Resume Builder v1.0
 * ==========================================================
 */

const DRIVE_CONFIG = {
  ROOT_FOLDER_NAME: "PIBM Resume Builder",
  GENERATED_FOLDER_NAME: "Generated Resumes"
};

function getResumeRootFolder() {
  return getOrCreateFolder_(DriveApp.getRootFolder(), DRIVE_CONFIG.ROOT_FOLDER_NAME);
}

function getGeneratedResumeFolder() {
  return getOrCreateFolder_(getResumeRootFolder(), DRIVE_CONFIG.GENERATED_FOLDER_NAME);
}

function getStudentResumeFolder(studentId, studentName) {
  const name = (studentId || "UNKNOWN") + " - " + (studentName || "Student");
  return getOrCreateFolder_(getGeneratedResumeFolder(), name);
}

function saveResumeToDrive(templateName) {
  try {
    const result = generateResume(templateName);
    const file = DriveApp.getFileById(result.fileId);

    const data = getResumeData();
    const p = data.personal || {};

    const folder = getStudentResumeFolder(
      p.Student_ID || p.StudentId,
      ((p.First_Name || "") + " " + (p.Last_Name || "")).trim()
    );

    const copied = file.makeCopy(buildVersionedName_(file.getName()), folder);

    try {
      file.setTrashed(true);
    } catch (e) {
      // Ignore if cleanup fails.
    }

    return {
      success: true,
      fileId: copied.getId(),
      fileName: copied.getName(),
      folderId: folder.getId(),
      url: copied.getUrl()
    };

  } catch (err) {
    console.error(err);
    throw new Error("Unable to save resume to Drive: " + err.message);
  }
}

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
      updated: f.getLastUpdated(),
      size: f.getSize()
    });
  }

  output.sort(function(a, b) {
    return new Date(b.updated) - new Date(a.updated);
  });

  return output;
}

function getLatestResume(studentId, studentName) {
  const files = listStudentResumes(studentId, studentName);
  return files.length ? files[0] : null;
}

function getOrCreateFolder_(parent, name) {
  const folders = parent.getFoldersByName(name);
  return folders.hasNext() ? folders.next() : parent.createFolder(name);
}

function buildVersionedName_(baseName) {
  const stamp = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    "yyyyMMdd_HHmmss"
  );

  return baseName.replace(/\.pdf$/i, "") + "_" + stamp + ".pdf";
}
