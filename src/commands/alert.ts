import {
  SlashCommandBuilder,
  CommandInteraction,
  ChannelType,
  PermissionsBitField,
  MessageFlags,
} from "discord.js";
import { config } from "../config";
import { LostSectorAPI } from "../api/lostsector";
import { buildSectorComponents } from "../helpers/embed";

export const data = new SlashCommandBuilder()
  .setName("alert")
  .setDescription(
    "Add the daily Lost Sector notification to the current channel."
  );

export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  // Check channel type
  const channel = interaction.channel;
  if (!channel || channel.type !== ChannelType.GuildText) {
    await interaction.editReply(
      "This channel type cannot be set up for receiving alerts."
    );
    return;
  }

  // Check bot permissions
  const perms = channel.permissionsFor(interaction.client.user!);
  if (
    !perms?.has([
      PermissionsBitField.Flags.ViewChannel,
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.ManageWebhooks,
    ])
  ) {
    await interaction.editReply(
      "Bot cannot view this channel, please grant the bot the `View Channel`, `Send Messages`, and `Manage Webhooks` permissions and try again."
    );
    return;
  }

  // Test send/delete permissions
  try {
    const testMsg = await channel.send("Testing channel permissions...");
    await testMsg.delete();
  } catch {
    await interaction.editReply(
      "Bot cannot send/delete messages in this channel. Please check permissions and try again."
    );
    return;
  }

  // Webhook logic
  try {
    const webhooks = await channel.fetchWebhooks();
    const existing = webhooks.find((wh) => wh.name === "Lost Sector Bot");
    if (existing) {
      await interaction.editReply(
        "Alerts are already set up in this channel.\nHead to `Server Settings => Integrations => Channels Followed` to remove them."
      );
      return;
    }

    // Follow the announcement channel
    const guild = interaction.client.guilds.cache.get(config.GUILD_ID!);
    if (!guild) {
      await interaction.editReply("Could not find the main server.");
      return;
    }
    const announcementChannel = guild.channels.cache.get(
      config.ANNOUNCEMENT_CHANNEL_ID!
    );
    if (
      !announcementChannel ||
      announcementChannel.type !== ChannelType.GuildAnnouncement
    ) {
      await interaction.editReply("Could not find the announcement channel.");
      return;
    }

    await announcementChannel.addFollower(channel.id, "Lost Sector Bot");

    // Rename the webhook
    const newWebhooks = await channel.fetchWebhooks();
    const followed = newWebhooks.find((wh) =>
      wh.name?.startsWith("D2 Lost Sector Report")
    );
    if (followed) {
      await followed.edit({ name: "Lost Sector Bot" });
    }

    // Calculate the next 5pm UTC timestamp
    const now = new Date();
    const nextReset = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        17,
        0,
        0,
        0
      )
    );
    if (now.getUTCHours() >= 17) {
      nextReset.setUTCDate(nextReset.getUTCDate() + 1);
    }
    const nextResetTimestamp = Math.floor(nextReset.getTime() / 1000);

    await interaction.editReply(
      `Daily Lost Sector updates will now be posted to <#${channel.id}>.\n\n` +
        `Current Lost Sector will be posted immediately, next in rotation will be posted every day around <t:${nextResetTimestamp}:t>.\n\n` +
        "If you want to remove these alerts, head to `Server Settings => Integrations => Channels Followed`."
    );

    // Post current Lost Sector info
    try {
      const sector = await LostSectorAPI.fetchCurrent();
      const components = buildSectorComponents(
        sector,
        "information"
      );
      await channel.send({
        flags: MessageFlags.IsComponentsV2,
        components,
      });
    } catch (err: any) {
      console.error(err);
      await interaction.editReply(
        `Failed to post current Lost Sector info: ${err.message || err}`
      );
    }
  } catch (e: any) {
    await interaction.editReply(`Failed to set up alerts: ${e.message || e}`);
  }
}
