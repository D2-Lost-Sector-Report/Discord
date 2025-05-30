import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { LostSectorAPI } from "../api/lostsector";

export const data = new SlashCommandBuilder()
  .setName("upcoming")
  .setDescription("Show the names of upcoming unique lost sectors.");

export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply();
  try {
    const upcoming = await LostSectorAPI.fetchUpcoming();
    const seen = new Set<string>();
    const uniqueNames: string[] = [];
    for (const sector of upcoming) {
      if (seen.has(sector.name)) break;
      seen.add(sector.name);
      uniqueNames.push(sector.name);
    }
    if (uniqueNames.length === 0) {
      await interaction.editReply("No upcoming lost sectors found.");
    } else {
      await interaction.editReply(
        `Upcoming lost sectors:\n${uniqueNames.join("\n")}`
      );
    }
  } catch (err) {
    console.error(err);
    await interaction.editReply("Failed to fetch upcoming lost sectors.");
  }
}
