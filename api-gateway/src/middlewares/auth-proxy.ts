import proxy from "express-http-proxy";
import { Request } from "express";
import { logger } from "../utils/logger.js";

export const createProxy = (
  target: string,
  serviceName: string,
  addUserHeaders = false,
  parseBody = true
) => {
  return proxy(target, {
    parseReqBody: parseBody,
    proxyReqPathResolver: (req: Request) => {
      return req.originalUrl.replace("/v1", "/api");
    },

    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {

      if (addUserHeaders && srcReq.user) {
        proxyReqOpts.headers["x-user-id"] =
          srcReq.user.userId;
      }

      return proxyReqOpts;
    },

    userResDecorator: (proxyRes, proxyResData) => {
      logger.info(
        `Response received from ${serviceName}: ${proxyRes.statusCode}`
      );

      return proxyResData;
    },

    proxyErrorHandler: (err, res) => {
      logger.error(
        `${serviceName} proxy error: ${err.message}`
      );

      res.status(500).json({
        message: "Internal Server Error",
      });
    },
  });
};