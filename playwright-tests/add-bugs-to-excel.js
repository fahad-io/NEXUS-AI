/**
 * Add new bugs to Bug_Report.xlsx without disturbing existing data
 */

const xlsx = require('xlsx');
const fs = require('fs');

function addBugsToExcelReport(newBugs) {
  try {
    console.log(`\n[Bug Report] Adding ${newBugs.length} new bugs to existing report...`);

    // Read existing bug report
    const existingWorkbook = xlsx.readFile('../Bug_Report.xlsx');
    const existingSheet = existingWorkbook.Sheets['Bug Report'];
    const existingData = xlsx.utils.sheet_to_json(existingSheet, { defval: '' });

    console.log(`[Bug Report] Found ${existingData.length} existing bugs`);

    // Find highest Bug ID to continue from there
    const existingBugIds = existingData
      .map(row => row['Bug ID'])
      .filter(id => id && id.startsWith('BR-'))
      .map(id => parseInt(id.replace('BR-', '')));

    const nextBugId = existingBugIds.length > 0 ? Math.max(...existingBugIds) + 1 : 1;

    // Update bug IDs for new bugs to continue from existing
    const updatedNewBugs = newBugs.map((bug, index) => ({
      ...bug,
      'Bug ID': `BR-${String(nextBugId + index).padStart(3, '0')}`
    }));

    console.log(`[Bug Report] New bugs will start from ID: BR-${String(nextBugId).padStart(3, '0')}`);

    // Combine existing and new bugs
    const allBugs = [...existingData, ...updatedNewBugs];

    // Create new worksheet
    const newWorksheet = xlsx.utils.json_to_sheet(allBugs);

    // Preserve column widths from original sheet
    if (existingSheet['!cols']) {
      newWorksheet['!cols'] = existingSheet['!cols'];
    }

    // Update workbook
    existingWorkbook.Sheets['Bug Report'] = newWorksheet;

    // Save updated workbook
    xlsx.writeFile(existingWorkbook, '../Bug_Report.xlsx');

    console.log(`[Bug Report] Successfully added ${updatedNewBugs.length} new bugs`);
    console.log(`[Bug Report] Total bugs in report: ${allBugs.length}`);

    return {
      success: true,
      addedBugs: updatedNewBugs.length,
      totalBugs: allBugs.length,
      newBugIds: updatedNewBugs.map(b => b['Bug ID'])
    };

  } catch (error) {
    console.error('[Error] Failed to add bugs to Excel report:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Main execution
function main() {
  console.log('='.repeat(80));
  console.log('ADD NEW BUGS TO BUG_REPORT.XLSX');
  console.log('='.repeat(80));

  // Read new bugs from file
  if (!fs.existsSync('new-bugs.json')) {
    console.error('[Error] new-bugs.json not found');
    process.exit(1);
  }

  const newBugs = JSON.parse(fs.readFileSync('new-bugs.json', 'utf8'));
  console.log(`[Setup] Read ${newBugs.length} new bugs from new-bugs.json`);

  // Add bugs to Excel report
  const result = addBugsToExcelReport(newBugs);

  if (result.success) {
    console.log('\n[Success] Bug report updated successfully!');
    console.log(`[Success] Added ${result.addedBugs} new bugs`);
    console.log(`[Success] Total bugs in report: ${result.totalBugs}`);
    console.log(`[Success] New Bug IDs: ${result.newBugIds.join(', ')}`);
  } else {
    console.error(`\n[Error] Failed to update bug report: ${result.error}`);
    process.exit(1);
  }
}

// Run main function
main();
