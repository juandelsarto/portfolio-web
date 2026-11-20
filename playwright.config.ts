import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },
  // Capturas de referencia por proyecto. Se generan en el CI (Linux): ver CLAUDE.md.
  snapshotPathTemplate: "{testDir}/__screenshots__/{projectName}/{arg}{ext}",
  projects: [
    {
      name: "chromium",
      testIgnore: /skins\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    // CI de skins: misma suite en 1440 y 390 px.
    {
      name: "skins-desktop",
      testMatch: /skins\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "skins-mobile",
      testMatch: /skins\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 390, height: 844 },
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: `pnpm build && pnpm start --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
