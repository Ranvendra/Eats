import express from "express";
import { Routes } from "./utils/route.interface";
declare class App {
    app: express.Application;
    port: string | number;
    constructor(routes: Routes[]);
    startServer(): void;
    private initializeRoutes;
    private initializeMiddlewares;
    private connectDatabase;
}
export default App;
//# sourceMappingURL=app.d.ts.map