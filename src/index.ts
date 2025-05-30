import {
  Client,
  GatewayIntentBits,
  Events,
  Collection,
  MessageFlags,
} from "discord.js";
import { config } from "./config";
import { commands as commandModules } from "./commands";
import type {
  AutocompleteInteraction,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { LostSectorAPI } from "./api/lostsector";
import { buildSectorComponents, disableSelectMenus } from "./helpers/embed";
import { populateRewardsList } from "./api/lostsector";

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
  autocomplete: (interaction: AutocompleteInteraction) => Promise<any>;
};

const commands = new Collection<string, CommandModule>();
for (const commandName in commandModules) {
  if (Object.prototype.hasOwnProperty.call(commandModules, commandName)) {
    // @ts-expect-error: commandModules is imported as any, but we know the structure
    commands.set(commandName, commandModules[commandName]);
  }
}

client.once(Events.ClientReady, async () => {
  console.log(`Bot is connected as ${client.user!.tag}!`);
  await populateRewardsList();
  console.log("Rewards list loaded.");
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isStringSelectMenu()) {
    const originalUserId = interaction.message.interactionMetadata?.user.id;
    if (originalUserId && interaction.user.id !== originalUserId) {
      await interaction.reply({
        content:
          "You cannot interact with this menu because you did not create it, run the command yourself to manipulate the menu.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const originalTimestamp = interaction.message.createdTimestamp;
    if (originalTimestamp && Date.now() - originalTimestamp > 1000 * 60 * 5) {
      await interaction.reply({
        content:
          "This menu has expired, please run the command yourself to manipulate the menu.",
        flags: MessageFlags.Ephemeral,
      });

      await interaction.message.edit({
        components: disableSelectMenus(interaction.message.components),
      });
      return;
    }

    switch (interaction.customId) {
      case "select-sector-page": {
        const selected = interaction.values[0] as "information" | "rewards";
        const sector = await LostSectorAPI.fetchCurrent();
        const components = buildSectorComponents(sector, selected, client);
        await interaction.update({ components });
        return;
      }
      default:
        return;
    }
  }
  if (interaction.isChatInputCommand()) {
    const { commandName } = interaction;
    const command = commands.get(commandName);
    if (command) {
      await command.execute(interaction);
    }
  }
  if (interaction.isAutocomplete()) {
    const { commandName } = interaction;
    const command = commands.get(commandName);
    if (command) {
      try {
        await command.autocomplete(interaction);
      } catch (error) {
        console.error(error);
      }
    }
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
