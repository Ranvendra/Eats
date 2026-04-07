import { Request, Response } from "express";
declare class RestaurantController {
    getAllRestaurants: (req: Request, res: Response) => Promise<void>;
    getRestaurantById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getRestaurantMenu: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
}
export default RestaurantController;
//# sourceMappingURL=restaurant.controller.d.ts.map