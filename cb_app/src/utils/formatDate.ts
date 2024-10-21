// utils/formatDate.js

/**
 * Format a date string to dd/mm/yyyy
 * @param {string} dateString "2024-09-09T11:59:51.678Z" - The date string to format
 * @param { includeTime } "true | false" -  wether or not time is required in the output
 * @returns {string} - The formatted date string
 */

export function formatDate(dateString: string, includeTime: boolean = false) {
  const date = new Date(dateString);

  // Extract date components
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = String(date.getFullYear()).slice(-2);

  // Format date part as dd/mm/yy
  let formattedDate = `${day}/${month}/${year}`;

  if (includeTime) {
    // Extract time components
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Append time as hr:min
    formattedDate += ` ${hours}:${minutes}`;
  }

  return formattedDate;
}

// export function formatDate(dateString: string) {
//   const date = new Date(dateString);
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
//   const year = date.getFullYear();
//   return `${year}-${month}-${day}`;
// }
