import { Request, Response } from "express";
declare class OrderController {
    placeOrder: (req: Request | any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getOrders: (req: Request | any, res: Response) => Promise<void>;
    updateOrderStatus: (req: Request | any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
}
export default OrderController;
//# sourceMappingURL=order.controller.d.ts.map