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

export const colors = {
  information: informationColor,
};

export const powerLevel = {
  expert: 200,
  master: 300,
};
