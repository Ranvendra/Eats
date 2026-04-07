import { Routes } from "../utils/route.interface";
import CartController from "../controllers/cart.controller";
declare class CartRoutes implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    cartController: CartController;
    constructor();
    private initializeRoutes;
}
export default CartRoutes;
//# sourceMappingURL=cart.routes.d.ts.map