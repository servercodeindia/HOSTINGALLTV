import { build } from "vite";
import viteConfig from "../vite.config";
import path from "path";

async function runBuild() {
  console.log("Starting production build...");
  try {
    await build({
      ...viteConfig,
      build: {
        ...viteConfig.build,
        emptyOutDir: true,
      }
    });
    console.log("Build complete!");
    process.exit(0);
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

runBuild();
