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
    // avoid async/await in the eval callback so tsup doesn't inject
    // a helper that gets minified to an undefined identifier
    await client.shard.broadcastEval(
      (c, { channelId, content }) => {
        return c.channels.fetch(channelId)
          .catch(() => null)
          .then(channel => {
            if (channel && channel.isTextBased() && 'send' in channel) {
              channel.send(content);
            }
          });
      },
      {
        context: { channelId, content }
      }
    );
  }
} 