import { Client, GatewayIntentBits, Events, Collection, MessageFlags } from "discord.js";
import { config } from "./config";
import { commands as commandModules } from "./commands";
import type { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { LostSectorAPI } from "./api/lostsector";
import {
  createSectorPageComponents,
  createSectorSelectRow,
} from "./helpers/embed";

export const client = new Client({
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
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isStringSelectMenu()) {
    switch (interaction.customId) {
      case "select-sector-page": {
        const originalUserId = interaction.message.interactionMetadata?.user.id;
        if (originalUserId && interaction.user.id !== originalUserId) {
          await interaction.reply({
            content: "You cannot interact with this menu because you did not create it, run the command yourself to manipulate the menu.",
            flags: MessageFlags.Ephemeral,
          });
          return;
        }
        const selected = interaction.values[0] as "information" | "rewards";
        const sector = await LostSectorAPI.fetchCurrent();
        const components = [
          ...createSectorPageComponents(sector, selected),
          createSectorSelectRow(selected),
        ];
        await interaction.update({ components });
        return;
      }
      default:
        return;
    }
  }
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
