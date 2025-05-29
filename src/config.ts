import { RGBTuple } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !DISCORD_GUILD_ID) {
  throw new Error("Missing environment variables");
}

export const config = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  DISCORD_GUILD_ID,
};

const informationColor: RGBTuple = [86, 147, 245];
const rewardsColor: RGBTuple = [79, 54, 99];
const rahoolColor: RGBTuple = [255, 166, 0];

export const colors = {
  information: informationColor,
  rewards: rewardsColor,
  rahool: rahoolColor,
};

export const powerLevel = {
  expert: 2040,
  master: 2050,
};
