import {
  SlashCommandBuilder,
  CommandInteraction,
  MessageFlags,
  TextDisplayBuilder,
} from "discord.js";
import {
  createFooterLinks,
  createSectorPageComponents,
} from "../helpers/embed";
import { LostSectorAPI } from "../api/lostsector";

export const data = new SlashCommandBuilder()
  .setName("next-armor")
  .setDescription("Get the next day when Rahool will focus a selected armor type for free.")
  .addStringOption((option) =>
    option
      .setName("armor")
      .setDescription("The armor type to check")
      .setRequired(true)
      .addChoices(
        { name: "Helmet", value: "Helmet" },
        { name: "Arms", value: "Arms" },
        { name: "Chest", value: "Chest" },
        { name: "Legs", value: "Legs" }
      )
  );

export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply();

  const armor = interaction.options.get("armor")?.value as string;
  if (!armor) {
    await interaction.editReply("No armor type provided");
    return;
  }

  try {
    const upcoming = await LostSectorAPI.fetchUpcoming();
    for (const sector of upcoming) {
      if (sector.rahool === armor) {
        const fullSector = await LostSectorAPI.fetchByDate(sector.date);
        const summaryComponent = new TextDisplayBuilder().setContent(
          `Rahool will next focus **${armor}** on **${sector.date.split("T")[0]}**. The Lost Sector will be:`
        );
        const components = [
          summaryComponent,
          ...createSectorPageComponents(fullSector, "information"),
          createFooterLinks(),
        ];
        await interaction.editReply({
          flags: MessageFlags.IsComponentsV2,
          components,
        });
        return;
      }
    }
    await interaction.editReply(
      `No upcoming days found for **${armor}** focussing.`
    );
  } catch (err) {
    console.error(err);
    await interaction.editReply("Failed to fetch upcoming lost sectors.");
  }
}