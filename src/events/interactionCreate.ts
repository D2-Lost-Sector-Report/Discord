import { Events, Collection, Interaction, Client } from "discord.js";
import type { EventHandler } from "./types";

const handler: EventHandler<"interactionCreate"> = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction, _client: Client, commands?: Collection<string, any>) {
    if (!commands) return;

    // Emote cache loading removed — emotes are no longer used at runtime.
    if (interaction.isChatInputCommand()) {
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if (command) {
        try {
          await command.execute(interaction);
        } catch (error) {
          console.error("Error executing command", commandName, error);
        }
      }
    }
    if (interaction.isAutocomplete()) {
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if (command) {
        try {
          await command.autocomplete(interaction);
        } catch (error) {
          console.error("Error executing autocomplete", commandName, error);
        }
      }
    }
  },
};

export default handler; 