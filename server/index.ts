import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";

const app = express();
const httpServer = createServer(app);

// ---- RAW BODY SUPPORT ----
declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// ---- LOGGER ----
export function log(message: string, source = "express") {
  const time = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${time} [${source}] ${message}`);
}

// ---- REQUEST LOGGING ----
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let captured: any;

  const originalJson = res.json.bind(res);
  res.json = (body: any) => {
    captured = body;
    return originalJson(body);
  };

  res.on("finish", () => {
    if (path.startsWith("/api")) {
      const ms = Date.now() - start;
      log(`${req.method} ${path} ${res.statusCode} ${ms}ms`);
    }
  });

  next();
});

// ---- BOOTSTRAP ----
(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    res.status(status).json({ message: err.message || "Server error" });
    console.error(err);
  });

  // DEV = Vite | PROD = static
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ---- WINDOWS-SAFE LISTEN ----
  const port = Number(process.env.PORT || 5000);
  httpServer.listen(port, () => {
    log(`serving on port ${port}`);
  });
})();
