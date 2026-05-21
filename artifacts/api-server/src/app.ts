import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import { logger } from "./lib/logger";
import { authMiddleware } from "./middlewares/authMiddleware";
import router from "./routes/index";
import { registerRoutes } from "./routes";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(authMiddleware);

app.use("/api", router);

// Register all BlueScrubsPrep routes (async init at startup)
registerRoutes(app).catch((err) => {
  logger.error({ err }, "Failed to register routes");
  process.exit(1);
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const status = (err as { status?: number; statusCode?: number })?.status
    ?? (err as { statusCode?: number })?.statusCode
    ?? 500;
  const message = (err as Error)?.message ?? "Internal Server Error";
  res.status(status).json({ message });
});

export default app;
