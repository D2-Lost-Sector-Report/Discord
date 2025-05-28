import { SlashCommandBuilder, CommandInteraction, MessageFlags } from "discord.js";
import { createSectorComponents } from "../helpers/embed";

export const data = new SlashCommandBuilder()
  .setName("current")
  .setDescription("Show the currently active lost sector as JSON.");

export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply();
  try {
    const components = await createSectorComponents();
    await interaction.editReply({
      flags: MessageFlags.IsComponentsV2,
      components: components,
    });
  } catch (err) {
    console.error(err);
    await interaction.editReply("Failed to fetch current lost sector.");
  }
} 