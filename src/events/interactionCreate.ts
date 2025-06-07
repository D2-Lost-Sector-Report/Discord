import { Events, MessageFlags, Collection, Client, Interaction } from "discord.js";
import { LostSectorAPI } from "../api/lostsector";
import { buildSectorComponents, disableSelectMenus } from "../helpers/embed";
import type { EventHandler } from "./types";

const handler: EventHandler<"interactionCreate"> = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction, client: Client, commands?: Collection<string, any>) {
    if (!commands) return;
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

      switch (interaction.customId.split("|")[0]) {
        case "select-sector-page": {
          const selected = interaction.values[0] as "information" | "rewards";
          const parts = interaction.customId.split("|");
          let sector;
          if (parts.length > 1) {
            sector = await LostSectorAPI.fetchByDate(parts[1]);
          } else {
            sector = await LostSectorAPI.fetchCurrent();
          }
          const components = buildSectorComponents(
            sector,
            selected,
            sector.date
          );
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
        try {
          await command.execute(interaction);
        } catch (error) {
          console.error("Error executing command", commandName, error);
        }
      }
    }
    if (interaction.isAutocomplete()) {
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if (command) {
        try {
          await command.autocomplete(interaction);
        } catch (error) {
          console.error("Error executing autocomplete", commandName, error);
        }
      }
    }
  },
};

export default handler; 