import { Events, Client } from "discord.js";
import type { EventHandler } from "./types";
import { writeEmoteCacheToFile } from "../helpers/emotes";
import { config } from "../config";

const handler: EventHandler<"ready"> = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client) {
    console.log("Bot is connected as", client.user!.tag);
    const guild = client.guilds.cache.get(config.GUILD_ID);
    if (guild) {
      await guild.emojis.fetch();
      await writeEmoteCacheToFile(guild.emojis.cache);
      // Clear the guild emoji cache after persisting to disk to free memory
      try {
        guild.emojis.cache.clear();
      } catch (err) {
        console.warn("Failed to clear emoji cache:", err);
      }
    }
  },
};

export default handler;