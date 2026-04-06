/**
 * Authentication and security utilities
 */

import bcryptjs from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcryptjs
 * @param password Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plain text password with a hash
 * @param password Plain text password
 * @param hash Password hash from database
 * @returns True if password matches hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

/**
 * Check if a user has a specific role
 * @param userRole Current user's role
 * @param requiredRole Role to check against
 * @returns True if user has required role
 */
export function hasRole(
  userRole: string | undefined,
  requiredRole: string
): boolean {
  return userRole === requiredRole;
}

/**
 * Check if a user has any of the required roles (permission)
 * @param userRole Current user's role
 * @param allowedRoles Array of roles that are allowed
 * @returns True if user has one of the allowed roles
 */
export function hasAnyRole(
  userRole: string | undefined,
  allowedRoles: string[]
): boolean {
  return userRole ? allowedRoles.includes(userRole) : false;
}

/**
 * Verify email format (basic validation)
 * @param email Email to validate
 * @returns True if email format is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Verify password meets minimum requirements
 * @param password Password to validate
 * @returns Object with isValid flag and error message if invalid
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  // Optional: Add more security requirements
  // if (!/[A-Z]/.test(password)) {
  //   errors.push("Password must contain at least one uppercase letter");
  // }
  // if (!/[0-9]/.test(password)) {
  //   errors.push("Password must contain at least one number");
  // }
  // if (!/[!@#$%^&*]/.test(password)) {
  //   errors.push("Password must contain at least one special character");
  // }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Generate a random token for password reset, email verification, etc.
 * @param length Length of token to generate (default: 32 bytes = 64 hex chars)
 * @returns Random hex string token
 */
export function generateToken(length: number = 32): string {
  return require("crypto").randomBytes(length).toString("hex");
}
