/**
 * Utility functions for currency formatting
 */

/**
 * Format VND price with dot separators (Vietnamese format)
 * @param vndPrice - Price in VND
 * @returns Formatted price string with VND suffix
 */
export function formatVND(vndPrice: number): string {
  return `${vndPrice.toLocaleString("vi-VN")} VND`;
}
