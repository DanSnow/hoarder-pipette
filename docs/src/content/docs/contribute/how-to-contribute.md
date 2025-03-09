---
title: How to contribute
---

Thank you for your interest in contributing to Hoarder's Pipette! We welcome contributions of all kinds, from bug reports and feature requests to code contributions.

## How to contribute

### Issues and Bug Reports

- If you encounter a bug or have a suggestion, please open an issue on our GitHub repository.
- Provide clear and concise steps to reproduce the bug, including relevant screenshots or error messages.
- For feature requests, describe the desired functionality and its potential benefits.

### Adding a New Supported Search Engine

- We encourage you to expand Hoarder's Pipette's reach by adding support for new search engines.
- To submit a request, please create a new issue with the following information:
  - **Search Engine URL:** Provide the full URL of the search engine.
  - **Screenshot:** Include a screenshot of the search engine's results page, clearly highlighting where you believe Hoarder's Pipette should appear.
  - **Reasoning:** Explain why you think this search engine would be a good addition.

### Feature Requests

- Please open an issue and detail the desired feature.
- Explain the use case and why the feature would be beneficial.
- If possible, provide mockups or examples of how the feature might look or function.

### Pull Requests (PRs)

- If you'd like to contribute code, please follow these guidelines:
  - Fork the repository and create a new branch for your changes.
  - Ensure your code adheres to our coding standards (see "Development Setup" below).
  - Write clear and concise commit messages.
  - Test your changes thoroughly.
  - Submit a pull request with a detailed description of your changes.

### Development Setup

- Hoarder's Pipette is a Node.js project.
- We use `pnpm` as our package manager. If you don't have it installed, check out the guide here: https://pnpm.io/installation
- After cloning the repository, install dependencies:
  ```bash
  pnpm install
  ```
- Coding Standard:
  - We use `biome` for linting and formatting. Please ensure your code adheres to the defined rules.
  - To lint and format your code, run:
  ```bash
  pnpm run lint
  ```
  ```bash
  pnpm run lint --fix
  ```
- We use `vitest` for testing. To run tests, use:
  ```bash
  pnpm test
  ```
- Test in local environment:
 - Run the following command to start it locally:
   ```bash
   pnpm dev
   ```

**Thank you for your contributions!**
