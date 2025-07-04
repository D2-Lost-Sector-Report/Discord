import {
  SlashCommandBuilder,
  CommandInteraction,
  MessageFlags,
} from "discord.js";
import { LostSectorAPI } from "../api/lostsector";
import { buildSectorComponents } from "../helpers/embed";

export const data = new SlashCommandBuilder()
  .setName("current")
  .setDescription("Show the currently active Lost Sector.");

export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply();
  try {
    const sector = await LostSectorAPI.fetchCurrent();
    const components = buildSectorComponents(sector, "information");
    await interaction.editReply({
      flags: MessageFlags.IsComponentsV2,
      components,
    });
  } catch (err) {
    console.error(err);
    await interaction.editReply("Failed to fetch current lost sector.");
  }
}
