import { SlashCommandBuilder, CommandInteraction, codeBlock } from "discord.js";
import { LostSectorAPI } from "../api/lostsector";

export const data = new SlashCommandBuilder()
  .setName("current")
  .setDescription("Show the currently active lost sector as JSON.");

export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply();
  try {
    const current = await LostSectorAPI.fetchCurrent();
    await interaction.editReply({
      content: codeBlock("json", JSON.stringify(current, null, 2)),
    });
  } catch (err) {
    console.error(err);
    await interaction.editReply("Failed to fetch current lost sector.");
  }
} 