import { Events, Guild, Client } from "discord.js";
import type { EventHandler } from "./types";
import { sendToLoggingChannel } from "../helpers/log";

const handler: EventHandler<"guildDelete"> = {
  name: Events.GuildDelete,
  async execute(guild: Guild, client: Client) {
    console.log(`Left guild ${guild.name} (${guild.id})`);
    let totalGuilds: number;
    if (client.shard) {
      const results = await client.shard.broadcastEval(c => c.guilds.cache.size);
      totalGuilds = results.reduce((acc, count) => acc + count, 0);
    } else {
      totalGuilds = client.guilds.cache.size;
    }
    await sendToLoggingChannel(
      client,
      `🙁 Left server ${guild.name} (Total servers: ${totalGuilds})`
    );
  },
};

export default handler; 