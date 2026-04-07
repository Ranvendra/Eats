import { Routes } from "../utils/route.interface";
import PaymentController from "../controllers/payment.controller";
declare class PaymentRoutes implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    paymentController: PaymentController;
    constructor();
    private initializeRoutes;
}
export default PaymentRoutes;
//# sourceMappingURL=payment.routes.d.ts.map