/**
 * ============================================================
 * PIBM Resume Builder v1.0
 * SheetUtils.gs
 * ------------------------------------------------------------
 * Google Sheet Utility Functions
 * ============================================================
 */


/**
 * ============================================================
 * Get Sheet
 * ============================================================
 */
function getSheet(sheetName) {

  const sheet = CONFIG.SPREADSHEET.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error("Sheet not found: " + sheetName);
  }

  return sheet;

}


/**
 * ============================================================
 * Get Headers
 * ============================================================
 */
function getHeaders(sheet) {

  return sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0];

}


/**
 * ============================================================
 * Convert Row to Object
 * ============================================================
 */
function rowToObject(headers, row) {

  const obj = {};

  headers.forEach(function(header, index) {
    obj[header] = row[index];
  });

  return obj;

}


/**
 * ============================================================
 * Convert Object to Row
 * ============================================================
 */
function objectToRow(headers, object) {

  return headers.map(function(header) {
    return object[header] !== undefined
      ? object[header]
      : "";
  });

}


/**
 * ============================================================
 * Find Row Number
 * ============================================================
 */
function findRow(sheet, columnName, value) {

  const headers = getHeaders(sheet);

  const columnIndex = headers.indexOf(columnName);

  if (columnIndex === -1) {
    return -1;
  }

  const values = sheet
    .getRange(
      2,
      columnIndex + 1,
      Math.max(sheet.getLastRow() - 1, 0),
      1
    )
    .getValues();

  for (let i = 0; i < values.length; i++) {

    if (String(values[i][0]).trim() === String(value).trim()) {
      return i + 2;
    }

  }

  return -1;

}


/**
 * ============================================================
 * Find Record
 * ============================================================
 */
function findRecord(sheet, columnName, value) {

  const rowNumber = findRow(sheet, columnName, value);

  if (rowNumber === -1) {
    return null;
  }

  const headers = getHeaders(sheet);

  const row = sheet
    .getRange(
      rowNumber,
      1,
      1,
      headers.length
    )
    .getValues()[0];

  return rowToObject(headers, row);

}


/**
 * ============================================================
 * Get All Records
 * ============================================================
 */
function getAllRecords(sheet) {

  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return [];
  }

  const headers = data.shift();

  return data.map(function(row) {
    return rowToObject(headers, row);
  });

}