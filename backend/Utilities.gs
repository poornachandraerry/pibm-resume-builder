/**
 * ==========================================================
 * PIBM Resume Builder
 * Utilities.gs
 * ==========================================================
 */

/**
 * Returns Sheet Object
 */
function getSheet(sheetName) {

  const sheet = CONFIG.SPREADSHEET.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error("Sheet not found : " + sheetName);
  }

  return sheet;

}


/**
 * Returns Header Row
 */
function getHeaders(sheet) {

  return sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0];

}


/**
 * Convert Row → Object
 */
function rowToObject(headers, row) {

  let obj = {};

  headers.forEach(function(header, index) {

    obj[header] = row[index];

  });

  return obj;

}


/**
 * Find Row using Column Name
 */
function findRow(sheet, columnName, value) {

  const headers = getHeaders(sheet);

  const columnIndex = headers.indexOf(columnName);

  if (columnIndex === -1)
    return -1;

  const values = sheet
    .getRange(2, columnIndex + 1, sheet.getLastRow() - 1)
    .getValues();

  for (let i = 0; i < values.length; i++) {

    if (String(values[i][0]).trim() === String(value).trim()) {

      return i + 2;

    }

  }

  return -1;

}


/**
 * Read Entire Sheet
 */
function getAllObjects(sheetName) {

  const sheet = getSheet(sheetName);

  const values = sheet.getDataRange().getValues();

  const headers = values.shift();

  return values.map(row => rowToObject(headers, row));

}


/**
 * Timestamp
 */
function now() {

  return Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    CONFIG.DATETIME_FORMAT
  );

}