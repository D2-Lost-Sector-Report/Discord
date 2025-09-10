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
//import { getEmoteString } from "./emotes";

export function createComponents(dailyPost: CombinedData) {
  const { lostSectors, soloOps } = dailyPost;

  validateData(lostSectors);

  return [
    createHeaderContainer(),
    createSoloOpsContainer(soloOps),
    createOverviewContainer(lostSectors),
    createFooterContainer(),
    createCreditsComponent(),
  ];
}

function validateData(lostSectors: any[]) {
  if (!lostSectors || lostSectors.length === 0) {
    throw new Error("No lost sector data available");
  }
}

function createHeaderContainer() {
  return new SectionBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`-# Active now`)
    )
    .setButtonAccessory(
      new ButtonBuilder()
        .setLabel("Website")
        .setStyle(ButtonStyle.Link)
        .setURL("https://d2lostsector.report/")
    );
}

function createSoloOpsContainer(soloOps: any) {
  const featuredSoloOp = soloOps?.individualActivities?.[0];

  if (!featuredSoloOp) {
    return createEmptyContainer("No Solo Ops data available");
  }

  const soloOpsFocusSection = new SectionBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## ${featuredSoloOp.name}\n**Bonus Focus:**\n${featuredSoloOp.focusDrop?.name ?? "N/A"}`
      )
    )
    .setThumbnailAccessory(
      new ThumbnailBuilder({
        media: {
          url:
            "https://www.bungie.net" + (featuredSoloOp.focusDrop?.icon || ""),
        },
      })
    );
  const quickPlayFocusSection = new SectionBuilder()
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
    );

  const mediaGallery = new MediaGalleryBuilder().addItems({
    media: {
      url: "https://www.bungie.net" + (featuredSoloOp.pgcrImage || ""),
    },
  });

  return new ContainerBuilder()
    .setAccentColor(0x800020)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `# ${getEmoteString("soloops")} Today's Featured Solo Ops\n\n`
      )
    )
    .addMediaGalleryComponents(mediaGallery)
    .addSectionComponents(soloOpsFocusSection, quickPlayFocusSection);
}

function createOverviewContainer(lostSectors: any[]) {
  const overviewContent = lostSectors
    .map((sector) => `**${sector.sectorName}**\n-# ${sector.planetName}\n`)
    .join("\n");

  const mediaGallery = createLostSectorMediaGallery(lostSectors);

  return new ContainerBuilder()
    .setAccentColor(0x5693f5)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `# ${getEmoteString("lostsector")} Today's World Lost Sectors\n\n` +
          overviewContent +
          `\n\nFor more information, see [D2LostSector.report ↗](https://d2lostsector.report/)`
      )
    )
    .addMediaGalleryComponents(mediaGallery);
}

function createLostSectorMediaGallery(lostSectors: any[]) {
  const mediaGallery = new MediaGalleryBuilder();

  lostSectors.forEach((sector) => {
    const sectorDetails = getSectorDetailsByID(
      String(sector.variants.expert.activityId)
    );

    if (sectorDetails && sectorDetails[0]) {
      const [sectorId] = sectorDetails;
      mediaGallery.addItems({
        media: {
          url: `${cfWebsiteAssetPath}${sectorId}/${sectorId}.jpg?${cfParams}`,
        },
      });
    }
  });

  return mediaGallery;
}

function createFooterContainer() {
  const buttons = [
    { label: "Calendar", url: "https://d2lostsector.report/calendar/" },
    { label: "Leaderboards", url: "https://d2lostsector.report/leaderboards" },
    { label: "Solo Ops", url: "https://d2lostsector.report/solo-ops/" },
    { label: "Support us on Ko-fi", url: "https://ko-fi.com/d2lostsector" },
  ];

  const actionRow = new ActionRowBuilder<ButtonBuilder>();

  buttons.forEach(({ label, url }) => {
    actionRow.addComponents(
      new ButtonBuilder().setLabel(label).setStyle(ButtonStyle.Link).setURL(url)
    );
  });

  return actionRow;
}

function createCreditsComponent() {
  return new TextDisplayBuilder().setContent(`-# D2LostSector Discord Bot`);
}

function createEmptyContainer(message: string) {
  return new ContainerBuilder()
    .setAccentColor(0x808080)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`# ${message}`)
    );
}
