import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  userName: string;
  userEmail: string;
  password?: string;
  userPhone: string;
  userAddress: string;
  userCity: string;
  nickName: string;
  gender: string;
  country: string;
  language: string;
  timeZone: string;
  profilePicture: string;
  validatePassword(passwordInput: string): Promise<boolean>;
  getJWT(): string;
}

/**
 * User Schema Definition
 * Handles user profile data, authentication credentials, and session generation.
 */
const userSchema = new Schema<IUser>(
  {
    userName: { type: String, required: true, minlength: 3, maxlength: 50 },
    userEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: { type: String, required: true, minlength: 8 },
    userPhone: { type: String, required: true, unique: true, minlength: 10, maxlength: 15 },
    userAddress: { type: String, default: "" },
    userCity: { type: String, default: "" },
    nickName: { type: String, default: "" },
    gender: { type: String, default: "" },
    country: { type: String, default: "" },
    language: { type: String, default: "" },
    timeZone: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  const user = this as mongoose.Document & IUser;
  if (!user.isModified("password")) return;

  try {
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  } catch (err) {
    throw err;
  }
});

userSchema.methods.validatePassword = async function (passwordInput: string) {
  const user = this;
  const isMatch = await bcrypt.compare(passwordInput, user.password as string);
  return isMatch;
};

userSchema.methods.getJWT = function () {
  const user = this;
  const secret = process.env.JWT_SECRET || "default_secret";
  const token = jwt.sign({ _id: user._id }, secret, {
    expiresIn: "7d",
  });
  return token;
};

export default mongoose.model<IUser>("User", userSchema);
