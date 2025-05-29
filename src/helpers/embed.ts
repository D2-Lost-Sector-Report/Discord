import {
  MediaGalleryBuilder,
  TextDisplayBuilder,
  ContainerBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  MessageActionRowComponentBuilder,
  StringSelectMenuOptionBuilder,
  StringSelectMenuBuilder,
  SeparatorBuilder,
} from "discord.js";
import { getEmoteId, getEmoteString } from "./emotes";
import { getFastestTimesLink, getLeaderboardLink } from "./links";
import { LostSector } from "../api/lostsector";

function getSectorImageUrls(sectorId: string): string[] {
  return [
    `https://cf-assets.d2lostsector.report/for-website/${sectorId}/${sectorId}.jpg?width=800&watermark=true`,
    ...[1, 2, 3].map(
      (i) =>
        `https://cf-assets.d2lostsector.report/for-website/${sectorId}/${sectorId}-${i}.jpg?width=800&watermark=true`
    ),
  ];
}

export function createSectorPageComponents(
  sector: LostSector,
  page: "information" | "rewards"
) {
  if (page === "information") {
    const textComponent = new TextDisplayBuilder().setContent(
      `## ${getEmoteString("lostsector")} ${sector.name}`
    );

    const imageUrls = getSectorImageUrls(sector.activityid);
    const mediaGalleryComponent = new MediaGalleryBuilder().addItems(
      imageUrls.map((url) => ({ media: { url } }))
    );

    const actionRowComponent =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
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

    const containerComponent = new ContainerBuilder().addTextDisplayComponents(
      textComponent
    );
    containerComponent.addMediaGalleryComponents(mediaGalleryComponent);

    return [containerComponent, actionRowComponent];
  } else if (page === "rewards") {
    const containerComponent = new ContainerBuilder().addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## ${getEmoteString("lost sector")} ${sector.name}`
      )
    );

    containerComponent.addSeparatorComponents(new SeparatorBuilder());

    containerComponent.addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `[PLACEHOLDER]`
    ));

    return [containerComponent];
  }

  return [];
}

export function createSectorSelectRow(selectedPage: "information" | "rewards") {
  const select = new StringSelectMenuBuilder()
    .setCustomId("select-sector-page")
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel("Information")
        .setValue("information")
        .setEmoji(getEmoteId("lostsector") || "🔍")
        .setDescription("Show info including champions and shields")
        .setDefault(selectedPage === "information"),
      new StringSelectMenuOptionBuilder()
        .setLabel("Rewards")
        .setValue("rewards")
        .setEmoji(getEmoteId("exotic") || "⭐")
        .setDescription("Show rewards info including legendary weapons and Rahool's focus")
        .setDefault(selectedPage === "rewards")
    );
  return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    select
  );
}
