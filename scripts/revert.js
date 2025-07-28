// @ts-check
import fs from 'fs-extra';
import { dirname, join, relative } from 'path';
import { readNxJson, workspaceRoot } from '@nx/devkit'; // St

// Helper function to recursively find package.json files
function findPackageJsonFiles(dir, ignoreDirs = ['node_modules', 'dist']) {
  const results = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !ignoreDirs.includes(file)) {
      results.push(...findPackageJsonFiles(fullPath, ignoreDirs));
    } else if (file === 'package.json') {
      results.push(fullPath);
    }
  }

  return results;
}

// Helper function to read JSON synchronously
function readJsonSync(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(`Failed to read or parse ${filePath}: ${error.message}`);
    return null;
  }
}

// Helper function to write JSON synchronously
function writeJsonSync(filePath, data, options = { spaces: 2 }) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, options.spaces), 'utf8');
}

// Helper function to get project roots and package names
function getWorkspaceProjects(workspaceRoot) {
  let projectRoots = [];
  const nxJsonPath = join(workspaceRoot, 'nx.json');

  // Read nx.json if it exists to get initial project list
  if (fs.existsSync(nxJsonPath)) {
    const nxJson = readJsonSync(nxJsonPath);
    if (nxJson && nxJson.projects) {
      projectRoots = Object.values(nxJson.projects).map((proj) =>
        typeof proj === 'string' ? proj : proj.root
      );
    }
  }

  // Fallback: Recursively find all package.json files
  const packageJsonFiles = findPackageJsonFiles(workspaceRoot);
  const allRoots = new Set([
    ...projectRoots,
    ...packageJsonFiles.map((file) => relative(workspaceRoot, dirname(file))),
  ]);
  // Build a set of workspace package names
  const workspacePackages = new Set();
  for (const root of allRoots) {
    const packageJsonPath = join(workspaceRoot, root, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = readJsonSync(packageJsonPath);
      if (packageJson && packageJson.name) {
        workspacePackages.add(packageJson.name);
      }
    }
  }

  return { roots: Array.from(allRoots), packages: workspacePackages };
}

// Helper function to revert dependencies to "workspace:*"
function revertDependenciesToWorkspace(workspaceRoot) {
  const { roots, packages } = getWorkspaceProjects(workspaceRoot);

  for (const root of roots) {
    const packageJsonPath = join(workspaceRoot, root, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      console.warn(`No package.json found at ${packageJsonPath}, skipping...`);
      continue;
    }

    const packageJson = readJsonSync(packageJsonPath);
    if (!packageJson) continue;

    // Revert dependencies
    let modified = false;
    for (const depType of ['dependencies', 'devDependencies', 'peerDependencies']) {
      if (packageJson[depType]) {
        for (const depName of Object.keys(packageJson[depType])) {
          if (packages.has(depName)) {
            packageJson[depType][depName] = 'workspace:*';
            modified = true;
          }
        }
      }
    }

    // Write the updated package.json back if modified
    if (modified) {
      writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
      console.log(`Reverted dependencies in ${packageJsonPath} to workspace:*`);
    }
  }
}

const main = async () => {
  try {
    await revertDependenciesToWorkspace(workspaceRoot);
  } catch (e) {
    console.error(`Release failed: ${e.message}`);
    process.exit(1);
  }
};

main()
  .then(() => {
    console.log('Success! Exiting with code 0.');
    process.exit(0); // Explicitly exit with success code
  })
  .catch((error) => {
    console.error('An error occurred:', error);
    process.exit(1); // Exit with error code
  });
