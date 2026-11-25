import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import cloudinaryAssetsHandler from "./api/cloudinary-assets.js";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, env);

  return {
    plugins: [
      react(),
      {
        name: "local-cloudinary-api",
        configureServer(server) {
          server.middlewares.use("/api/cloudinary-assets", (req, res) => {
            return cloudinaryAssetsHandler(req, res);
          });
        },
      },
    ],
  };
});