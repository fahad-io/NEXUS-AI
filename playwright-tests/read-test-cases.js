const xlsx = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = xlsx.readFile('../Sign_In_Get_Started_TestCases_Executed.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: '' });

console.log('Test Cases found:', jsonData.length);
console.log('Columns:', Object.keys(jsonData[0] || {}));

// Save to JSON for easier processing
fs.writeFileSync('test-cases.json', JSON.stringify(jsonData, null, 2));

// Display a few test cases
jsonData.slice(0, 3).forEach((tc, i) => {
  console.log(`\n--- Test Case ${i + 1} ---`);
  console.log(JSON.stringify(tc, null, 2));
});
