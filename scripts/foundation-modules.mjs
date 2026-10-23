import { readFileSync } from "node:fs";
import ts from "typescript";

// Test the actual TypeScript without adding a test runtime or generating files.
const cache = new Map();
export function foundationModule(name) {
  if (cache.has(name)) return cache.get(name);
  if (!["site-content", "composer", "site-analytics"].includes(name)) throw new Error(`Unexpected module: ${name}`);
  const source = readFileSync(new URL(`../src/lib/${name}.ts`, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const module = { exports: {} };
  const localRequire = path => foundationModule(path.replace(/^\.\//, ""));
  new Function("require", "module", "exports", outputText)(localRequire, module, module.exports);
  cache.set(name, module.exports);
  return module.exports;
}
