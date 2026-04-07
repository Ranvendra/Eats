import { Request, Response } from "express";
declare class AuthController {
    private authService;
    handleSignup: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    handleLogin: (req: Request, res: Response) => Promise<void>;
    handleLogout: (req: Request, res: Response) => void;
    handleProfile: (req: Request | any, res: Response) => Promise<void>;
    handleProfileUpdate: (req: Request | any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
}
export default AuthController;
//# sourceMappingURL=auth.controller.d.ts.map