/**
 * ============================================================
 * PIBM Resume Builder v1.0
 * CrudUtils.gs
 * ------------------------------------------------------------
 * Generic CRUD Utility
 * ============================================================
 */


/**
 * ============================================================
 * Insert Record
 * ============================================================
 */
function insertRecord(sheetName, object) {

  const sheet = getSheet(sheetName);

  const headers = getHeaders(sheet);

  const row = objectToRow(headers, object);

  sheet.appendRow(row);

  return object;

}


/**
 * ============================================================
 * Update Record
 * ============================================================
 */
function updateRecord(sheetName, keyColumn, keyValue, object) {

  const sheet = getSheet(sheetName);

  const rowNumber = findRow(
    sheet,
    keyColumn,
    keyValue
  );

  if (rowNumber === -1) {

    throw new Error(
      "Record not found."
    );

  }

  const headers = getHeaders(sheet);

  const row = objectToRow(
    headers,
    object
  );

  sheet
    .getRange(
      rowNumber,
      1,
      1,
      row.length
    )
    .setValues([row]);

  return object;

}


/**
 * ============================================================
 * Delete Record
 * ============================================================
 */
function deleteRecord(
  sheetName,
  keyColumn,
  keyValue
) {

  const sheet = getSheet(sheetName);

  const rowNumber = findRow(
    sheet,
    keyColumn,
    keyValue
  );

  if (rowNumber === -1) {

    return false;

  }

  sheet.deleteRow(rowNumber);

  return true;

}


/**
 * ============================================================
 * Get Record
 * ============================================================
 */
function getRecord(
  sheetName,
  keyColumn,
  keyValue
) {

  const sheet = getSheet(sheetName);

  return findRecord(
    sheet,
    keyColumn,
    keyValue
  );

}


/**
 * ============================================================
 * Get All Records
 * ============================================================
 */
function getRecords(sheetName) {

  return getAllRecords(
    getSheet(sheetName)
  );

}