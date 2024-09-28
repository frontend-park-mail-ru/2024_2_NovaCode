export const isValidEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9_.]+@[a-zA-Z0-9]+\.[a-zA-Z.]+$/;
    return (emailPattern.test(email));
}

export const isValidUsername = (username) => {
    const usernamePattern = /^[a-zA-Z0-9_.]+$/;
    return (usernamePattern.test(username));
}

export const isValidPassword = (password) => {
    const passwordPattern = /^[a-zA-Z0-9_.]+$/;
    return (passwordPattern.test(password));
}