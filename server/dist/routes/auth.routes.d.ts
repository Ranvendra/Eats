import { Routes } from "../utils/route.interface";
import AuthController from "../controllers/auth.controller";
declare class AuthRoutes implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    authController: AuthController;
    constructor();
    private initializeRoutes;
}
export default AuthRoutes;
//# sourceMappingURL=auth.routes.d.ts.map