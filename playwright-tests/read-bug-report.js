const xlsx = require('xlsx');

// Read the Bug Report Excel file
const workbook = xlsx.readFile('../Bug_Report.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: '' });

console.log('Bug Report found:', jsonData.length, 'bugs');
console.log('Columns:', Object.keys(jsonData[0] || {}));

// Display existing bugs if any
if (jsonData.length > 0) {
  jsonData.slice(0, 2).forEach((bug, i) => {
    console.log(`\n--- Bug ${i + 1} ---`);
    console.log(JSON.stringify(bug, null, 2));
  });
} else {
  console.log('No existing bugs in the report.');
}
