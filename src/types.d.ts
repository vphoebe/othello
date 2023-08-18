import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Collection,
} from "discord.js";

export type CommandDefinition = {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

declare module "discord.js" {
  interface Client {
    commands: Collection<string, CommandDefinition>;
  }
}
