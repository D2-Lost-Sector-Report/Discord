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
    console.log("Fetching current lost sectors...");

    //get lost sectors for today
    const todaysData: CombinedData = await LostSectorAPI.fetchCurrent();
    const lostSectorComponents = createComponents(todaysData);
    await interaction.editReply({
      flags: MessageFlags.IsComponentsV2,
      components: lostSectorComponents,
    });
  } catch (err) {
    console.error(err);
    await interaction.editReply("Failed to fetch today's details.");
  }
}
