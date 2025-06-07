import { Events, Client } from "discord.js";
import { populateRewardsList } from "../api/lostsector";
import type { EventHandler } from "./types";
import { setEmoteCache } from "../helpers/emotes";
import { config } from "../config";

const handler: EventHandler<"ready"> = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client) {
    console.log("Bot is connected as", client.user!.tag);
    const guild = client.guilds.cache.get(config.GUILD_ID);
    if (guild) {
      await guild.emojis.fetch();
      setEmoteCache(guild.emojis.cache);
      await populateRewardsList();
    }
  },
};

export default handler;