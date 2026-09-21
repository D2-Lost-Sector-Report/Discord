import { Events, Client } from "discord.js";
import type { EventHandler } from "./types";
import { config } from "../config";

const handler: EventHandler<"ready"> = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client) {
    console.log("Bot is connected as", client.user!.tag);
    const guild = client.guilds.cache.get(config.GUILD_ID);
    if (guild) {
      // Emote caching removed — no emoji fetch or emotes.json write.
    }
  },
};

export default handler;