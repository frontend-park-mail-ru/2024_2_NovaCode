/**
 * Validates if the provided email is in a valid format.
 * 
 * @param {string} email - The email address to validate.
 * @returns {boolean} Returns true if the email is valid, otherwise false.
 */
export const isValidEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9_.]+@[a-zA-Z0-9]+\.[a-zA-Z.]+$/;
    return (emailPattern.test(email));
}

/**
 * Validates if the provided username contains only valid characters (letters, numbers, underscores, and dots).
 * 
 * @param {string} username - The username to validate.
 * @returns {boolean} Returns true if the username is valid, otherwise false.
 */

export const isValidUsername = (username) => {
    const usernamePattern = /^[a-zA-Z0-9_.]+$/;
    return (usernamePattern.test(username));
}

/**
 * Validates if the provided password contains only valid characters (letters, numbers and underscores).
 * 
 * @param {string} password - The password to validate.
 * @returns {boolean} Returns true if the password is valid, otherwise false.
 */
export const isValidPassword = (password) => {
    const passwordPattern = /^[a-zA-Z0-9_]+$/;
    return (passwordPattern.test(password));
}