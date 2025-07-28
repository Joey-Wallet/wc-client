// @ts-check

import { releaseVersion, releaseChangelog, releasePublish } from 'nx/release/index.js';
import { execSync } from 'child_process';

import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import { gitPush } from 'nx/src/command-line/release/utils/git.js';

import fs from 'fs-extra';
import { dirname, join, relative } from 'path';
import { readNxJson, workspaceRoot } from '@nx/devkit'; // St

const scope = '@first-ledger/';
const removeScopeFromTag = false;

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
  let changesMade = false;

  for (const root of roots) {
    const packageJsonPath = join(workspaceRoot, root, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      console.warn(`No package.json found at ${packageJsonPath}, skipping...`);
      continue;
    }

    const packageJson = readJsonSync(packageJsonPath);
    if (!packageJson) continue;

    let modified = false;
    for (const depType of ['dependencies', 'devDependencies', 'peerDependencies']) {
      if (packageJson[depType]) {
        for (const depName of Object.keys(packageJson[depType])) {
          if (packages.has(depName) && packageJson[depType][depName] !== 'workspace:*') {
            packageJson[depType][depName] = 'workspace:*';
            modified = true;
            changesMade = true;
          }
        }
      }
    }

    if (modified) {
      writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
      console.log(`Reverted dependencies in ${packageJsonPath} to workspace:*`);
    }
  }
  // Commit the reverted changes if any were made
  if (changesMade) {
    try {
      execSync('git add .', { stdio: 'inherit' });
      execSync('git commit -m "chore: revert dependencies to workspace:* post-release"', {
        stdio: 'inherit',
      });
      console.log('Successfully committed reverted dependencies');
    } catch (error) {
      console.error('Failed to commit reverted dependencies:', error.message);
      throw error;
    }
  } else {
    console.log('No dependency changes to commit');
  }
}

const getLatestTag = (project, version, type) => {
  try {
    const tags = execSync(`git tag -l "${version}-${type}.*"`).toString().trim().split('\n');
    const targetTags = tags;
    if (targetTags.length === 0) return null;
    targetTags.sort((a, b) => {
      const aHandle = a.split(`${type}.`)[1];
      const bHandle = b.split(`${type}.`)[1];
      const aNum = aHandle ? parseInt(aHandle, 10) : 0;
      const bNum = bHandle ? parseInt(bHandle, 10) : 0;
      return aNum - bNum;
    });
    return targetTags[targetTags.length - 1];
  } catch (e) {
    console.warn(`Failed to fetch tags for ${version} with type ${type}: ${e.message}`);
    return null;
  }
};

const getNextTagNumber = (latestTag, type) => {
  if (!latestTag) return 1;
  const match = latestTag.match(new RegExp(`\\-${type}.(\\d+)$`));
  if (!match) return 1;
  return parseInt(match[1], 10) + 1;
};

const getCurrentVersions = async (releaseConfig, firstRelease) =>
  await releaseVersion({
    ...releaseConfig,
    specifier: firstRelease ? 'patch' : undefined,
  });

const main = async () => {
  const options = await yargs(hideBin(process.argv))
    .version(false) // don't use the default meaning of version in yargs
    .option('version', {
      description: 'Explicit version specifier to use, if overriding conventional commits',
      type: 'string',
    })
    .option('dryRun', {
      alias: 'd',
      description: 'Whether or not to perform a dry-run of the release process, defaults to true',
      type: 'boolean',
      default: false,
    })
    .option('verbose', {
      description: 'Whether or not to enable verbose logging, defaults to false',
      type: 'boolean',
      default: false,
    })
    .option('firstRelease', {
      description: 'Whether or not this is a first release',
      type: 'boolean',
      default: false,
    })
    .parseAsync();

  const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

  let releaseConfig = {
    dryRun: options.dryRun,
    verbose: options.verbose,
    firstRelease: options.firstRelease,
  };

  try {
    let projects = ['*']; // Default to all projects
    let tagType = '';
    let publishTag = 'latest';

    // Determine project scope and tag type based on branch
    if (branch === 'main') {
    } else if (branch === 'beta') {
      projects = ['*']; // Optionally limit to libraries
      tagType = 'b';
      publishTag = 'beta';
    } else if (branch === 'alpha') {
      projects = ['*'];
      tagType = 'a';
      publishTag = 'alpha';
    } else if (branch === 'pre/rc') {
      projects = ['*'];
      tagType = 'rc';
      publishTag = 'rc';
    } else {
      console.log(`No release configuration for branch: ${branch}`);
      return;
    }

    releaseConfig = {
      ...releaseConfig,
    };

    // Run version update for all projects
    const { projectsVersionData } = await getCurrentVersions(releaseConfig, options.firstRelease);

    // Generate tags for each project
    const projectTags = Object.entries(projectsVersionData).map(([projectName, versionData]) => {
      if (!versionData.newVersion) return { projectName, tag: undefined };
      let tag = removeScopeFromTag ? projectName.replace(scope, '') : projectName;
      if (branch === 'main') {
        tag = tag + `@${options.version ?? versionData.newVersion}`;
      } else {
        if (!versionData.newVersion.includes(`-${tagType}.`)) {
          tag = tag + `@${versionData.newVersion}-${tagType}.1`;
        } else {
          const version = options.version ?? versionData.currentVersion.split('-')[0];
          const latestTag = getLatestTag(projectName, version, tagType);
          const tagNumber = getNextTagNumber(latestTag, tagType);
          tag = tag + `@${version}-${tagType}.${tagNumber}`;
        }
      }
      return { projectName, tag };
    });

    // Step 3: Run version update with hardcoded versions from projectTags
    const versionSet = new Set(projectTags.map((obj) => obj.tag?.substring(1).split('@')[1]));
    const version = options.version ?? [...versionSet]?.[0];

    if (!version)
      return console.error(
        `Could not determine a release candidate for this branch. Ignoring release...`
      );

    if (versionSet.size > 1)
      console.warn(
        `There were multiple version detected. Consolidating to a simple version: ${version}`
      );

    let generatorOptionsOverrides = {
      specifier: 'prerelease',
      preid: tagType,
    };

    if (branch !== 'main')
      releaseConfig = {
        ...releaseConfig,
        generatorOptionsOverrides,
      };

    await releaseVersion({
      specifier: version,
      ...releaseConfig,
    });

    const versionData = Object.fromEntries(
      Object.entries(projectsVersionData).map(([project, data]) => {
        data.newVersion = version;
        return [project, data];
      })
    );

    console.log(`publishing release: ${version}`);

    // Publish with generated tags
    await releasePublish({
      dryRun: options.dryRun,
      verbose: options.verbose,
      tag: publishTag,
      access: 'public',
    });

    console.log(`Release completed for branch ${branch}`);
    projectTags.forEach((obj) => {
      console.log(`${obj.projectName}:${obj.tag}`);
    });

    // Generate changelog before reverting dependencies
    await releaseChangelog({
      versionData,
      version,
      dryRun: options.dryRun,
      verbose: options.verbose,
      gitCommitMessage: `chore(release): ${version}`,
    });

    // Revert dependencies and commit them
    await revertDependenciesToWorkspace(workspaceRoot);

    await gitPush({
      dryRun: options.dryRun,
      verbose: options.verbose,
    });
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
