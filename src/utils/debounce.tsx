/**
 * debounce - Utility function
 *
 * @param {Function} func - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - A debounced version of the function
 */
export function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    // Preserve 'this' context for methods
    const context = this;

    // Clear previous timer
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new timer
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}
