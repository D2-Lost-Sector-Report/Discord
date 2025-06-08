import { Client, Channel } from "discord.js";
import { config } from "../config";

export async function sendToLoggingChannel(
  client: Client,
  content: string
) {
  const channelId = config.LOGGING_CHANNEL_ID;
  // Try to fetch the channel on this shard
  let channel: Channel | null = null;
  try {
    channel = await client.channels.fetch(channelId);
  } catch {
    channel = null;
  }

  if (channel && channel.isTextBased() && 'send' in channel) {
    await channel.send(content);
    return;
  }

  // If not found, use broadcastEval to find the right shard
  if (client.shard) {
    await client.shard.broadcastEval(
      async (c, { channelId, content }) => {
        const channel = await c.channels.fetch(channelId).catch(() => null);
        if (channel && channel.isTextBased() && 'send' in channel) {
          await channel.send(content);
        }
      },
      {
        context: { channelId, content }
      }
    );
  }
} 