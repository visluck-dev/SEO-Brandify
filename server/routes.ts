import type { Express } from "express";
import type { Server } from "http";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // All content is static, served via static files
  // No dynamic routes needed
  
  return httpServer;
}
