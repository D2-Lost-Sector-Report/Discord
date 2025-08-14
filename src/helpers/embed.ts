import {
  MediaGalleryBuilder,
  TextDisplayBuilder,
  ContainerBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  SectionBuilder,
} from "discord.js";
import {
  cfParams,
  cfWebsiteAssetPath,
  LostSector,
  LostSectorLogo,
} from "../api/lostsector";
import { getSectorDetailsByID } from "./utils";

// Function to get the 5 PM UTC timestamp for the current day
const getFixedDailyResetTimestamp = (): number => {
  const now = new Date();
  // Create a date object for today at 17:00 UTC (5 PM)
  const resetTime =
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      17, // 17:00 UTC (5 PM)
      0, // 0 minutes
      0 // 0 seconds
    ) / 1000; // Convert milliseconds to seconds for Discord timestamp

  return resetTime;
};

export function buildSectorComponents(
  lostSectors: LostSector[],
) {
  ////////////////////////////////////////////////////////////////////////
  // Create the header container
  const headerContainer = new SectionBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `-# Active from <t:${getFixedDailyResetTimestamp()}:F>`
      )
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
    .map((sector: LostSector) => {
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
        `# ${LostSectorLogo} Today's World Lost Sectors\n\n` +
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
    `-# D2LostSector Bot v${process.env.npm_package_version}`
  );

  return {
    headerContainer,
    overviewContainer,
    footerContainer,
    credits,
  };
}