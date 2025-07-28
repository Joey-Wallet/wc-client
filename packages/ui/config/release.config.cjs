/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  // Define branch configurations explicitly
  branches: [
    // Main branch for production releases
    { name: 'main', channel: 'latest' },
    // Pre-release branch for release candidates
    { name: 'pre/rc', channel: 'rc', prerelease: 'rc' },
    // Alpha branch for early testing
    { name: 'alpha', channel: 'alpha', prerelease: 'a' },
    // Beta branch for more stable pre-releases
    { name: 'beta', channel: 'beta', prerelease: 'b' },
  ],

  // Custom tag format for releases
  tagFormat: '${packageName}@${version}',

  // Best practice: Only enable dryRun in development/testing
  dryRun: false,

  // Disable CI verification since we're handling releases manually
  noCi: true,

  // Enable debug output for troubleshooting
  debug: true,

  // Plugin configuration with recommended order
  plugins: [
    // 1. Verify conditions before proceeding
    [
      '@semantic-release/exec',
      {
        verifyConditionsCmd: './scripts/verify-release.sh',
        // This script will run before any release steps
      },
    ],

    // 2. Analyze commits first to determine release type
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular', // Using Angular commit convention
        releaseRules: [
          // Custom rules to trigger patch releases
          { type: 'docs', scope: 'README', release: 'patch' },
          { type: 'refactor', release: 'patch' },
        ],
        // Consider adding: parserOpts for custom commit parsing if needed
      },
    ],

    // 3. Generate release notes based on commits
    '@semantic-release/release-notes-generator',

    // 4. Handle npm package (not publishing to npm registry)
    [
      '@semantic-release/npm',
      {
        npmPublish: false, // Skipping public npm registry
        // Suggestion: Add tarballDir if you need package artifacts
      },
    ],

    // 5. Maintain changelog file
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
        changelogTitle: '# ${packageName} Changelog',
      },
    ],

    // 6. Commit changes back to git
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md'], // Files to commit
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],

    // 7. Create GitHub release
    [
      '@semantic-release/github',
      {
        assets: [
          {
            path: '.bundle.zip',
            name: '${packageName}-${nextRelease.gitTag}.zip',
            label: '${nextRelease.gitTag}-distribution',
          },
        ],
        successComment:
          'Successfully released ${packageName}@${nextRelease.version}! 🎉 Check the release notes for details.',
        failComment:
          'Release of ${packageName}@${nextRelease.version} failed. Please check the logs for details.',
      },
    ],

    // 8. Custom publish step
    [
      '@semantic-release/exec',
      {
        publishCmd: 'pnpm pub:release --tag ${branch.channel} --publish-branch ${branch.name}',
      },
    ],
  ],
};
