const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 50,
        },
        userEmail: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: function (v) {
                    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: (props) => `${props.value} is not a valid email!`,
            },
        },
        password: {
            type: String,
            required: true,
            minLength: 8,
        },
        userPhone: {
            type: String,
            required: true,
            unique: true,
            minLength: 10,
            maxLength: 15,
        },
        userAddress: {
            type: String,
            default: "",
        },
        userCity: {
            type: String,
            default: "",
        },
        profilePicture: {
            type: String,
            default: "", // URL to profile picture
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function () {
    const user = this;

    if (!user.isModified("password")) return;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
    } catch (err) {
        throw err;
    }
});

userSchema.methods.validatePassword = async function (passwordInput) {
    const user = this;
    const isMatch = await bcrypt.compare(passwordInput, user.password);
    return isMatch;
};

userSchema.methods.getJWT = function () {
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    return token;
};

module.exports = mongoose.model("User", userSchema);
