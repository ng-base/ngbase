const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// For readFile and writeFile operations
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const copyFile = promisify(fs.copyFile);

// Base paths
const sourceBase = 'projects/mee';
const destBase = 'projects/adk/schematics/components/files';

// Folders to exclude
const excludeFolders = ['src', 'typography'];

// Files to exclude (add more patterns as needed)
const excludePatterns = [
  /\.spec\.ts$/, // Exclude spec files
  /\.test\.ts$/, // Exclude test files
  /\.stories\.ts$/, // Exclude storybook files
  /ng-package\.json$/, // Exclude ng-package.json
  // /-llm\.md$/, // Exclude *-llm.md files
];

// File rename rules
const renameRules = [
  { from: /public-api\.ts$/, to: 'index.ts.template' },
  { from: /\.ts$/, to: '.ts.template' }, // Convert all .ts files to .ts.template
  { from: /\.md$/, to: '.md.template' }, // Convert all .md files to .md.template
];

/**
 * Determines if a file should be excluded
 * @param {string} filename - The filename to check
 * @returns {boolean} - True if file should be excluded
 */
function shouldExclude(filename) {
  return excludePatterns.some(pattern => pattern.test(filename));
}

/**
 * Get the destination filename applying rename rules
 * @param {string} originalFilename - The original filename
 * @returns {string} - The renamed filename
 */
function getDestFilename(originalFilename) {
  let result = originalFilename;

  for (const rule of renameRules) {
    if (rule.from.test(result)) {
      result = result.replace(rule.from, rule.to);
      break; // Apply only the first matching rule
    }
  }

  return result;
}

/**
 * Copy a file from source to destination with content replacement
 * @param {string} srcFile - Source file path
 * @param {string} destFile - Destination file path
 */
async function copyFileWithDir(srcFile, destFile) {
  try {
    // Create destination directory if it doesn't exist
    const destDir = path.dirname(destFile);
    await mkdir(destDir, { recursive: true });

    // Read the file content
    const content = await readFile(srcFile, 'utf8');

    // First replace "@meeui/ui" with "<%= basepath %>"
    let modifiedContent = content.replace(/@meeui\/ui/g, '<%= basepath %>');

    // Then replace "mee" with "<%= name %>"
    modifiedContent = modifiedContent.replace(/mee/g, '<%= name %>');

    // Write the modified content to destination
    await writeFile(destFile, modifiedContent, 'utf8');

    console.log(`Copied and modified: ${srcFile} -> ${destFile}`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error(`File not found: ${srcFile}`);
    } else if (err.code === 'EISDIR') {
      console.error(`Cannot read directory as file: ${srcFile}`);
    } else {
      console.error(`Error processing ${srcFile}: ${err.message}`);

      // For binary files that can't be read as text, fall back to direct copy
      try {
        await copyFile(srcFile, destFile);
        console.log(`Copied (binary): ${srcFile} -> ${destFile}`);
      } catch (copyErr) {
        console.error(`Error copying binary file ${srcFile}: ${copyErr.message}`);
      }
    }
  }
}

/**
 * Process a component directory
 * @param {string} componentName - The component name (e.g., 'accordion')
 */
async function processComponentDir(componentName) {
  const sourcePath = path.join(sourceBase, componentName);
  const destPath = path.join(destBase, componentName);

  try {
    // Check if source exists and is a directory
    const sourceStats = await stat(sourcePath);
    if (!sourceStats.isDirectory()) {
      console.log(`Skipping ${componentName}: Not a directory`);
      return;
    }

    // Get all files in the source directory
    const files = await readdir(sourcePath);

    for (const file of files) {
      const srcFilePath = path.join(sourcePath, file);

      // Check if it's a file
      const fileStats = await stat(srcFilePath);
      if (!fileStats.isFile()) continue;

      // Skip excluded files
      if (shouldExclude(file)) {
        console.log(`Skipping excluded file: ${srcFilePath}`);
        continue;
      }

      // Determine destination filename
      const destFileName = getDestFilename(file);
      const destFilePath = path.join(destPath, destFileName);

      // Copy the file
      await copyFileWithDir(srcFilePath, destFilePath);
    }

    console.log(`Completed processing component: ${componentName}`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`Component directory not found: ${sourcePath}`);
    } else {
      console.error(`Error processing ${componentName}: ${err.message}`);
    }
  }
}

/**
 * Process all component directories in source base
 */
async function processAllComponents() {
  try {
    // Get all directories in the source base
    const components = await readdir(sourceBase);

    // Process each component
    for (const component of components) {
      // Skip excluded folders
      if (excludeFolders.includes(component)) {
        console.log(`Skipping excluded folder: ${component}`);
        continue;
      }

      const componentPath = path.join(sourceBase, component);
      const stats = await stat(componentPath);

      if (stats.isDirectory()) {
        await processComponentDir(component);
      }
    }

    console.log('All components processed successfully!');
  } catch (err) {
    console.error(`Error processing components: ${err.message}`);
  }
}

// Run the script
processAllComponents().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
