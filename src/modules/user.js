/**
 * Retrieves current user from local storage
 *
 * @returns {Object|null} user object if it exists in local storage, otherwise null
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

/**
 * Save current user in local storage
 *
 * @param {Object} user - user object to be saved
 */
export const setCurrentUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};
