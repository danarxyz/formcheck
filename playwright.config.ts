import { defineConfig, devices } from "@playwright/test";
import { E2E_ENV } from "./e2e/env";

const PORT = 3100;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  globalSetup: "./e2e/global-setup.ts",
  use: {
    baseURL: `http://localhost:${PORT}`,
    storageState: "e2e/.auth/owner.json",
    trace: "retain-on-failure",
    // Optional override for sandboxes with a preinstalled Chromium.
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined },
  },
  // The app is used on a phone at the gym, so the smoke test runs at phone size.
  projects: [{ name: "mobile", use: { ...devices["Pixel 7"] } }],
  webServer: {
    command: `pnpm build && pnpm start --port ${PORT}`,
    url: `http://localhost:${PORT}/sign-in`,
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
    env: E2E_ENV,
  },
});
