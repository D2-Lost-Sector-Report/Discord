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

// Decoupled from emotes: use plain titles and a small local weapon-type detector
const weaponKeywords = [
  "sword",
  "scout rifle",
  "rocket launcher",
  "grenade launcher",
  "glaive",
  "sidearm",
  "assault rifle",
  "pulse rifle",
  "sniper rifle",
  "shotgun",
  "machine gun",
  "submachine gun",
  "hand cannon",
  "fusion rifle",
  "trace rifle",
];

function isWeaponTypeLocal(name: string | undefined | null): boolean {
  if (!name) return false;
  const nameLower = name.toLowerCase();
  return weaponKeywords.some((k) => nameLower.includes(k));
}

export function createComponents(dailyPost: CombinedData) {
  const { lostSectors, soloOps } = dailyPost;

  validateData(lostSectors);

  return [
    createHeaderContainer(),
    createOverviewContainer(lostSectors),
    createSoloOpsContainer(soloOps),
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

  // Render focus drops: weapons should be links to destiny.report; armor should be plain text
  const featuredFocusName = featuredSoloOp.focusDrop?.name ?? "N/A";
  const featuredFocusHash = featuredSoloOp.focusDrop?.hash || "";
  const featuredFocusIcon = featuredSoloOp.focusDrop?.icon || "";
  const featuredFocusDisplay =
    isWeaponTypeLocal(featuredFocusName) && featuredFocusHash
      ? `[${featuredFocusName}](https://destiny.report/w/${featuredFocusHash})`
      : `${featuredFocusName}`;

  const soloOpsFocusSection = new SectionBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## ${featuredSoloOp.name}\n**Bonus Focus:**\n${featuredFocusDisplay}`
      )
    )
    .setThumbnailAccessory(
      new ThumbnailBuilder({
        media: {
          url: "https://www.bungie.net" + featuredFocusIcon,
        },
      })
    );

  const quickName = soloOps.quickplayFocusDrop?.name ?? "N/A";
  const quickHash = soloOps.quickplayFocusDrop?.hash || "";
  const quickIcon = soloOps.quickplayFocusDrop?.icon || "";
  const quickDisplay =
    isWeaponTypeLocal(quickName) && quickHash
      ? `[${quickName}](https://destiny.report/w/${quickHash})`
      : `${quickName}`;

  const quickPlayFocusSection = new SectionBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## Quickplay Normal & Master\n**Bonus Focus:**\n${quickDisplay}`
      )
    )
    .setThumbnailAccessory(
      new ThumbnailBuilder({
        media: {
          url: "https://www.bungie.net" + quickIcon,
        },
      })
    );

  let mediaUrl = featuredSoloOp.pgcrImage || "";
  //if the first 4 characters of mediaurl are not "https", then we need to prefix it
  if (mediaUrl && !mediaUrl.startsWith("https")) {
    mediaUrl = "https://www.bungie.net" + mediaUrl;
  }

  const mediaGallery = new MediaGalleryBuilder().addItems({
    media: {
      url: mediaUrl,
    },
  });

  return new ContainerBuilder()
    .setAccentColor(0x800020)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `# Solo Ops — Today's Featured Solo Ops\n\n`
      )
    )
    .addMediaGalleryComponents(mediaGallery)
    .addSectionComponents(soloOpsFocusSection, quickPlayFocusSection);
}

function createOverviewContainer(lostSectors: any[]) {
  const overviewContent = lostSectors
    .map((sector) => `**[${sector.sectorName}](https://d2lostsector.report/sector/${sector.escapedname})**\n-# ${sector.planetName}\n`)
    .join("\n");

  const mediaGallery = createLostSectorMediaGallery(lostSectors);

  return new ContainerBuilder()
    .setAccentColor(0x5693f5)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `# Lost Sectors — Today's World Lost Sectors\n\n` +
          overviewContent +
          `\n\nFor more information, see [D2LostSector.report](https://d2lostsector.report/)`
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
