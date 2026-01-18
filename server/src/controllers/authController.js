const authService = require("../services/authService");
const { validateSignUpData, validateLoginData } = require("../utils/validation");

const handleSignup = async (req, res) => {
    try {
        validateSignUpData(req);

        const { userName, userEmail, password, userPhone } = req.body;
        const user = await authService.signupUser({
            userName,
            userEmail,
            password,
            userPhone,
        });

        // Sanitize user data before sending response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({ message: "User added successfully!", data: userResponse });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const handleLogin = async (req, res) => {
    try {
        validateLoginData(req);

        const { identifier, password } = req.body;
        const { user, token } = await authService.loginUser(identifier, password);

        // Sanitize user data
        const userResponse = user.toObject();
        delete userResponse.password;

        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000), // 8 hours
            httpOnly: true,
        });

        res.json({ message: "Login Successful!!", data: userResponse });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const handleLogout = (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.json({ message: "Logout Successful!!" });
};

const handleProfile = async (req, res) => {
    try {
        const user = req.user;
        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({ message: "Profile fetched successfully", data: userResponse });
    } catch (err) {
        res.status(400).json({ message: "Error fetching profile: " + err.message });
    }
};

module.exports = {
    handleSignup,
    handleLogin,
    handleLogout,
    handleProfile,
};
