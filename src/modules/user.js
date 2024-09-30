/**
 * Retrieves current user from local storage
 *
 * @returns {Object|null} user object if it exists in local storage, otherwise null
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch (error) {
    console.error("Failed to parse user data from localStorage:", error);
    return null;
  }
};

/**
 * Save current user in local storage
 *
 * @param {Object} user - user object to be saved
 */
export const setCurrentUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

/**
 * Removes current user from local storage
 */
export const removeCurrentUser = () => {
  localStorage.removeItem("user");
};
