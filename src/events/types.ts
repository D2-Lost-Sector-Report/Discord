import type { ClientEvents } from "discord.js";

export interface EventHandler<K extends keyof ClientEvents = keyof ClientEvents> {
  name: K;
  once?: boolean;
  execute: (...args: any[]) => any;
} 