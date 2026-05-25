import proxy from "express-http-proxy";
import { Request } from "express";
import { logger } from "../utils/logger.js";

export const authProxy = proxy(process.env.IDENTITY_SERVICE_URL!, {

  proxyReqPathResolver: (req: Request) => {
    return req.originalUrl.replace("/v1", "/api");
  },

  proxyReqOptDecorator: (proxyReqOpts) => {
    proxyReqOpts.headers["content-type"] = "application/json";

    return proxyReqOpts;
  },

  userResDecorator: (proxyRes, proxyResData) => {
    logger.info(
      `Response received for Identity Service ${proxyRes.statusCode}`
    );

    return proxyResData;
  },

  proxyErrorHandler: (err, res) => {
    logger.error(`Proxy error : ${err.message}`);

    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  },
});