import { GuildEmoji } from "discord.js";
import fs from "fs/promises";
import { Collection } from "discord.js";

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
  "soloops": "soloops"
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

// Emote cache type
interface EmoteData {
  name: string;
  id: string;
  animated: boolean;
}

let emoteCache: EmoteData[] = [];

export function isEmoteCacheLoaded() {
  return emoteCache.length > 0;
}

/**
 * Finds an emote by user-friendly name in the given guild and returns the formatted string for posting.
 * @param inputName The user-friendly name to look up.
 * @returns The formatted emote string, or the original input if not found.
 */
export function getEmoteString(inputName: string): string {
  if (!isEmoteCacheLoaded()) return inputName + " (emote server not found)";

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
  if (!isEmoteCacheLoaded()) return null;
  const emote = emoteCache.find((e) => e.name === inputName);
  if (!emote) return null;
  return emote.id;
}

export async function loadEmoteCacheFromFile(path = "emotes.json") {
  try {
    const data = await fs.readFile(path, "utf-8");
    emoteCache = JSON.parse(data);
    console.log("Loaded", emoteCache.length, "emotes from file");
  } catch (err) {
    console.error("Failed to load emote cache:", err);
    emoteCache = [];
  }
}

export async function writeEmoteCacheToFile(
  emotes: EmoteData[] | Collection<string, GuildEmoji>,
  path = "emotes.json"
) {
  let emoteArr: EmoteData[];
  if (Array.isArray(emotes)) {
    emoteArr = emotes;
  } else {
    emoteArr = emotes.map(e => ({
      name: e.name ?? '',
      id: e.id,
      animated: e.animated ?? false,
    }));
  }
  try {
    await fs.writeFile(path, JSON.stringify(emoteArr, null, 2));
    console.log("Wrote", emoteArr.length, "emotes to", path);
  } catch (err) {
    console.error("Failed to write emote cache:", err);
  }
}
