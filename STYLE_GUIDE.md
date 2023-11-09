# Project Style Guide

This document outlines the coding and documentation conventions for our project.

## Table of Contents

1. [General Guidelines](#general-guidelines)
2. [Naming Conventions](#naming-conventions)
3. [Comments](#comments)
4. [Formatting](#formatting)
5. [Error Handling](#error-handling)
6. [Documentation](#documentation)
7. [Angular-Specific Guidelines](#angular-specific-guidelines)

## 1. General Guidelines

- Write clear and concise code.
- Keep functions and methods focused on a single responsibility.
- Follow the [Code of Conduct](CONTRIBUTING.md).

## 2. Naming Conventions

### Variables and Constants

- Use descriptive names.
- Avoid overly abbreviated or cryptic names.
- Prefer camelCase for variables and constants.
- Constants should be in UPPERCASE_SNAKE_CASE.

```typescript
// Good
const maxItemCount = 10;
let userName = 'JohnDoe';

// Bad
const mxItmCnt = 10;
let x = 'JohnDoe';
```

## 3. Comments

- Use comments sparingly; prefer self-explanatory code.
- Add comments for complex logic or where clarification is needed.
- Keep comments up-to-date.

```typescript
// Good
const calculateTotal = (items: number[]): number => {
  // Sum up the array of items
  return items.reduce((sum, item) => sum + item, 0);
};

// Bad
const calculateTotal = (arr: number[]): number => arr.reduce((s, i) => s + i, 0);
```

## 4. Formatting

- Follow consistent indentation (2 spaces).
- Keep lines around 80-120 characters.
- Use a consistent line break style (e.g., Unix-style line endings).

## 5. Error Handling

- Always handle errors appropriately.
- Avoid empty catch blocks; log or handle the error.

```typescript
// Good
try {
  // some code that may throw an error
} catch (error) {
  console.error('An error occurred:', error);
}

// Bad
try {
  // some code that may throw an error
} catch (error) {
  // empty catch block
}
```

## 6. Documentation

- Provide clear and concise documentation for public APIs.
- Use JSDoc comments for functions and methods.

```typescript
/**
 * Adds two numbers.
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The sum of the two numbers.
 */
const addNumbers = (a: number, b: number): number => a + b;
```

## 7. Angular-Specific Guidelines

- Follow the official [Angular Style Guide](https://angular.io/guide/styleguide).