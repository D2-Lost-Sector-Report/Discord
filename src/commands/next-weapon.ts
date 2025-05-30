import {
  SlashCommandBuilder,
  CommandInteraction,
  AutocompleteInteraction,
} from "discord.js";
import { rewardsList } from "../api/lostsector";

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
    return interaction.editReply("No weapon provided");
  }

  return interaction.editReply(weapon);
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
