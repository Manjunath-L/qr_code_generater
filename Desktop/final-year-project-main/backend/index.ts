import express, { type Request, Response, NextFunction } from "express";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { registerRoutes } from "./routes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });
  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error(`Server error: ${message}`);
    res.status(status).json({ message });
  });

  // Frontend and backend are intentionally separated for deployment/submission.
  // Backend serves only API routes.

  const host = "0.0.0.0";
  const basePort = Number(process.env.PORT ?? 5000);

  const listenWithFallback = (port: number, retriesLeft: number) => {
    server.once("error", (err: any) => {
      if (err?.code === "EADDRINUSE" && retriesLeft > 0) {
        const nextPort = port + 1;
        log(`port ${port} in use, trying ${nextPort}`);
        listenWithFallback(nextPort, retriesLeft - 1);
        return;
      }
      throw err;
    });

    server.listen({ port, host }, () => {
      log(`serving on port ${port}`);
    });
  };

  // Try PORT (or 5000), then a few fallbacks.
  listenWithFallback(basePort, 10);
})();
