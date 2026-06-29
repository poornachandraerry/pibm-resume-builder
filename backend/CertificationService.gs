/**
 * ==========================================================
 * PIBM Resume Builder v1.0
 * CertificationService.gs
 * Production Ready
 * ==========================================================
 */

/**
 * Get Certifications
 */
function getCertifications(studentId) {

  if (!studentId) throw new Error("Student ID is required.");

  const sheet = getSheet(CONFIG.SHEETS.CERTIFICATIONS);
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) return [];

  const headers = data.shift();

  return data
    .filter(function(row){
      return String(row[0]).trim() === String(studentId).trim();
    })
    .map(function(row){
      return rowToObject(headers,row);
    });
}

/**
 * Save Certifications
 */
function saveCertifications(studentId, certificationList) {

  if (!studentId) throw new Error("Student ID is required.");

  if (!Array.isArray(certificationList) || certificationList.length === 0) {
    return success("No certifications found.");
  }

  deleteCertifications(studentId);

  const sheet = getSheet(CONFIG.SHEETS.CERTIFICATIONS);
  const headers = getHeaders(sheet);

  const rows = certificationList.map(function(record){

    record.Student_ID = studentId;

    sanitizeCertification_(record);
    validateCertification(record);

    record.Certification_ID = record.Certification_ID || Utilities.getUuid();
    record.Created_On = record.Created_On || now();
    record.Updated_On = now();

    return headers.map(function(header){
      return record[header] !== undefined ? record[header] : "";
    });

  });

  sheet.getRange(sheet.getLastRow()+1,1,rows.length,rows[0].length).setValues(rows);

  return success("Certifications saved successfully.");

}

/**
 * Delete All Certifications
 */
function deleteCertifications(studentId){

  const sheet = getSheet(CONFIG.SHEETS.CERTIFICATIONS);
  const data = sheet.getDataRange().getValues();

  for(let i=data.length-1;i>=1;i--){
    if(String(data[i][0])===String(studentId)){
      sheet.deleteRow(i+1);
    }
  }

}

/**
 * Add Certification
 */
function addCertification(record){

  sanitizeCertification_(record);
  validateCertification(record);

  const sheet = getSheet(CONFIG.SHEETS.CERTIFICATIONS);
  const headers = getHeaders(sheet);

  record.Certification_ID = record.Certification_ID || Utilities.getUuid();
  record.Created_On = now();
  record.Updated_On = now();

  sheet.appendRow(headers.map(function(h){
    return record[h] !== undefined ? record[h] : "";
  }));

  return success("Certification added successfully.");

}

/**
 * Update Certification
 */
function updateCertification(record){

  sanitizeCertification_(record);
  validateCertification(record);

  const sheet = getSheet(CONFIG.SHEETS.CERTIFICATIONS);
  const data = sheet.getDataRange().getValues();

  const headers = data[0];
  const idIndex = headers.indexOf("Certification_ID");

  if(idIndex===-1){
    throw new Error("Certification_ID column not found.");
  }

  for(let i=1;i<data.length;i++){

    if(String(data[i][idIndex])===String(record.Certification_ID)){

      record.Updated_On = now();

      const row=headers.map(function(h){
        return record[h]!==undefined ? record[h] : data[i][headers.indexOf(h)];
      });

      sheet.getRange(i+1,1,1,row.length).setValues([row]);

      return success("Certification updated successfully.");
    }
  }

  throw new Error("Certification not found.");

}

/**
 * Delete Certification
 */
function deleteCertification(certificationId){

  const sheet=getSheet(CONFIG.SHEETS.CERTIFICATIONS);
  const data=sheet.getDataRange().getValues();

  const headers=data[0];
  const idIndex=headers.indexOf("Certification_ID");

  for(let i=data.length-1;i>=1;i--){

    if(String(data[i][idIndex])===String(certificationId)){

      sheet.deleteRow(i+1);

      return success("Certification deleted successfully.");
    }
  }

  throw new Error("Certification not found.");

}

/**
 * Validate Certification
 */
function validateCertification(record){

  if(!record.Student_ID)
    throw new Error("Student ID is required.");

  if(!record.Certification_Name)
    throw new Error("Certification Name is required.");

  if(!record.Issuing_Organization)
    throw new Error("Issuing Organization is required.");

  if(record.Expiry_Date && record.Issue_Date){
    const issue=new Date(record.Issue_Date);
    const expiry=new Date(record.Expiry_Date);
    if(expiry<issue){
      throw new Error("Expiry Date cannot be earlier than Issue Date.");
    }
  }

}

/**
 * Resume Certifications
 */
function getResumeCertifications(studentId){

  return getCertifications(studentId).sort(function(a,b){
    const d1=new Date(a.Issue_Date||"1900-01-01");
    const d2=new Date(b.Issue_Date||"1900-01-01");
    return d2-d1;
  });

}

/**
 * Internal Helper
 */
function sanitizeCertification_(record){

  [
    "Certification_Name",
    "Issuing_Organization",
    "Credential_ID",
    "Credential_URL",
    "Skills_Covered"
  ].forEach(function(field){
    if(typeof record[field]==="string"){
      record[field]=record[field].trim();
    }
  });

}
