import App from "./app";
import AuthRoutes from "./routes/auth.routes";
import CartRoutes from "./routes/cart.routes";
import OrderRoutes from "./routes/order.routes";
import PaymentRoutes from "./routes/payment.routes";
import RestaurantRoutes from "./routes/restaurant.routes";
import "dotenv/config";

const app = new App([
  new AuthRoutes(),
  new CartRoutes(),
  new OrderRoutes(),
  new PaymentRoutes(),
  new RestaurantRoutes()
]);

app.startServer();
