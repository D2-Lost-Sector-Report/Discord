import { client } from "..";
import { config } from "../config";

// Map user-friendly names to actual emote names in the server
const emoteNameMap: Record<string, string> = {
  "sword": "SRD",
  "scout rifle": "ScR",
  "rocket launcher": "RL",
  "grenade launcher": "GL",
  "glaive": "GL",
  "sidearm": "SA",
  "assault rifle": "AR",
  "pulse rifle": "PR",
  "sniper rifle": "SR",
  "shotgun": "SG",
  "machine gun": "LMG",
  "submachine gun": "SMG",
  "hand cannon": "HC",
  "fusion rifle": "FR",
  "trace rifle": "TR"
};

// Emotes that are uppercase in main server
const uppercaseEmojis = [
  "hunter",
  "titan",
  "warlock",
  "helmet",
  "gloves",
  "chest",
  "boots"
];

/**
 * Finds an emote by user-friendly name in the given guild and returns the formatted string for posting.
 * @param inputName The user-friendly name to look up.
 * @returns The formatted emote string, or the original input if not found.
 */
export function getEmoji(inputName: string): string {
  const guild = client.guilds.cache.get(config.DISCORD_GUILD_ID);
  if (!guild) return inputName + " (emote server not found)";

  let emoteName = emoteNameMap[inputName] || inputName;

  if(uppercaseEmojis.includes(emoteName)) {
    emoteName = emoteName.toUpperCase();
  }

  const emote = guild.emojis.cache.find(e => e.name === emoteName);
  if (!emote) return inputName + " (emote not found)";
  return emote.animated
    ? `<a:${emote.name}:${emote.id}>`
    : `<:${emote.name}:${emote.id}>`;
}
