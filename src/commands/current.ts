import {
  SlashCommandBuilder,
  CommandInteraction,
  MessageFlags,
} from "discord.js";
import { LostSectorAPI, LostSectors } from "../api/lostsector";
import { buildSectorComponents } from "../helpers/embed";

export const data = new SlashCommandBuilder()
  .setName("current")
  .setDescription("Show the currently active Lost Sectors.");

export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply();
  try {
  const data: LostSectors = await LostSectorAPI.fetchCurrent();
  const components = buildSectorComponents(data.lostSectors);
    await interaction.editReply({
      flags: MessageFlags.IsComponentsV2,
      components: Array.isArray(components) ? components : Object.values(components),
    });
  } catch (err) {
    console.error(err);
    await interaction.editReply("Failed to fetch current lost sectors.");
  }
}