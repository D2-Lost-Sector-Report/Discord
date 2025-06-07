import { Events, Client } from "discord.js";
import { populateRewardsList } from "../api/lostsector";
import type { EventHandler } from "./types";

const handler: EventHandler<"ready"> = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client) {
    console.log(`Bot is connected as ${client.user!.tag}!`);
    await populateRewardsList();
  },
};

export default handler; 