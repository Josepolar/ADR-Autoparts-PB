/**
 * Common utility functions for formatting, calculations, and helpers
 */

/**
 * Format currency to PHP with proper formatting
 * @param amount Amount in PHP
 * @returns Formatted currency string (e.g., "₱1,234.56")
 */
export function formatCurrency(amount: number | bigint): string {
  const numAmount = typeof amount === "bigint" ? Number(amount) : amount;
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);
}

/**
 * Format a date to readable format
 * @param date Date to format
 * @param format Format style (short|long|full)
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  format: "short" | "long" | "full" = "long"
): string {
  const d = typeof date === "string" ? new Date(date) : date;

  const styles = {
    short: {
      year: "numeric" as const,
      month: "2-digit" as const,
      day: "2-digit" as const,
    },
    long: {
      year: "numeric" as const,
      month: "long" as const,
      day: "numeric" as const,
    },
    full: {
      weekday: "long" as const,
      year: "numeric" as const,
      month: "long" as const,
      day: "numeric" as const,
    },
  };

  return new Intl.DateTimeFormat("en-PH", styles[format]).format(d);
}

/**
 * Format a date and time to readable format
 * @param date Date to format
 * @returns Formatted date-time string (e.g., "January 15, 2026 2:30 PM")
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(d);
}

/**
 * Format time only (HH:MM AM/PM)
 * @param date Date to format
 * @returns Formatted time string (e.g., "2:30 PM")
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/**
 * Calculate days between two dates
 * @param date1 First date
 * @param date2 Second date
 * @returns Number of days between dates (positive if date2 is later)
 */
export function daysBetween(date1: Date, date2: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((date2.getTime() - date1.getTime()) / msPerDay);
}

/**
 * Check if a date is in the future
 * @param date Date to check
 * @returns True if date is in the future
 */
export function isFuture(date: Date): boolean {
  return date > new Date();
}

/**
 * Check if a date is in the past
 * @param date Date to check
 * @returns True if date is in the past
 */
export function isPast(date: Date): boolean {
  return date < new Date();
}

/**
 * Add days to a date
 * @param date Starting date
 * @param days Number of days to add (can be negative)
 * @returns New date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Add hours to a date
 * @param date Starting date
 * @param hours Number of hours to add
 * @returns New date
 */
export function addHours(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

/**
 * Calculate percentage
 * @param part Part value
 * @param whole Whole value
 * @returns Percentage (0-100)
 */
export function calculatePercentage(part: number, whole: number): number {
  if (whole === 0) return 0;
  return (part / whole) * 100;
}

/**
 * Calculate discount amount
 * @param originalPrice Original price
 * @param discountPercent Discount as percentage (0-100)
 * @returns Discount amount
 */
export function calculateDiscount(
  originalPrice: number,
  discountPercent: number
): number {
  return (originalPrice * discountPercent) / 100;
}

/**
 * Calculate final price after discount
 * @param originalPrice Original price
 * @param discountPercent Discount as percentage (0-100)
 * @returns Final price after discount
 */
export function applyDiscount(
  originalPrice: number,
  discountPercent: number
): number {
  return originalPrice - calculateDiscount(originalPrice, discountPercent);
}

/**
 * Truncate string to maximum length with ellipsis
 * @param str String to truncate
 * @param maxLength Maximum length
 * @returns Truncated string
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + "...";
}

/**
 * Capitalize first letter of a string
 * @param str String to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert role enum to readable label
 * @param role User role
 * @returns Readable label
 */
export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    ADMIN: "Administrator",
    MECHANIC: "Mechanic",
    CUSTOMER: "Customer",
  };
  return labels[role] || role;
}

/**
 * Convert status enum to readable label with color
 * @param status Status value
 * @returns Object with label and color class
 */
export function getStatusQuery(status: string): { label: string; color: string } {
  const statuses: Record<string, { label: string; color: string }> = {
    // Order statuses
    PENDING_PAYMENT: { label: "Pending Payment", color: "bg-yellow-900" },
    PAYMENT_CONFIRMED: { label: "Payment Confirmed", color: "bg-blue-900" },
    PROCESSING: { label: "Processing", color: "bg-blue-900" },
    SHIPPED: { label: "Shipped", color: "bg-cyan-900" },
    DELIVERED: { label: "Delivered", color: "bg-green-900" },
    COMPLETED: { label: "Completed", color: "bg-green-900" },
    CANCELLED: { label: "Cancelled", color: "bg-red-900" },
    REFUNDED: { label: "Refunded", color: "bg-orange-900" },

    // Immo statuses
    PENDING_UPLOAD: { label: "Pending Upload", color: "bg-yellow-900" },
    READY_FOR_DOWNLOAD: { label: "Ready", color: "bg-green-900" },
    DOWNLOADED: { label: "Downloaded", color: "bg-green-900" },

    // Appointment statuses
    SCHEDULED: { label: "Scheduled", color: "bg-blue-900" },
    CONFIRMED: { label: "Confirmed", color: "bg-blue-900" },
    IN_PROGRESS: { label: "In Progress", color: "bg-yellow-900" },
    NO_SHOW: { label: "No Show", color: "bg-red-900" },
  };
  return statuses[status] || { label: status, color: "bg-gray-900" };
}

/**
 * Generate a unique ID (for client-side use only, DB has server-side IDs)
 * @returns Unique ID string
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate Philippines phone number
 * @param phone Phone number to validate
 * @returns True if valid Filipino phone format
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Accepts various PH phone formats: +63, 0, 09xx, 11 digits total starting with 9
  const regex = /^(\+63|0)?9\d{9}$/;
  return regex.test(phone.replace(/\D/g, ""));
}

/**
 * Format Philippines phone number to standard format
 * @param phone Phone number to format
 * @returns Formatted phone (e.g., "+63 917 555 1234")
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  
  if (cleaned.length === 12 && cleaned.startsWith("63")) {
    // +63 format
    return `+63 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  
  if (cleaned.length === 11 && cleaned.startsWith("0")) {
    // 0 format
    return `0${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }

  // 09xx format
  if (cleaned.startsWith("9")) {
    return `+63 9${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }

  return phone; // Return unchanged if doesn't match patterns
}

/**
 * Debounce a function (e.g., search input)
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if object is empty
 * @param obj Object to check
 * @returns True if object has no keys
 */
export function isEmpty(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}
