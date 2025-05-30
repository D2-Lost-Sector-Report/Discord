import { REST, Routes } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST().setToken(config.DISCORD_TOKEN);

async function deleteAllCommands(route: any, scope: string, isGlobal: boolean) {
  const existing = (await rest.get(route)) as any[];
  if (existing.length > 0) {
    console.log(`Deleting ${existing.length} existing ${scope} commands...`);
    for (const cmd of existing) {
      const deleteRoute = isGlobal
        ? Routes.applicationCommand(config.DISCORD_CLIENT_ID, cmd.id)
        : Routes.applicationGuildCommand(
            config.DISCORD_CLIENT_ID,
            config.DISCORD_GUILD_ID,
            cmd.id
          );
      await rest.delete(deleteRoute);
    }
    console.log(`All existing ${scope} commands deleted.`);
  } else {
    console.log(`No existing ${scope} commands to delete.`);
  }
}

async function registerCommands(route: any, commandsData: any, scope: string) {
  await rest.put(route, {
    body: commandsData,
  });
  console.log(`Registered new ${scope} commands.`);
}

export async function deployCommands(mode?: string) {
  const isProduction = mode === "--prod";
  if (isProduction) {
    // Register globally
    const route = Routes.applicationCommands(config.DISCORD_CLIENT_ID);
    console.log("--prod flag detected: Registering commands globally.");
    await deleteAllCommands(route, "global", true);
    // await registerCommands(route, commandsData, "global");
  } else {
    // Register to guild only
    const route = Routes.applicationGuildCommands(
      config.DISCORD_CLIENT_ID,
      config.DISCORD_GUILD_ID
    );
    console.log(
      "No --prod flag: Registering commands to guild " + config.DISCORD_GUILD_ID
    );
    await deleteAllCommands(route, "guild", false);
    await registerCommands(route, commandsData, "guild");
  }
}
