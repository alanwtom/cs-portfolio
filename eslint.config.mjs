/*
  ESLint 9 flat config.

  This replaces the old `.eslintrc.json`. ESLint 9 stopped reading that
  filename by default, so for a while `npx eslint .` here just errored out
  and nothing was actually being linted — including, embarrassingly, work
  done by AI agents on this repo.

  `eslint-config-next` v16 exports real flat configs (arrays of config
  objects), so there's no need for the `FlatCompat` shim that older
  Next-plus-ESLint-9 setups had to use. Spreading them is enough.
*/
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
      "tsconfig.tsbuildinfo",
      ".vercel/**",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
];

export default config;
