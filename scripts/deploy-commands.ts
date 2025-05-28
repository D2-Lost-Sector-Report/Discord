import { deployCommands } from "../src/deploy-commands";

(async () => {
  try {
    const mode = process.argv[2];
    console.log(
      "Deploying Discord commands to guild or globally...",
      mode ? `Mode: ${mode}` : ""
    );
    await deployCommands(mode);
    console.log("Commands deployed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Failed to deploy commands:", err);
    process.exit(1);
  }
})();
