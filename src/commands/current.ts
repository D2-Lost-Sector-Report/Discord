import {
  SlashCommandBuilder,
  CommandInteraction,
  MessageFlags,
} from "discord.js";
import { CombinedData, LostSectorAPI } from "../api/lostsector";
import { createComponents } from "../helpers/embed";

export const data = new SlashCommandBuilder()
  .setName("current")
  .setDescription("Show today's Solo Ops and World Lost Sectors.");

export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply();
  try {
    //get lost sectors for today
    const todaysData: CombinedData = await LostSectorAPI.fetchCurrent();
    const components = await createComponents(todaysData);
    await interaction.editReply({
      flags: MessageFlags.IsComponentsV2,
      components
    });
  } catch (err) {
    console.error(err);
    await interaction.editReply("Failed to fetch today's details.");
  }
}
