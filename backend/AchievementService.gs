/**
 * ==========================================================
 * PIBM Resume Builder v1.0
 * AchievementService.gs
 * Production Ready
 * ==========================================================
 */

function getAchievements(studentId){
  if(!studentId) throw new Error("Student ID is required.");

  const sheet=getSheet(CONFIG.SHEETS.ACHIEVEMENTS);
  const data=sheet.getDataRange().getValues();
  if(data.length<=1) return [];

  const headers=data.shift();

  return data.filter(r=>String(r[0]).trim()===String(studentId).trim())
             .map(r=>rowToObject(headers,r));
}

function saveAchievements(studentId,achievementList){

  if(!studentId) throw new Error("Student ID is required.");

  if(!Array.isArray(achievementList)||achievementList.length===0){
    return {success:true,message:"No achievement records."};
  }

  deleteAchievements(studentId);

  const sheet=getSheet(CONFIG.SHEETS.ACHIEVEMENTS);
  const headers=getHeaders(sheet);

  const rows=achievementList.map(function(a){

    a.Student_ID=studentId;

    sanitizeAchievement_(a);
    validateAchievement(a);

    a.Achievement_ID=a.Achievement_ID||Utilities.getUuid();
    a.Created_On=a.Created_On||now();
    a.Updated_On=now();

    return headers.map(h=>a[h]!==undefined?a[h]:"");

  });

  sheet.getRange(sheet.getLastRow()+1,1,rows.length,rows[0].length).setValues(rows);

  return {success:true,message:"Achievements saved successfully."};

}

function deleteAchievements(studentId){

  const sheet=getSheet(CONFIG.SHEETS.ACHIEVEMENTS);
  const data=sheet.getDataRange().getValues();

  for(let i=data.length-1;i>=1;i--){
    if(String(data[i][0])===String(studentId)){
      sheet.deleteRow(i+1);
    }
  }
}

function addAchievement(a){

  sanitizeAchievement_(a);
  validateAchievement(a);

  const sheet=getSheet(CONFIG.SHEETS.ACHIEVEMENTS);
  const headers=getHeaders(sheet);

  a.Achievement_ID=a.Achievement_ID||Utilities.getUuid();
  a.Created_On=now();
  a.Updated_On=now();

  sheet.appendRow(headers.map(h=>a[h]!==undefined?a[h]:""));

  return {success:true,message:"Achievement added successfully."};

}

function updateAchievement(a){

  sanitizeAchievement_(a);
  validateAchievement(a);

  const sheet=getSheet(CONFIG.SHEETS.ACHIEVEMENTS);
  const data=sheet.getDataRange().getValues();

  const headers=data[0];
  const idIndex=headers.indexOf("Achievement_ID");
  if(idIndex===-1) throw new Error("Achievement_ID column not found.");

  for(let i=1;i<data.length;i++){

    if(String(data[i][idIndex])===String(a.Achievement_ID)){

      a.Updated_On=now();

      const row=headers.map(h=>a[h]!==undefined?a[h]:data[i][headers.indexOf(h)]);

      sheet.getRange(i+1,1,1,row.length).setValues([row]);

      return {success:true,message:"Achievement updated successfully."};
    }
  }

  throw new Error("Achievement record not found.");
}

function deleteAchievement(id){

  const sheet=getSheet(CONFIG.SHEETS.ACHIEVEMENTS);
  const data=sheet.getDataRange().getValues();

  const headers=data[0];
  const idx=headers.indexOf("Achievement_ID");

  for(let i=data.length-1;i>=1;i--){

    if(String(data[i][idx])===String(id)){
      sheet.deleteRow(i+1);
      return {success:true,message:"Achievement deleted successfully."};
    }
  }

  throw new Error("Achievement record not found.");
}

function validateAchievement(a){

  if(!a.Student_ID) throw new Error("Student ID is required.");
  if(!a.Achievement_Title) throw new Error("Achievement Title is required.");
  if(!a.Category) throw new Error("Category is required.");

  if(a.Date){
    const d=new Date(a.Date);
    if(isNaN(d.getTime())){
      throw new Error("Invalid achievement date.");
    }
  }
}

function getAchievementCategories(){
  return [
    "Certification","Award","Achievement","Competition","Hackathon",
    "Publication","Research Paper","Patent","Conference","Seminar",
    "Workshop","Faculty Development Program","MOOC","NPTEL","Coursera",
    "Udemy","edX","Oracle Academy","SAP","Microsoft","Google","IBM",
    "AWS","Salesforce","Volunteer","Leadership","Sports","Cultural",
    "Social Service","Position of Responsibility","Other"
  ];
}

function getResumeAchievements(studentId){
  return getAchievements(studentId).sort((a,b)=>
    new Date(b.Date||"1900-01-01")-new Date(a.Date||"1900-01-01"));
}

function getResumeCertifications(studentId){
  return getAchievements(studentId)
    .filter(x=>x.Category==="Certification")
    .sort((a,b)=>new Date(b.Date||"1900-01-01")-new Date(a.Date||"1900-01-01"));
}

function getResumePublications(studentId){
  return getAchievements(studentId).filter(x=>
    x.Category==="Publication"||x.Category==="Research Paper");
}

function getResumeLeadership(studentId){
  return getAchievements(studentId).filter(x=>
    x.Category==="Leadership"||x.Category==="Position of Responsibility");
}

function sanitizeAchievement_(a){

  [
    "Achievement_Title",
    "Category",
    "Description",
    "Organization",
    "Award_Name",
    "Certificate_Number",
    "Credential_URL"
  ].forEach(function(f){
    if(typeof a[f]==="string"){
      a[f]=a[f].trim();
    }
  });

}
