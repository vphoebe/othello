import { User } from "discord.js";
import { Game } from "./game.js";

class StateManager {
  guilds: Map<string, Game[]>;
  constructor() {
    this.guilds = new Map();
  }

  get(guildId: string, user: User) {
    const guildGames = this.guilds.get(guildId);
    return guildGames?.find((game) => game.getPlayer(user) !== null);
  }

  set(guildId: string, value: Game) {
    const guildGames = this.guilds.get(guildId);
    this.guilds.set(guildId, [...(guildGames ?? []), value]);
  }
}

export const state = new StateManager();
