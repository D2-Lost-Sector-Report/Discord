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

