import { Routes } from "../utils/route.interface";
import OrderController from "../controllers/order.controller";
declare class OrderRoutes implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    orderController: OrderController;
    constructor();
    private initializeRoutes;
}
export default OrderRoutes;
//# sourceMappingURL=order.routes.d.ts.map