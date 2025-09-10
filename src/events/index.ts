import clientReady from "./clientReady";
import guildCreate from "./guildCreate";
import guildDelete from "./guildDelete";
//import interactionCreate from "./interactionCreate";
import type { EventHandler } from "./types";

const events: EventHandler[] = [
  clientReady,
  guildCreate,
  guildDelete,
//  interactionCreate,
];

export default events; 