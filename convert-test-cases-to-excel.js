const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Function to parse markdown test case file and extract test cases
function parseMarkdownToTestCases(content) {
  const testCases = [];
  const lines = content.split('\n');

  let currentTestCase = null;
  let inTable = false;
  let tableHeaders = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect test case header
    const headerMatch = line.match(/^### (TC-[A-Z]+-[A-Z]+-\d+): (.+)$/);
    if (headerMatch) {
      currentTestCase = {
        testCaseId: headerMatch[1],
        title: headerMatch[2],
        moduleName: '',
        type: '',
        pageComponentApi: '',
        description: '',
        preconditions: '',
        steps: '',
        expectedResult: '',
        actualResult: ''
      };
      inTable = false;
      continue;
    }

    // Detect table start
    if (line.includes('| Field | Value |')) {
      inTable = true;
      tableHeaders = [];
      continue;
    }

    // Parse table separator
    if (inTable && line.includes('|-------|')) {
      continue;
    }

    // Parse table rows
    if (inTable && line.startsWith('|')) {
      const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);

      if (cells.length >= 2) {
        const fieldName = cells[0].replace(/\*\*/g, '');
        const fieldValue = cells[1] || '';

        if (fieldName === 'TestCase ID') {
          currentTestCase.testCaseId = fieldValue;
        } else if (fieldName === 'Module Name') {
          currentTestCase.moduleName = fieldValue;
        } else if (fieldName === 'Type') {
          currentTestCase.type = fieldValue;
        } else if (fieldName === 'Page/Component/API') {
          currentTestCase.pageComponentApi = fieldValue;
        } else if (fieldName === 'Description') {
          currentTestCase.description = fieldValue;
        } else if (fieldName === 'Preconditions') {
          currentTestCase.preconditions = fieldValue;
        } else if (fieldName === 'Steps') {
          currentTestCase.steps = fieldValue.replace(/<br>/g, '\n');
        } else if (fieldName === 'Expected Result') {
          currentTestCase.expectedResult = fieldValue.replace(/<br>/g, '\n');
        } else if (fieldName === 'Actual Result') {
          currentTestCase.actualResult = fieldValue;
        }
      }
      continue;
    }

    // End of table
    if (inTable && line.trim() === '') {
      if (currentTestCase && currentTestCase.testCaseId) {
        testCases.push({...currentTestCase});
      }
      inTable = false;
      currentTestCase = null;
    }
  }

  // Add the last test case if file doesn't end with empty line
  if (currentTestCase && currentTestCase.testCaseId) {
    testCases.push({...currentTestCase});
  }

  return testCases;
}

// Function to create Excel file from test cases
function createExcelFile(testCases, outputPath) {
  const worksheetData = [
    ['TestCase ID', 'Module Name', 'Type', 'Page/Component/API', 'Description', 'Preconditions', 'Steps', 'Expected Result', 'Actual Result']
  ];

  // Add test cases as rows
  testCases.forEach(tc => {
    worksheetData.push([
      tc.testCaseId,
      tc.moduleName,
      tc.type,
      tc.pageComponentApi,
      tc.description,
      tc.preconditions,
      tc.steps,
      tc.expectedResult,
      tc.actualResult
    ]);
  });

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Test Cases');

  // Set column widths
  const colWidths = [
    { wch: 18 }, // TestCase ID
    { wch: 15 }, // Module Name
    { wch: 12 }, // Type
    { wch: 30 }, // Page/Component/API
    { wch: 50 }, // Description
    { wch: 40 }, // Preconditions
    { wch: 60 }, // Steps
    { wch: 60 }, // Expected Result
    { wch: 15 }  // Actual Result
  ];
  worksheet['!cols'] = colWidths;

  // Write file
  XLSX.writeFile(workbook, outputPath);
  console.log(`Created: ${outputPath}`);
}

// List of markdown files to convert
const markdownFiles = [
  { input: 'AUTHENTICATION_TestCases.md', output: 'AUTHENTICATION_TestCases.xlsx' },
  { input: 'CHAT_TestCases.md', output: 'CHAT_TestCases.xlsx' },
  { input: 'MARKETPLACE_TestCases.md', output: 'MARKETPLACE_TestCases.xlsx' },
  { input: 'DASHBOARD_TestCases.md', output: 'DASHBOARD_TestCases.xlsx' },
  { input: 'UPLOAD_TestCases.md', output: 'UPLOAD_TestCases.xlsx' },
  { input: 'FORMS_TestCases.md', output: 'FORMS_TestCases.xlsx' },
  { input: 'AGENTS_TestCases.md', output: 'AGENTS_TestCases.xlsx' },
  { input: 'DISCOVER_TestCases.md', output: 'DISCOVER_TestCases.xlsx' },
  { input: 'TEST_CASES_SUMMARY.md', output: 'TEST_CASES_SUMMARY.xlsx' }
];

// Convert each file
console.log('Starting conversion of test case files to Excel...\n');

markdownFiles.forEach(fileInfo => {
  const inputPath = path.join(__dirname, fileInfo.input);
  const outputPath = path.join(__dirname, fileInfo.output);

  if (fs.existsSync(inputPath)) {
    const content = fs.readFileSync(inputPath, 'utf8');
    const testCases = parseMarkdownToTestCases(content);

    if (testCases.length > 0) {
      createExcelFile(testCases, outputPath);
      console.log(`  - Parsed ${testCases.length} test cases from ${fileInfo.input}`);
    } else {
      console.log(`  - Warning: No test cases found in ${fileInfo.input}`);
    }
  } else {
    console.log(`  - Error: File not found: ${fileInfo.input}`);
  }
});

console.log('\nConversion complete!');
