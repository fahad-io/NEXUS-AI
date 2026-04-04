const XLSX = require('xlsx');
const path = require('path');
const testData = require(path.join(__dirname, 'test-cases-data.js'));

function toSheetRows(testCases) {
  return testCases.map((tc) => ({
    'TestCase ID': tc.testCaseId,
    'Module/Page': tc.module,
    Description: tc.description,
    Preconditions: tc.preconditions,
    Steps: tc.steps.join('\n'),
    'Expected Result': tc.expectedResult,
    'Actual Result': tc.actualResult || '',
  }));
}

function styleWorksheet(ws) {
  ws['!cols'] = [
    { wch: 14 },
    { wch: 24 },
    { wch: 44 },
    { wch: 34 },
    { wch: 72 },
    { wch: 46 },
    { wch: 18 },
  ];

  if (!ws['!ref']) return;
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let r = range.s.r; r <= range.e.r; r += 1) {
    for (let c = range.s.c; c <= range.e.c; c += 1) {
      const address = XLSX.utils.encode_cell({ r, c });
      if (!ws[address]) continue;
      ws[address].s = ws[address].s || {};
      ws[address].s.alignment = { wrapText: true, vertical: 'top' };
    }
  }
}

const frontendSheet = XLSX.utils.json_to_sheet(
  toSheetRows(testData.frontend_test_cases),
);
const backendSheet = XLSX.utils.json_to_sheet(
  toSheetRows(testData.backend_test_cases),
);

styleWorksheet(frontendSheet);
styleWorksheet(backendSheet);

const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, frontendSheet, 'Frontend Test Cases');
XLSX.utils.book_append_sheet(workbook, backendSheet, 'Backend Test Cases');

const date = new Date().toISOString().split('T')[0];
const filename = `NEXUS-AI-QA-TestCases-${date}.xlsx`;
const filepath = path.join(__dirname, filename);

XLSX.writeFile(workbook, filepath);

console.log(`Excel file generated: ${filename}`);
console.log(`Location: ${filepath}`);
console.log(`Frontend test cases: ${testData.frontend_test_cases.length}`);
console.log(`Backend test cases: ${testData.backend_test_cases.length}`);
console.log(
  `Total test cases: ${testData.frontend_test_cases.length + testData.backend_test_cases.length}`,
);
