import { Collection, GuildEmoji } from "discord.js";

// Map user-friendly names to actual emote names in the server
const emoteNameMap: Record<string, string> = {
  "sword": "SRD",
  "scout rifle": "ScR",
  "rocket launcher": "RL",
  "grenade launcher": "GL",
  "glaive": "GV",
  "sidearm": "SA",
  "assault rifle": "AR",
  "pulse rifle": "PR",
  "sniper rifle": "SR",
  "shotgun": "SG",
  "machine gun": "LMG",
  "submachine gun": "SMG",
  "hand cannon": "HC",
  "fusion rifle": "FR",
  "trace rifle": "TR",
};

// Emotes that are uppercase in main server
const uppercaseEmojis = [
  "hunter",
  "titan",
  "warlock",
  "helmet",
  "gloves",
  "chest",
  "boots",
];

// Module-level emote cache
let emoteCache: Collection<string, GuildEmoji> | null = null;

export function setEmoteCache(cache: Collection<string, GuildEmoji>) {
  emoteCache = cache;
  console.log("Added", cache.size, "emotes to emote cache");
}

/**
 * Finds an emote by user-friendly name in the given guild and returns the formatted string for posting.
 * @param inputName The user-friendly name to look up.
 * @returns The formatted emote string, or the original input if not found.
 */
export function getEmoteString(inputName: string): string {
  if (!emoteCache) return inputName + " (emote server not found)";

  let emoteName = emoteNameMap[inputName.toLowerCase()] || inputName;

  if (uppercaseEmojis.includes(emoteName)) {
    emoteName = emoteName.toUpperCase();
  }

  const emote =
    emoteCache.find((e) => e.name === emoteName) ||
    emoteCache.find((e) => e.name === emoteName.toLowerCase());

  if (!emote) return inputName + " (emote not found)";
  return emote.animated
    ? `<a:${emote.name}:${emote.id}>`
    : `<:${emote.name}:${emote.id}>`;
}

export function getEmoteId(inputName: string): string | null {
  if (!emoteCache) return null;
  const emote = emoteCache.find((e) => e.name === inputName);
  if (!emote) return null;
  return emote.id;
}
