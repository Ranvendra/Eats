import express from "express";
import { Routes } from "./utils/route.interface";
import { connect } from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

class App {
  public app: express.Application;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = process.env.PORT || 8080;
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.connectDatabase();
  }

  public startServer() {
    this.app.listen(this.port, () => {
      console.log(`Server listening on http://localhost:${this.port}`);
    });
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(cookieParser());

    // Build allowed origins from ENV (covers localhost dev + deployed frontend)
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      process.env.LOCAL_FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:5174",
    ].filter(Boolean) as string[];

    this.app.use(
      cors({
        origin: allowedOrigins,
        credentials: true,
      })
    );
  }

  private async connectDatabase() {
    // Support both MONGODB_URI (standard) and MONGO_URI (legacy .env name)
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
      console.error("Database URI missing: set MONGODB_URI or MONGO_URI in .env");
      process.exit(1);
    }
    try {
      await connect(uri);
      console.log("Database connected...");
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
}

export default App;
