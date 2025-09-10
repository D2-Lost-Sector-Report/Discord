import clientReady from "./clientReady";
import guildCreate from "./guildCreate";
import guildDelete from "./guildDelete";
import type { EventHandler } from "./types";

const events: EventHandler[] = [
  clientReady,
  guildCreate,
  guildDelete,
];

export default events; 