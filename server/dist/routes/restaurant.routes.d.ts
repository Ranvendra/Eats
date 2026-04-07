import { Routes } from "../utils/route.interface";
import RestaurantController from "../controllers/restaurant.controller";
declare class RestaurantRoutes implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    restaurantController: RestaurantController;
    constructor();
    private initializeRoutes;
}
export default RestaurantRoutes;
//# sourceMappingURL=restaurant.routes.d.ts.map