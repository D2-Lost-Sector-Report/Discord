import { Client, GatewayIntentBits, Events, Collection } from "discord.js";
import { config } from "./config";
import { commands as commandModules } from "./commands";
import { deployCommands } from "./deploy-commands";
import type { CommandInteraction, SlashCommandBuilder } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
});

type CommandModule = {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<any>;
};

const commands = new Collection<string, CommandModule>();
for (const commandName in commandModules) {
  if (Object.prototype.hasOwnProperty.call(commandModules, commandName)) {
    // @ts-expect-error: commandModules is imported as any, but we know the structure
    commands.set(commandName, commandModules[commandName]);
  }
}

client.once(Events.ClientReady, () => {
  console.log(`Bot is connected as ${client.user!.tag}!`);

  deployCommands()
    .then(() => {
      console.log("Registered commands successfully!");
    })
    .catch((error) => {
      console.error("Failed to register commands:", error);
    });
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }
  const { commandName } = interaction;
  const command = commands.get(commandName);
  if (command) {
    await command.execute(interaction);
  }
});

client
  .login(config.DISCORD_TOKEN)
  .then(() => {
    console.log("Logged in successfully!");
  })
  .catch((error) => {
    console.error("Failed to log in:", error);
  });

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});
