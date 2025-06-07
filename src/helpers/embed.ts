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
  ThumbnailBuilder
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
  page: "information" | "rewards"
) {
  if (page === "information") {
    const imageUrls = getSectorImageUrls(sector.activityid, sector.imageCount);

    const currentDate = new Date();
    const utcHours = currentDate.getUTCHours();
    if (utcHours < 17) {
      currentDate.setUTCDate(currentDate.getUTCDate() - 1);
    }
    const currentDateString = currentDate.toISOString().split("T")[0];

    let activeDate = "";
    if (sector.date && sector.date.split("T")[0] === currentDateString) {
      activeDate = `### Active until: <t:${Math.floor((new Date(sector.date).getTime() + fromDays(1)) / 1000)}:t>`;
    } else {
      activeDate = `### Active at: <t:${Math.floor(new Date(sector.date).getTime() / 1000)}:f>`;
    }

    const containerComponent = new ContainerBuilder()
      .setAccentColor(colors.information)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `## ${getEmoteString("lostsector")} ${sector.name}`
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
            `**Champions**: ${generateChampionList(sector.champions)}\n` +
            `**Shields**: ${generateShieldList(sector.shields)}\n` +
            `**Threat**: ${getEmoteString(sector.threat)}\n` +
            `**Surges**: ${sector.surges.map((surge) => getEmoteString(surge)).join(" ")}\n` +
            `**Overcharge**: ${getEmoteString(sector.overcharge)} ${sector.overcharge}`
        )
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(activeDate)
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
          `## ${getEmoteString("lostsector")} ${sector.name}\n` +
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

export function createSectorSelectRow(
  selectedPage: "information" | "rewards",
  sectorDate?: string
) {
  const customId = sectorDate
    ? `select-sector-page|${sectorDate}`
    : "select-sector-page";
  const select = new StringSelectMenuBuilder().setCustomId(customId).addOptions(
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
  sectorDate?: string
) {
  return [
    ...createSectorPageComponents(sector, selectedPage),
    createSectorSelectRow(selectedPage, sectorDate ?? sector.date),
    createFooterLinks(),
  ];
}

function generateChampionList(champions: any[]): string {
  return champions
    .map(
      (champion) =>
        `${getEmoteString(champion.key)} (${champion.expert} | ${champion.master}) `
    )
    .join(" ");
}

function generateShieldList(shields: any[]): string {
  return shields
    .map((shield) => {
      if (shield.key === "none") {
        return "None";
      }
      return `${getEmoteString(shield.key)} (${shield.expert} | ${shield.master}) `;
    })
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

export function createUpcomingSectorsComponent(
  sectors: { name: string; date: string }[]
) {
  const container = new ContainerBuilder()
    .setAccentColor(colors.information)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## ${getEmoteString("lostsector")} Upcoming Lost Sectors\n\n` +
          sectors
            .map(
              (s, i) =>
                `**${i + 1}.** ${s.name} — <t:${Math.floor(
                  new Date(s.date).getTime() / 1000
                )}:R>`
            )
            .join("\n")
      )
    );
  return [container, createFooterLinks()];
}
