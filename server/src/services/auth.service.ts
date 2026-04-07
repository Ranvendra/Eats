import User from "../models/User";

class AuthService {
  public async signupUser(userData: any) {
    const { userName, userEmail, password, userPhone } = userData;

    const user = new User({
      userName,
      userEmail,
      password,
      userPhone,
    });

    const savedUser = await user.save();
    return savedUser;
  }

  public async loginUser(identifier: string, passwordInput: string) {
    if (!identifier || !passwordInput) {
      throw new Error("Invalid credentials");
    }

    const user = await User.findOne({
      $or: [{ userEmail: identifier }, { userPhone: identifier }],
    });
    
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(passwordInput);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = await user.getJWT();
    return { user, token };
  }
}

export default AuthService;
