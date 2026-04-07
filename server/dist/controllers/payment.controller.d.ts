import { Request, Response } from "express";
declare class PaymentController {
    createOrder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    verifyPayment: (req: Request, res: Response) => Promise<void>;
}
export default PaymentController;
//# sourceMappingURL=payment.controller.d.ts.map