import {
  MediaGalleryBuilder,
  TextDisplayBuilder,
  ContainerBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  SectionBuilder,
  ThumbnailBuilder,
} from "discord.js";
import {
  cfParams,
  cfWebsiteAssetPath,
  CombinedData,
  getSectorDetailsByID,
} from "../api/lostsector";

import { getEmoteString } from "./emotes";

export function createComponents(dailyPost: CombinedData) {
  const { lostSectors, soloOps } = dailyPost;

  ////////////////////////////////////////////////////////////////////////
  // Create the header container
  const headerContainer = new SectionBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`-# Active now`)
    )
    .setButtonAccessory(
      new ButtonBuilder()
        .setLabel("Website")
        .setStyle(ButtonStyle.Link)
        .setURL("https://d2lostsector.report/")
    );

  ////////////////////////////////////////////////////////////////////////
  // Create overview content
  const overviewContent = lostSectors
    .map((sector) => {
      return `**${sector.sectorName}**\n-# ${sector.planetName}\n`;
    })
    .join("\n");

  // Create media gallery with all sector images
  const mediaGallery = new MediaGalleryBuilder();

  lostSectors.forEach((sector) => {
    const [sectorId] = getSectorDetailsByID(
      String(sector.variants.expert.activityId)
    );
    mediaGallery.addItems({
      media: {
        url:
          cfWebsiteAssetPath + sectorId + "/" + sectorId + ".jpg?" + cfParams,
      },
    });
  });

  const overviewContainer = new ContainerBuilder()
    .setAccentColor(0x5693f5)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `# ${getEmoteString("lostsector")} Today's World Lost Sectors\n\n` +
          overviewContent +
          `\n` +
          `For more information, see [D2LostSector.report ↗](https://d2lostsector.report/)`
      )
    )
    .addMediaGalleryComponents(mediaGallery);

  ////////////////////////////////////////////////////////////////////////
  // Footer buttons
  const footerContainer = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setLabel("Calendar")
        .setStyle(ButtonStyle.Link)
        .setURL("https://d2lostsector.report/calendar/")
    )
    .addComponents(
      new ButtonBuilder()
        .setLabel("Leaderboards")
        .setStyle(ButtonStyle.Link)
        .setURL("https://d2lostsector.report/leaderboards")
    )
    .addComponents(
      new ButtonBuilder()
        .setLabel("Solo Ops")
        .setStyle(ButtonStyle.Link)
        .setURL("https://d2lostsector.report/solo-ops/")
    )
    .addComponents(
      new ButtonBuilder()
        .setLabel("Support us on Ko-fi")
        .setStyle(ButtonStyle.Link)
        .setURL("https://ko-fi.com/d2lostsector")
    );

  const credits = new TextDisplayBuilder().setContent(
    `-# D2LostSector Discord Bot v${process.env.npm_package_version}`
  );

  const soloOpsFocusComponents: SectionBuilder[] = [];
  soloOpsFocusComponents.push(
    new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `## ${soloOps.individualActivities[0]?.name}\n**Bonus Focus:**\n${soloOps.individualActivities[0]?.focusDrop?.name ?? "N/A"}`
        )
      )
      .setThumbnailAccessory(
        new ThumbnailBuilder({
          media: {
            url:
              "https://www.bungie.net" +
              soloOps.individualActivities[0]?.focusDrop?.icon,
          },
        })
      ),

    new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `## Quickplay\n**Bonus Focus:**\n${soloOps.quickplayFocusDrop.name}`
        )
      )
      .setThumbnailAccessory(
        new ThumbnailBuilder({
          media: {
            url: "https://www.bungie.net" + soloOps.quickplayFocusDrop.icon,
          },
        })
      )
  );

  const featuredSoloOpsMedia = [
    {
      media: {
        url:
          "https://www.bungie.net" + soloOps.individualActivities[0]?.pgcrImage,
      },
    },
  ];

  const soloOpsContainer = new ContainerBuilder()
    .setAccentColor(0x800020)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `# ${getEmoteString("soloops")} Today's Featured Solo Ops\n\n`
      )
    )
    .addMediaGalleryComponents(
      new MediaGalleryBuilder().addItems(featuredSoloOpsMedia)
    )
    .addSectionComponents(...soloOpsFocusComponents);

  return [
    headerContainer,
    soloOpsContainer,
    overviewContainer,
    footerContainer,
    credits,
  ];
}