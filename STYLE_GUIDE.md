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

### Variable Names:

Choose variable names that are descriptive, clear, and contextually relevant, avoiding ambiguity, generic terms, and "magic" values, and strive for consistency and single responsibility to enhance code readability and maintainability. Below are some guidelines for variable naming.

- Boolean Variables: consider using prefixes like is (e.g., isVisible, isFinished) or has (e.g., hasPermission, hasErrors)

### Constants:

- Use uppercase letters and underscores to separate words (e.g., MAX_ATTEMPTS, API_URL).
- Group related constants with a common prefix (e.g., APP_CONSTANTS_MAX_ATTEMPTS).

### Classes:

- Use PascalCase for class names (e.g., AppComponent, UserService).
- Suffix services with "Service" (e.g., DataService).
- Use descriptive names that convey the purpose of the class.

### Components:

- Use kebab-case for component selectors (e.g., <app-my-component>).
- Use PascalCase for component class names (e.g., MyComponent).
- Suffix components with "Component" (e.g., UserListComponent).
- Choose clear and concise names that reflect the component's role.

### Files:

- Use kebab-case for file names (e.g., user-list.component.ts, data-service.service.ts).
- Match the file name with the primary class or component it contains.
- Include the file extension (e.g., .ts, .html, .scss).

### Interfaces:

- Use PascalCase for interface names (e.g., User, ApiResponse).
- Prefix interfaces with "I" (e.g., IUser, IApiResponse), although this is optional.

### Modules:

- Use PascalCase for module names (e.g., AppModule, UserModule).
- Choose names that represent the feature or functionality encapsulated by the module.

### Directives:

- Use camelCase for directive selectors (e.g., appMyDirective).
- Use PascalCase for directive class names (e.g., MyDirective).
- Suffix directives with "Directive" (e.g., HighlightDirective).

### Services:

- Use camelCase for service instances (e.g., dataService, authService).
- Use PascalCase for service class names (e.g., DataService, AuthService).
- Suffix services with "Service" (e.g., DataService).

### Enums:

- Use PascalCase for enum names (e.g., Color, UserRole).
- Use uppercase letters for enum values (e.g., RED, ADMIN).

### Routes:

- Use kebab-case for route paths (e.g., /user-profile, /dashboard).
- Use PascalCase for route components (e.g., UserProfileComponent, DashboardComponent).

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
