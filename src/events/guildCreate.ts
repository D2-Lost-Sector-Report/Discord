import { Events, Guild, Client } from "discord.js";
import { config } from "../config";
import type { EventHandler } from "./types";

const handler: EventHandler<"guildCreate"> = {
  name: Events.GuildCreate,
  async execute(guild: Guild, client: Client) {
    console.log(`Joined guild ${guild.name} (${guild.id})`);
    const loggingChannel = await guild.channels.fetch(config.LOGGING_CHANNEL_ID);
    if (loggingChannel && loggingChannel.isTextBased()) {
      await loggingChannel.send(
        `🙂 Joined server ${guild.name} (Total servers: ${client.guilds.cache.size})`
      );
    }
  },
};

export default handler; 