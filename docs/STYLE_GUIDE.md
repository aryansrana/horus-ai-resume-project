# Coding Standards and Style Guide

This document outlines the coding standards that all contributors must follow to ensure a consistent codebase.

## General Standards
- **Coding Language:** Node.js
- **Frameworks:** shadcn/Next.js, Express.js

## Naming Conventions
- **Variables and Functions:** Use `camelCase`.  
  Example: `let userName = "";`
  
- **Classes:** Use `PascalCase`.  
  Example: `class UserAuthentication {}`

- **Constants:** Use `UPPER_SNAKE_CASE`.  
  Example: `const MAX_LOGIN_ATTEMPTS = 5;`

## Indentation and Spacing
- Use tabs for indentation.
- Add a single blank line between functions for readability.
- Avoid trailing whitespace.

## Comments
- Use **inline comments** sparingly for complex logic.
- Use **JSDoc** for functions and methods:
  ```javascript
  /**
   * Logs the user into the system.
   * @param {string} username - The username of the user.
   * @param {string} password - The password of the user.
   * @returns {boolean} - True if login is successful, otherwise false.
   */
  function login(username, password) { ... }

## File Structure
- Place components, services, and utilities in their respective directories.
- Export all modules explicitly.

## Testing
- Write unit tests for all core functions.
- Name test files as <file>.test.ts.

Following this guide ensures readable and maintainable code!
