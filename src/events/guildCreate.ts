import { Events, Guild, Client } from "discord.js";
import type { EventHandler } from "./types";
import { sendToLoggingChannel } from "../helpers/log";

const handler: EventHandler<"guildCreate"> = {
  name: Events.GuildCreate,
  async execute(guild: Guild, client: Client) {
    console.log(`Joined guild ${guild.name} (${guild.id})`);
    await sendToLoggingChannel(
      client,
      `🙂 Joined server ${guild.name} (Total servers: ${client.guilds.cache.size})`
    );
  },
};

export default handler; 