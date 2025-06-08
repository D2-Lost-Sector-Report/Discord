import { Events, Guild, Client } from "discord.js";
import type { EventHandler } from "./types";
import { sendToLoggingChannel } from "../helpers/log";

const handler: EventHandler<"guildDelete"> = {
  name: Events.GuildDelete,
  async execute(guild: Guild, client: Client) {
    console.log(`Left guild ${guild.name} (${guild.id})`);
    await sendToLoggingChannel(
      client,
      `🙁 Left server ${guild.name} (Total servers: ${client.guilds.cache.size})`
    );
  },
};

export default handler; 