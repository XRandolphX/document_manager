import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Resolver importación de react-dom/client para React 18+
      'react-dom/client': 'react-dom',
    },
  },
});
