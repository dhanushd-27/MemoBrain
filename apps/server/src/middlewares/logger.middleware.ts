import type { Request, Response, NextFunction } from "express";

/**
 * Logger middleware to log all incoming requests and their responses
 */
export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  // Log incoming request
  console.log("\n🔵 Incoming Request:");
  console.log(`  Timestamp: ${timestamp}`);
  console.log(`  Method: ${req.method}`);
  console.log(`  Path: ${req.path}`);
  console.log(`  URL: ${req.originalUrl}`);
  console.log(`  IP: ${req.ip}`);
  console.log(`  User-Agent: ${req.get("user-agent") || "N/A"}`);

  // Log request body if present
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`  Body:`, JSON.stringify(req.body, null, 2));
  }

  // Log query parameters if present
  if (req.query && Object.keys(req.query).length > 0) {
    console.log(`  Query:`, JSON.stringify(req.query, null, 2));
  }

  // Capture the original res.json and res.send methods
  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);

  // Override res.json to log response
  res.json = function (body: any) {
    logResponse(body);
    return originalJson(body);
  };

  // Override res.send to log response
  res.send = function (body: any) {
    logResponse(body);
    return originalSend(body);
  };

  // Function to log response details
  const logResponse = (body: any) => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    console.log("\n🟢 Outgoing Response:");
    console.log(`  Method: ${req.method}`);
    console.log(`  Path: ${req.path}`);
    console.log(`  Status: ${statusCode} ${getStatusText(statusCode)}`);
    console.log(`  Duration: ${duration}ms`);

    // Log response body (truncate if too large)
    if (body) {
      const bodyStr = typeof body === "string" ? body : JSON.stringify(body);
      const truncatedBody =
        bodyStr.length > 500 ? bodyStr.substring(0, 500) + "..." : bodyStr;
      console.log(`  Response:`, truncatedBody);
    }

    console.log("─".repeat(80));
  };

  // Handle response finish event for cases where json/send aren't called
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Only log if we haven't already logged (json/send weren't called)
    if (!res.headersSent || res.writableEnded) {
      console.log("\n🟡 Response Finished:");
      console.log(`  Method: ${req.method}`);
      console.log(`  Path: ${req.path}`);
      console.log(`  Status: ${statusCode} ${getStatusText(statusCode)}`);
      console.log(`  Duration: ${duration}ms`);
      console.log("─".repeat(80));
    }
  });

  next();
};

/**
 * Helper function to get human-readable status text
 */
function getStatusText(statusCode: number): string {
  if (statusCode >= 200 && statusCode < 300) return "✓ Success";
  if (statusCode >= 300 && statusCode < 400) return "↻ Redirect";
  if (statusCode >= 400 && statusCode < 500) return "⚠ Client Error";
  if (statusCode >= 500) return "✗ Server Error";
  return "";
}
