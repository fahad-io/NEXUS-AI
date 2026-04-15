// NOTE: This is the legacy standalone pipeline (3 stages: API analysis → test generation → Playwright code).
// It calls the Anthropic API directly and runs outside Claude Code.
// The primary pipeline is now /pipeline-start via Claude Code, which runs all 5 stages
// using the agents in .claude/agents/ and writes artifacts to .claude/context/.
// This file is kept as a fallback for CI/CD environments where Claude Code is not available.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

function ensureFile(filePath, label) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${label} not found: ${filePath}`);
  }
}

function loadEnvFile(rootDir) {
  const envPath = path.join(rootDir, ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }

  const envLines = fs.readFileSync(envPath, "utf-8").split(/\r?\n/);
  for (const rawLine of envLines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function getModelConfig() {
  const apiKey =
    process.env.CLAUDE_API_KEY ||
    process.env.ANTHROPIC_API_KEY ||
    process.env.MODEL_API_KEY;
  const baseUrl =
    process.env.CLAUDE_BASE_URL ||
    process.env.ANTHROPIC_BASE_URL ||
    process.env.MODEL_BASE_URL ||
    "https://api.anthropic.com";
  const model =
    process.env.CLAUDE_MODEL ||
    process.env.ANTHROPIC_MODEL ||
    process.env.MODEL_NAME ||
    "claude-sonnet-4-6";
  const apiVersion = process.env.ANTHROPIC_VERSION || "2023-06-01";

  if (!apiKey) {
    throw new Error(
      "Missing API key. Set CLAUDE_API_KEY, ANTHROPIC_API_KEY, or MODEL_API_KEY in your shell or repo-root .env file.",
    );
  }

  return {
    apiKey,
    baseUrl: baseUrl.replace(/\/+$/, ""),
    model,
    apiVersion,
  };
}

async function callModel({ system, user }) {
  const { apiKey, baseUrl, model, apiVersion } = getModelConfig();
  const response = await fetch(`${baseUrl}/v1/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": apiVersion,
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Model API request failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data?.content
    ?.filter((block) => block?.type === "text")
    .map((block) => block.text)
    .join("\n\n");
  if (!content) {
    throw new Error("Model API returned no message content.");
  }

  return content;
}

async function runAgent(input, skillFile) {
  ensureFile(skillFile, "Skill file");
  const skill = fs.readFileSync(skillFile, "utf-8");

  return callModel({
    system: skill,
    user: input,
  });
}

function writeOutput(outputDir, fileName, content) {
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, fileName);
  fs.writeFileSync(outputPath, content, "utf-8");
  return outputPath;
}

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const rootDir = __dirname;
  const inputFile = path.join(rootDir, "input-code.txt");
  const outputDir = path.join(rootDir, "agent-output");
  const skillsDir = path.join(rootDir, "skills");

  loadEnvFile(rootDir);
  ensureFile(inputFile, "Input file");

  const code = fs.readFileSync(inputFile, "utf-8");
  const apiSkill = path.join(skillsDir, "api.md");
  const testSkill = path.join(skillsDir, "test-generator.md");
  const playwrightSkill = path.join(skillsDir, "playwright.md");

  const apiSpec = await runAgent(code, apiSkill);
  const testPlan = await runAgent(apiSpec, testSkill);
  const playwrightTests = await runAgent(testPlan, playwrightSkill);

  const apiPath = writeOutput(outputDir, "01-api-spec.txt", apiSpec);
  const testPath = writeOutput(outputDir, "02-test-plan.txt", testPlan);
  const playwrightPath = writeOutput(outputDir, "03-playwright-tests.txt", playwrightTests);

  console.log("Pipeline complete.");
  console.log(`API stage: ${apiPath}`);
  console.log(`Test stage: ${testPath}`);
  console.log(`Playwright stage: ${playwrightPath}`);
}

main().catch((error) => {
  console.error(`Pipeline failed: ${error.message}`);
  process.exit(1);
});
