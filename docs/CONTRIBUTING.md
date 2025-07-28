# Contributing Guidelines

Thank you for your interest in contributing to `wc-client`! We welcome contributions from the community to help improve this optimized XRP Ledger client. Whether you're fixing bugs, adding features, improving documentation, or suggesting enhancements, your efforts are appreciated. This document outlines the process and guidelines for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style and Guidelines](#code-style-and-guidelines)
- [Submitting Changes](#submitting-changes)
- [Recognizing Contributions](#recognizing-contributions)
- [Questions or Need Help?](#questions-or-need-help)

## Code of Conduct

By participating in this project, you agree to abide by the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). We are committed to fostering an open, welcoming, and inclusive environment for everyone. Please report unacceptable behavior to [support@first-ledger.com].

## How Can I Contribute?

There are many ways to contribute:

- **Reporting Bugs**: Open an issue with a clear description of the problem.
- **Suggesting Features**: Share ideas for new functionality or improvements.
- **Writing Code**: Fix bugs, implement features, or enhance performance.
- **Improving Documentation**: Update the README, examples, or this file.
- **Testing**: Verify fixes or new features and report results.
- **Reviewing Pull Requests**: Provide feedback on others’ contributions.

No contribution is too small! Every bit helps make `wc-client` better.

## Getting Started

1. **Fork the Repository**:
   - Click the "Fork" button on the [GitHub repository](https://github.com/joey-wallet/wc-client) to create your own copy.
2. **Clone Your Fork**:

   ```bash
   git clone https://github.com/joey-wallet/wc-client.git
   cd wc-client

   ```

3. **Install Dependencies**:
   - Ensure you have [Node.js](https://nodejs.org/) installed (version 16 or later recommended).
   - Run:bash
     ```bash
     npm install
     ```
4. **Set Up Development Environment**:
   - Create a .env file if needed (see .env.example if provided) for local testing with XRPL nodes.
   - Test the setup:bash
     ```bash
     npm run test
     ```

**Development Workflow**

1. **Create a Branch**:
   - Use a descriptive branch name related to your change:bash
     ```bash
     git checkout -b feature/add-new-rpc-method
     ```
   - Naming convention: feature/, bugfix/, docs/, or chore/ followed by a short description.
2. **Make Changes**:
   - Write clean, modular code or update documentation as needed.
   - Test your changes locally (e.g., npm run test or manual testing with XRPL nodes).
3. **Commit Your Changes**:
   - Follow conventional commit messages (e.g., feat: add server_info caching, fix: resolve websocket fallback bug):bash
     ```bash
     git add .
     git commit -m "feat: add new RPC method for ledger queries"
     ```
4. **Push to Your Fork**:bash

   ```bash
   git push origin feature/add-new-rpc-method
   ```

5. **Open a Pull Request**:
   - Go to the original repository and click "New Pull Request."
   - Select your branch and submit with a detailed description (see Submitting Changes (#submitting-changes)).

**Code Style and Guidelines**

To maintain consistency and quality, please adhere to the following:

- **Language**: TypeScript (used throughout wc-client).
- **Formatting**: Use Prettier for code formatting:bash

  ```bash
  npm run format
  ```

  - Configuration: See .prettierrc (if present) or default settings (parser: "typescript").

- **Linting**: Run ESLint to catch issues:bash
  ```bash
  npm run lint
  ```
- **Testing**: Add or update unit tests in the tests/ directory using [Jest](https://jestjs.io/) or the project’s testing framework:bash
  ```bash
  npm run test
  ```
- **Documentation**: Update the README or relevant files if your change affects usage (e.g., new config options, methods).
- **Dependencies**: Avoid adding unnecessary dependencies; justify any new ones in your PR.

**Example Standards**

- **Functions**: Use camelCase, e.g., fetchLedgerData.
- **Comments**: Add JSDoc-style comments for public methods:typescript
  ```tsx
  /**
   * Fetches server info from XRPL node.
   * @param options - Request options.
   * @returns Server info response.
   */
  async server_info(options: object) { ... }
  ```
- **Error Handling**: Ensure robust error handling, especially for network requests.

**Submitting Changes**

1. **Pull Request Guidelines**:
   - **Title**: Use a concise, descriptive title (e.g., "Add caching for server_info requests").
   - **Description**: Include:
     - What you changed and why.
     - How to test or verify the change.
     - Any related issues (e.g., "Fixes #123").
     - Example:

       ```
       ### Description
       Added caching to `server_info` method to reduce network calls.

       ### Changes
       - Updated `nu` object with cache logic.
       - Added tests in `tests/server_info.test.ts`.

       ### Testing
       Run `npm run test` and verify cache hits with `verbose: true`.

       Fixes #45
       ```

2. **Review Process**:
   - A maintainer will review your PR.
   - Address feedback by pushing additional commits to the same branch.
   - Once approved, it will be merged into main.

3. **Squashing Commits**: If requested, squash your commits into a single one before merging:bash

   ```bash
   git rebase -i HEAD~n  # Replace n with number of commits
   ```

**Recognizing Contributions**

- We use the [All Contributors](https://allcontributors.org/) specification to recognize all types of contributions (code, docs, testing, etc.).
- After your PR is merged, a maintainer will add you via the @all-contributors bot:
  ```
  @all-contributors please add @your-username for code
  ```
- Your name and avatar will appear in the README’s "Contributors" section.

**Questions or Need Help?**

- **Issues**: Open a GitHub issue for bug reports, feature requests, or questions.
- **Discussion**: Check the [Discussions](https://github.com/joey-wallet/wc-client/discussions) tab for community Q&A.
- **Contact**: Reach out to [dev@joeywallet.xyz](mailto:dev@joeywallet.xyz) for direct assistance.

Thank you for contributing to [wc-client]! Together, we can make it a faster, more reliable tool for the XRP Ledger community.
