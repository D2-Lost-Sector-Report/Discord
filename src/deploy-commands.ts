import { REST, Routes } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST().setToken(config.DISCORD_TOKEN);

export async function deployCommands() {
  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands(config.DISCORD_CLIENT_ID), {
    body: commandsData,
  });
}
