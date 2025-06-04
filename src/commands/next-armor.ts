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
  .setDescription("Get the next sector to focus a selected armor piece.")
  .addStringOption((option) =>
    option
      .setName("armor")
      .setDescription("The armor piece to check")
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
    await interaction.editReply("No armor piece provided");
    return;
  }

  try {
    const upcoming = await LostSectorAPI.fetchUpcoming();
    for (const sector of upcoming) {
      if (sector.rahool === armor) {
        const fullSector = await LostSectorAPI.fetchByDate(sector.date);
        const summaryComponent = new TextDisplayBuilder().setContent(
          `The next Lost Sector to focus **${armor}** is on **${sector.date.split("T")[0]}**.`
        );
        const components = [
          summaryComponent,
          ...createSectorPageComponents(
            fullSector,
            "information",
            interaction.client
          ),
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
      `No upcoming lost sector found for **${armor}** focus.`
    );
  } catch (err) {
    console.error(err);
    await interaction.editReply("Failed to fetch upcoming lost sectors.");
  }
}
