const XLSX = require('xlsx');
const path = require('path');
const { marketplaceFrontendTestCases } = require(path.join(
  __dirname,
  'marketplace-frontend-testcases.js',
));

const rows = marketplaceFrontendTestCases.map((tc) => ({
  'TestCase ID': tc.testCaseId,
  Module: tc.module,
  'Page/Component': tc.pageComponent,
  Description: tc.description,
  Preconditions: tc.preconditions,
  Steps: tc.steps.join('\n'),
  'Expected Result': tc.expectedResult,
  'Actual Result': tc.actualResult || '',
}));

const ws = XLSX.utils.json_to_sheet(rows);
ws['!cols'] = [
  { wch: 14 },
  { wch: 14 },
  { wch: 28 },
  { wch: 46 },
  { wch: 30 },
  { wch: 72 },
  { wch: 46 },
  { wch: 18 },
];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Marketplace FE Test Cases');

const filename = 'Marketplace-Frontend-TestCases-2026-04-04.xlsx';
const filepath = path.join(__dirname, filename);
XLSX.writeFile(wb, filepath);

console.log(`Excel file generated: ${filename}`);
console.log(`Location: ${filepath}`);
console.log(`Marketplace frontend test cases: ${marketplaceFrontendTestCases.length}`);
