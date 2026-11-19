// wordpolis-wrapper.ts
import * as WordpolisOriginal from 'wordpolis';

/**
 * Wrapper for the Wordpolis module.
 *
 * This wrapper object is required because ES module exports in Angular (and modern
 * TypeScript/JavaScript) are immutable by default. Directly importing and spying
 * on functions exported from an ES module (like `generateCandidates`) is not allowed,
 * which causes errors in unit tests such as:
 *
 *   "Error: <spyOn> : generateCandidates is not declared writable or has no setter"
 *
 * By wrapping the function inside a mutable object (`Wordpolis`), we can:
 *   1. Preserve the original function for runtime usage.
 *   2. Allow test spies to intercept calls during unit tests.
 *
 * Usage:
 *   import { Wordpolis } from './wordpolis-wrapper';
 *   Wordpolis.generateCandidates(...);
 *
 * In tests:
 *   vi.spyOn(Wordpolis, 'generateCandidates').mockReturnValue(...);
 */
export const Wordpolis = {
  generateCandidates: WordpolisOriginal.generateCandidates
};
