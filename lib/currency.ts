/**
 * Utility functions for currency formatting
 */

/**
 * Format VND price with comma separators
 * @param vndPrice - Price in VND
 * @returns Formatted price string with ₫ symbol
 */
export function formatVND(vndPrice: number): string {
  return `${vndPrice.toLocaleString("en-US")}₫`;
}
