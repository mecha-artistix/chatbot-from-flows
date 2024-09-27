// utils/formatDate.js

/**
 * Format a date string to dd/mm/yyyy
 * @param {string} dateString "2024-09-09T11:59:51.678Z" - The date string to format
 * @returns {string} - The formatted date string
 */
export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}
