import {
  SlashCommandBuilder,
  CommandInteraction,
  AutocompleteInteraction,
  MessageFlags,
  TextDisplayBuilder,
} from "discord.js";
import { rewardsList } from "../api/lostsector";
import {
  createFooterLinks,
  createSectorPageComponents,
} from "../helpers/embed";
import { LostSectorAPI } from "../api/lostsector";

export const data = new SlashCommandBuilder()
  .setName("next-weapon")
  .setDescription("Get the next sector to drop a selected weapon.")
  .addStringOption((option) =>
    option
      .setName("weapon")
      .setDescription("The weapon to check")
      .setRequired(true)
      .setAutocomplete(true)
  );

export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply();

  const weapon = interaction.options.get("weapon")?.value as string;
  if (!weapon) {
    await interaction.editReply("No weapon provided");
    return;
  }

  const weaponName = weapon.replace(/ \([^)]*\)$/, "");

  try {
    const upcoming = await LostSectorAPI.fetchUpcoming();
    for (const sector of upcoming) {
      if (sector.rewards.some(({ reward }) => reward.name === weaponName)) {
        const fullSector = await LostSectorAPI.fetchByDate(sector.date);
        const summaryComponent = new TextDisplayBuilder().setContent(
          `The next Lost Sector to feature **${weaponName}** is on **${sector.date.split("T")[0]}**.`
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
      `No upcoming lost sector found for **${weaponName}**.`
    );
  } catch (err) {
    console.error(err);
    await interaction.editReply("Failed to fetch upcoming lost sectors.");
  }
}

export async function autocomplete(interaction: AutocompleteInteraction) {
  const focusedValue = interaction.options.getFocused();
  const filtered = rewardsList
    .filter((choice) =>
      choice.toLowerCase().startsWith(focusedValue.toLowerCase())
    )
    .slice(0, 25);
  await interaction.respond(
    filtered.map((choice) => ({ name: choice, value: choice }))
  );
}
