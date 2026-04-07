import { Request, Response } from "express";
declare class CartController {
    getCart: (req: Request | any, res: Response) => Promise<void>;
    syncCart: (req: Request | any, res: Response) => Promise<void>;
    clearCart: (req: Request | any, res: Response) => Promise<void>;
}
export default CartController;
//# sourceMappingURL=cart.controller.d.ts.map