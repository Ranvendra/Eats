const validator = require("validator");

const validateSignUpData = (req) => {
    const { userName, userEmail, password, userPhone } = req.body;

    if (!userName || !userEmail || !password || !userPhone) {
        throw new Error("All fields are required");
    } else if (!validator.isEmail(userEmail)) {
        throw new Error("Email ID is not valid");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error(
            "Password must be strong (min 8 chars, 1 lowercase, 1 uppercase, 1 symbol)"
        );
    }
};

const validateLoginData = (req) => {
    const { userEmail, password } = req.body;

    if (!userEmail || !password) {
        throw new Error("All fields are required");
    } else if (!validator.isEmail(userEmail)) {
        throw new Error("Email ID is not valid");
    }
};

module.exports = { validateSignUpData, validateLoginData };
