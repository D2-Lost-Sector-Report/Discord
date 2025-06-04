import { RGBTuple } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const {
  TOKEN,
  CLIENT_ID,
  GUILD_ID,
  LOGGING_CHANNEL_ID,
  ANNOUNCEMENT_CHANNEL_ID,
} = process.env;

if (!TOKEN || !CLIENT_ID || !GUILD_ID || !LOGGING_CHANNEL_ID) {
  throw new Error("Missing environment variables");
}

export const config = {
  TOKEN,
  CLIENT_ID,
  GUILD_ID,
  LOGGING_CHANNEL_ID,
  ANNOUNCEMENT_CHANNEL_ID,
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
