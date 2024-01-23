const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target:
        process.env.REACT_APP_ENVIRONMENT === "local"
          ? process.env.REACT_APP_BACKEND_URL
          : "http://server:3001", // Set your backend URL here
      changeOrigin: true,
    })
  );
};
