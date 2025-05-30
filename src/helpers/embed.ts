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
  ComponentType,
  SectionBuilder,
  ThumbnailBuilder,
  Client,
} from "discord.js";
import { getEmoteId, getEmoteString } from "./emotes";
import { getFastestTimesLink, getLeaderboardLink } from "./links";
import { LostSector } from "../api/lostsector";
import { colors, powerLevel } from "../config";
import { fromDays } from "./time";

function getSectorImageUrls(sectorId: string, imageCount: number): string[] {
  const urls = [];
  for (let i = 1; i <= imageCount; i++) {
    if (i === 1) {
      urls.push(
        `https://cf-assets.d2lostsector.report/for-website/${sectorId}/${sectorId}.jpg?width=800&watermark=true`
      );
    } else {
      urls.push(
        `https://cf-assets.d2lostsector.report/for-website/${sectorId}/${sectorId}-${i-1}.jpg?width=800&watermark=true`
      );
    }
  }
  return urls;
}

function getRewardImageUrl(rewardId: string): string {
  return `https://assets.d2lostsector.report/for-website/bungie/rewards/${rewardId}.jpg`;
}

function getRahoolImageUrl(reward: string): string {
  return `https://assets.d2lostsector.report/for-website/bungie/rahool/${reward.toLocaleLowerCase()}.png`;
}

export function createSectorPageComponents(
  sector: LostSector,
  page: "information" | "rewards",
  client: Client
) {
  if (page === "information") {
    const imageUrls = getSectorImageUrls(sector.activityid, sector.imageCount);

    const containerComponent = new ContainerBuilder()
      .setAccentColor(colors.information)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `## ${getEmoteString("lostsector", client)} ${sector.name}`
        )
      )
      .addMediaGalleryComponents(
        new MediaGalleryBuilder().addItems(
          imageUrls.map((url) => ({ media: { url } }))
        )
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `### Modifiers (Expert [${powerLevel.expert}] | Master [${powerLevel.master}])\n\n` +
            `**Champions**: ${generateChampionList(sector.champions, client)}\n` +
            `**Shields**: ${generateShieldList(sector.shields, client)}\n` +
            `**Threat**: ${getEmoteString(sector.threat, client)}\n` +
            `**Surges**: ${sector.surges.map((surge) => getEmoteString(surge, client)).join(" ")}\n` +
            `**Overcharge**: ${getEmoteString(sector.overcharge, client)} ${sector.overcharge}`
        )
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `### Active until: <t:${Math.floor((new Date(sector.date).getTime() + fromDays(1)) / 1000)}:t>`
        )
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

    return [containerComponent, actionRowComponent];
  } else if (page === "rewards") {
    const containerComponent = new ContainerBuilder()
      .setAccentColor(colors.rewards)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `## ${getEmoteString("lostsector", client)} ${sector.name}\n` +
            `### Today's Rewards\n\n` +
            `Weapon drop rates, assuming no Champions are left alive:\n` +
            `- **Expert**: 70% chance\n` +
            `- **Master**: 100% chance.\n\n` +
            `**Master** drops will have double perks in one column.`
        )
      )
      .addSeparatorComponents(new SeparatorBuilder());

    const rewardSections = (sector.rewards || []).map(({ reward }) =>
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`### ${reward.name}`),
          new TextDisplayBuilder().setContent(reward.type),
          new TextDisplayBuilder().setContent(
            `[View on Foundry ↗](https://d2foundry.gg/w/${reward.id})`
          )
        )
        .setThumbnailAccessory(
          new ThumbnailBuilder({ media: { url: getRewardImageUrl(reward.id) } })
        )
    );

    const rahoolSection = new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`### Rahool's Daily Focus`),
        new TextDisplayBuilder().setContent(
          `Today Rahool will focus exotic engrams into **${sector.rahool} armour** for no extra cost.`
        )
      )
      .setThumbnailAccessory(
        new ThumbnailBuilder({
          media: { url: getRahoolImageUrl(sector.rahool) },
        })
      );

    containerComponent.addSectionComponents(...rewardSections);
    containerComponent.addSeparatorComponents(new SeparatorBuilder());
    containerComponent.addSectionComponents(rahoolSection);

    return [containerComponent];
  }

  return [];
}

export function createSectorSelectRow(selectedPage: "information" | "rewards", client: Client) {
  const select = new StringSelectMenuBuilder()
    .setCustomId("select-sector-page")
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel("Information")
        .setValue("information")
        .setEmoji(getEmoteId("lostsector", client) || "🔍")
        .setDescription("Show info including champions and shields")
        .setDefault(selectedPage === "information"),
      new StringSelectMenuOptionBuilder()
        .setLabel("Rewards")
        .setValue("rewards")
        .setEmoji(getEmoteId("exotic", client) || "⭐")
        .setDescription(
          "Show rewards info including legendary weapons and Rahool's focus"
        )
        .setDefault(selectedPage === "rewards")
    );
  return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    select
  );
}

export function createFooterLinks() {
  return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel("Lost Sector Calendar")
      .setStyle(ButtonStyle.Link)
      .setURL("https://d2lostsector.report/calendar"),
    new ButtonBuilder()
      .setLabel("Join our Discord")
      .setStyle(ButtonStyle.Link)
      .setURL("https://d2lostsector.report/discord"),
    new ButtonBuilder()
      .setLabel("Support us on Ko-fi")
      .setStyle(ButtonStyle.Link)
      .setURL("https://ko-fi.com/d2lostsector")
  );
}

export function buildSectorComponents(
  sector: LostSector,
  selectedPage: "information" | "rewards",
  client: Client
) {
  return [
    ...createSectorPageComponents(sector, selectedPage, client),
    createSectorSelectRow(selectedPage, client),
    createFooterLinks(),
  ];
}

function generateChampionList(champions: any[], client: Client): string {
  return champions
    .map(
      (champion) =>
        `${getEmoteString(champion.key, client)} (${champion.expert} | ${champion.master}) `
    )
    .join(" ");
}

function generateShieldList(shields: any[], client: Client): string {
  return shields
    .map(
      (shield) =>
        `${getEmoteString(shield.key, client)} (${shield.expert} | ${shield.master}) `
    )
    .join(" ");
}

export function disableSelectMenus(components: any[]) {
  return components.map((row) => {
    if (row.type === ComponentType.ActionRow && Array.isArray(row.components)) {
      const actionRow = ActionRowBuilder.from(row);
      const newComponents = actionRow.components.map((component) => {
        if (component instanceof StringSelectMenuBuilder) {
          return StringSelectMenuBuilder.from(component).setDisabled(true);
        }
        return component;
      });
      return new ActionRowBuilder().addComponents(...newComponents);
    }
    return row;
  });
}
