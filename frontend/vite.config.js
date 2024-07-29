import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// Use the same port that backend api is running on
const SERVER_PORT = 3030;

export default defineConfig({
  server: {
    proxy: {
      "/api": { target: `http://localhost:${SERVER_PORT}` },
      "/static": { target: `http://localhost:${SERVER_PORT}` },
      "/ws": { target: `ws://localhost:${SERVER_PORT}`, ws: true },
    },
  },
  plugins: [react()],
});
