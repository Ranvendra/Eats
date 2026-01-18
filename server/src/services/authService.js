const User = require("../models/User");

const signupUser = async (userData) => {
    const { userName, userEmail, password, userPhone } = userData;
    // Duplicate checks usually handled by DB constraints or explicit check here if needed.
    // We'll rely on DB unique constraints for now, or you can add explicit check:
    // const existingUser = await User.findOne({userEmail}); if(existingUser) throw new Error("User already exists");

    const user = new User({
        userName,
        userEmail,
        password,
        userPhone,
    });

    const savedUser = await user.save();
    return savedUser;
};

const loginUser = async (identifier, password) => {
    if (!identifier || !password) {
        throw new Error("Invalid credentials");
    }

    const user = await User.findOne({
        $or: [{ userEmail: identifier }, { userPhone: identifier }],
    });
    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }

    const token = await user.getJWT();
    return { user, token };
};

module.exports = {
    signupUser,
    loginUser,
};
