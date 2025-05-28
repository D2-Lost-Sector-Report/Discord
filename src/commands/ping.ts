import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getEmoji } from "../helpers/emoji";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

export async function execute(interaction: CommandInteraction) {
  if (!interaction.guild) {
    return interaction.reply("No guild found");
  }
  let response = "Testing emojis:\n";
  response += "twitter: " + getEmoji("twitter") + "\n";
  response += "discord: " + getEmoji("discord") + "\n";
  return interaction.reply(response);
}
