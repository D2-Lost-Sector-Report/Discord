import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getEmoteString } from "../helpers/emotes";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

export async function execute(interaction: CommandInteraction) {
  if (!interaction.guild) {
    return interaction.reply("No guild found");
  }
  let response = "Testing emojis:\n";
  response += "twitter: " + getEmoteString("twitter") + "\n";
  response += "discord: " + getEmoteString("discord") + "\n";
  return interaction.reply(response);
}
