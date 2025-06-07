import {
  SlashCommandBuilder,
  CommandInteraction,
  MessageFlags,
} from "discord.js";
import { LostSectorAPI } from "../api/lostsector";
import {
  createUpcomingSectorsComponent,
  buildSectorComponents,
} from "../helpers/embed";

export const data = new SlashCommandBuilder()
  .setName("upcoming")
  .setDescription("Show the names of upcoming unique lost sectors.")
  .addStringOption((option) =>
    option
      .setName("sector")
      .setDescription("Select a specific lost sector")
      .setRequired(false)
      .setAutocomplete(true)
  );

export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply();
  try {
    const sectorName = interaction.options.get("sector")?.value as
      | string
      | undefined;
    const upcoming = await LostSectorAPI.fetchUpcoming();
    if (sectorName) {
      const sector = upcoming.find(
        (s) => s.name.toLowerCase() === sectorName.toLowerCase()
      );
      if (!sector) {
        await interaction.editReply(
          `No upcoming lost sector found for **${sectorName}**.`
        );
        return;
      }
      const fullSector = await LostSectorAPI.fetchByDate(sector.date);
      const components = buildSectorComponents(
        fullSector,
        "information",
        sector.date
      );
      await interaction.editReply({
        flags: MessageFlags.IsComponentsV2,
        components,
      });
      return;
    }
    const seen = new Set<string>();
    const uniqueSectors: { name: string; date: string }[] = [];
    for (const sector of upcoming) {
      if (seen.has(sector.name)) break;
      seen.add(sector.name);
      uniqueSectors.push({ name: sector.name, date: sector.date });
    }
    if (uniqueSectors.length === 0) {
      await interaction.editReply("No upcoming lost sectors found.");
    } else {
      const components = createUpcomingSectorsComponent(uniqueSectors);
      await interaction.editReply({
        flags: MessageFlags.IsComponentsV2,
        components,
      });
    }
  } catch (err) {
    console.error(err);
    await interaction.editReply("Failed to fetch upcoming lost sectors.");
  }
}

export async function autocomplete(interaction: any) {
  const focusedValue = interaction.options.getFocused();
  try {
    const upcoming = await LostSectorAPI.fetchUpcoming();
    const seen = new Set<string>();
    const uniqueNames: string[] = [];
    for (const sector of upcoming) {
      if (seen.has(sector.name)) continue;
      seen.add(sector.name);
      uniqueNames.push(sector.name);
    }
    const filtered = uniqueNames
      .filter((name) =>
        name.toLowerCase().startsWith(focusedValue.toLowerCase())
      )
      .slice(0, 25);
    await interaction.respond(filtered.map((name) => ({ name, value: name })));
  } catch {
    await interaction.respond([]);
  }
}
