import { MediaGalleryBuilder, TextDisplayBuilder, ContainerBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageActionRowComponentBuilder, StringSelectMenuOptionBuilder, StringSelectMenuBuilder } from "discord.js";
import { LostSectorAPI } from "../api/lostsector";
import { getEmoteString } from "./emotes";
import { getFastestTimesLink, getLeaderboardLink } from "./links";

function getSectorImageUrls(sectorId: string): string[] {
  return [
    `https://cf-assets.d2lostsector.report/for-website/${sectorId}/${sectorId}.jpg?width=800&watermark=true`,
    ...[1, 2, 3].map(i =>
      `https://cf-assets.d2lostsector.report/for-website/${sectorId}/${sectorId}-${i}.jpg?width=800&watermark=true`
    ),
  ];
}

export async function createSectorComponents() {
  const sector = await LostSectorAPI.fetchCurrent();

  const textComponent = new TextDisplayBuilder().setContent(
    `## ${getEmoteString("lost sector")} ${sector.name}`
  );
  
  const imageUrls = getSectorImageUrls(sector.activityid);
  const mediaGalleryComponent = new MediaGalleryBuilder().addItems(
    imageUrls.map(url => ({ media: { url } }))
  );

  const actionRowComponent = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel("Leaderboard")
      .setStyle(ButtonStyle.Link)
      .setURL(getLeaderboardLink(sector.name)),
    new ButtonBuilder()
      .setLabel("Fastest times: Expert")
      .setStyle(ButtonStyle.Link)
      .setURL(getFastestTimesLink(sector.name, "expert")),
    new ButtonBuilder()
      .setLabel("Fastest times: Master")
      .setStyle(ButtonStyle.Link)
      .setURL(getFastestTimesLink(sector.name, "master"))
  );

  const containerComponent = new ContainerBuilder().addTextDisplayComponents(textComponent);
  containerComponent.addMediaGalleryComponents(mediaGalleryComponent);

  const select = new StringSelectMenuBuilder()
    .setCustomId('select')
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel('Option A')
        .setValue('option-a')
        .setDescription('A selectable option')
        .setEmoji('1180242785698324551')
        .setDefault(true),
      new StringSelectMenuOptionBuilder()
        .setLabel('Option B')
        .setValue('option-b')
        .setDescription('A selectable option')
        .setEmoji('1180242785698324551')
        .setDefault(false),
  );

  const selectRowComponent = new ActionRowBuilder<MessageActionRowComponentBuilder>()
    .addComponents(select);
  
  return [containerComponent, actionRowComponent, selectRowComponent];
}
