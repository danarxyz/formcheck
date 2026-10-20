import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * Project rules here encode decisions as code, so an agent breaking one gets
 * a lint error pointing at the reason — not a doc it might not have read.
 */
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/env.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "MemberExpression[object.name='process'][property.name='env']",
          message: "Read server config through serverEnv() in src/env.ts, which validates it.",
        },
      ],
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/packages/body-map/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react-body-highlighter",
              message: "ADR-0002: render muscles only through <BodyMap> from @/packages/body-map/BodyMap.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/packages/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/*", "@/components/*", "@/server/*", "@/auth/*"],
              message: "Packages are framework-free domain modules: they must not import app, UI, server or auth code.",
            },
            {
              group: ["react-body-highlighter"],
              message: "ADR-0002: only the body-map package may use the renderer.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/packages/body-map/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/*", "@/components/*", "@/server/*", "@/auth/*"],
              message: "Packages are framework-free domain modules: they must not import app, UI, server or auth code.",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "src/components/ui/**", "e2e/.auth/**"]),
]);

export default eslintConfig;
