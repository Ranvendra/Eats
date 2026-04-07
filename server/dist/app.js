"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
class App {
    app;
    port;
    constructor(routes) {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || 8080;
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.connectDatabase();
    }
    startServer() {
        this.app.listen(this.port, () => {
            console.log(`Server listening on http://localhost:${this.port}`);
        });
    }
    initializeRoutes(routes) {
        routes.forEach((route) => {
            this.app.use("/", route.router);
        });
    }
    initializeMiddlewares() {
        this.app.use(express_1.default.json());
        this.app.use((0, cookie_parser_1.default)());
        // Build allowed origins from ENV (covers localhost dev + deployed frontend)
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            process.env.LOCAL_FRONTEND_URL,
            "http://localhost:5173",
            "http://localhost:5174",
        ].filter(Boolean);
        this.app.use((0, cors_1.default)({
            origin: allowedOrigins,
            credentials: true,
        }));
    }
    async connectDatabase() {
        // Support both MONGODB_URI (standard) and MONGO_URI (legacy .env name)
        const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
        if (!uri) {
            console.error("Database URI missing: set MONGODB_URI or MONGO_URI in .env");
            process.exit(1);
        }
        try {
            await (0, mongoose_1.connect)(uri);
            console.log("Database connected...");
        }
        catch (err) {
            console.error(err);
            process.exit(1);
        }
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map