import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import audioRoutes from "./routes/audio.routes.js";
import attemptsRoutes from "./routes/attempts.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
 
const app = express();
app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(morgan("tiny"));
app.use(express.json());
 
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/v1/audio", audioRoutes);
app.use("/v1/attempts", attemptsRoutes);
app.use(errorHandler);
 
export default app;
