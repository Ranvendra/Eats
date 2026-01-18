const authService = require("../services/authService");
const { validateSignUpData } = require("../utils/validation");

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

        res.status(201).json({ message: "User added successfully!", data: user });
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
};

const handleLogin = async (req, res) => {
    try {
        const { userEmail, password } = req.body;
        const { user, token } = await authService.loginUser(userEmail, password);

        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000), // 8 hours
            httpOnly: true,
        });

        res.send({ message: "Login Successful!!", data: user });
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
};

module.exports = {
    handleSignup,
    handleLogin,
};
