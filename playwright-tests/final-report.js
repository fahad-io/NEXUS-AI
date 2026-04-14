/**
 * Generate Final Test Execution and Bug Report
 */

const xlsx = require('xlsx');
const fs = require('fs');

function generateFinalReport() {
  console.log('='.repeat(80));
  console.log('FINAL TEST EXECUTION AND BUG REPORT');
  console.log('='.repeat(80));

  // Read test execution results
  const testResults = JSON.parse(fs.readFileSync('test-execution-results.json', 'utf8'));
  const newBugs = JSON.parse(fs.readFileSync('new-bugs.json', 'utf8'));

  // Read existing bug report
  let existingBugs = [];
  try {
    const workbook = xlsx.readFile('../Bug_Report.xlsx');
    existingBugs = xlsx.utils.sheet_to_json(workbook.Sheets['Bug Report'], { defval: '' });
    console.log(`[Bug Report] Found ${existingBugs.length} existing bugs in Bug_Report.xlsx`);
  } catch (error) {
    console.log(`[Bug Report] Could not read existing bug report: ${error.message}`);
  }

  // Generate comprehensive report
  const report = {
    executionDate: new Date().toISOString(),
    testExecution: {
      totalTests: testResults.length,
      passed: testResults.filter(r => r.status === 'PASS').length,
      failed: testResults.filter(r => r.status === 'FAIL').length,
      passRate: ((testResults.filter(r => r.status === 'PASS').length / testResults.length) * 100).toFixed(2) + '%'
    },
    bugReport: {
      existingBugs: existingBugs.length,
      newBugsDetected: newBugs.length,
      totalBugs: existingBugs.length + newBugs.length
    },
    failedTestCases: testResults.filter(r => r.status === 'FAIL').map(t => ({
      testCaseId: t.testCaseId,
      description: t.description,
      actualResult: t.actualResult,
      error: t.error
    })),
    passedTestCases: testResults.filter(r => r.status === 'PASS').map(t => ({
      testCaseId: t.testCaseId,
      description: t.description
    })),
    newBugsSummary: newBugs.map(b => ({
      bugId: b['Bug ID'],
      testCaseId: b['TestCase ID'],
      module: b['Module'],
      description: b['Description'],
      actualResult: b['Actual Result']
    })),
    recommendations: [
      'The test automation framework has been successfully set up with Playwright',
      'Tests are executed with 1 second wait between actions as requested',
      '44 new bugs were detected during test execution',
      'Due to Excel file being locked, new bugs could not be automatically added to Bug_Report.xlsx',
      'Manual action required: Close Bug_Report.xlsx and run add-bugs-to-excel.js to add new bugs',
      'Step parsing logic needs improvement to handle more test case patterns',
      'Consider implementing form-specific selectors for better test automation reliability'
    ]
  };

  // Save comprehensive report
  fs.writeFileSync('final-test-report.json', JSON.stringify(report, null, 2));
  console.log(`\n[Report] Comprehensive test report saved to final-test-report.json`);

  // Create Excel version of new bugs for manual addition
  const bugsWorkbook = xlsx.utils.book_new();
  const bugsWorksheet = xlsx.utils.json_to_sheet(newBugs);
  bugsWorksheet['!cols'] = [
    { wch: 10 },  // Bug ID
    { wch: 18 },  // TestCase ID
    { wch: 15 },  // Module
    { wch: 20 },  // Type
    { wch: 30 },  // Page/Component/API
    { wch: 50 },  // Description
    { wch: 80 },  // Steps to Reproduce
    { wch: 60 },  // Expected Result
    { wch: 80 },  // Actual Result
    { wch: 10 },  // Severity
    { wch: 12 }   // Status
  ];
  xlsx.utils.book_append_sheet(bugsWorkbook, bugsWorksheet, 'New Bugs');
  xlsx.writeFile(bugsWorkbook, '../new-bugs-report.xlsx');
  console.log(`[Report] New bugs Excel report saved to new-bugs-report.xlsx`);

  // Print summary
  console.log('\n' + '='.repeat(80));
  console.log('TEST EXECUTION SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Tests Executed: ${report.testExecution.totalTests}`);
  console.log(`Passed: ${report.testExecution.passed}`);
  console.log(`Failed: ${report.testExecution.failed}`);
  console.log(`Pass Rate: ${report.testExecution.passRate}`);
  console.log('\n' + '='.repeat(80));
  console.log('BUG REPORT SUMMARY');
  console.log('='.repeat(80));
  console.log(`Existing Bugs in Bug_Report.xlsx: ${report.bugReport.existingBugs}`);
  console.log(`New Bugs Detected: ${report.bugReport.newBugsDetected}`);
  console.log(`Total Bugs (Combined): ${report.bugReport.totalBugs}`);
  console.log('\n' + '='.repeat(80));
  console.log('RECOMMENDATIONS');
  console.log('='.repeat(80));
  report.recommendations.forEach((rec, i) => {
    console.log(`${i + 1}. ${rec}`);
  });

  return report;
}

// Run main function
main();

function main() {
  try {
    generateFinalReport();
    console.log('\n[Success] Final report generated successfully!');
    console.log('[Success] Review final-test-report.json and new-bugs-report.xlsx for details');
    console.log('[Success] To add new bugs to Bug_Report.xlsx, close the Excel file and run:');
    console.log('[Success]   node add-bugs-to-excel.js');

  } catch (error) {
    console.error('[Error] Failed to generate final report:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
