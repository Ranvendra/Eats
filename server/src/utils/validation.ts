import validator from "validator";
import { Request } from "express";

export const validateSignUpData = (req: Request) => {
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

export const validateLoginData = (req: Request) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    throw new Error("All fields are required");
  }

  const isEmail = validator.isEmail(identifier);
  const isPhone = validator.isMobilePhone(identifier, "any", { strictMode: false });

  if (!isEmail && !isPhone) {
    throw new Error("Please enter a valid Email or Phone Number");
  }
};
