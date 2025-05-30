import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getEmoteString } from "../helpers/emotes";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

export async function execute(interaction: CommandInteraction) {
  let response = "Testing emojis:\n";
  response +=
    "twitter: " + getEmoteString("twitter", interaction.client) + "\n";
  response +=
    "discord: " + getEmoteString("discord", interaction.client) + "\n";
  return interaction.reply(response);
}
