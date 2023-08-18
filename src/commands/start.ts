import { Game, activeGame } from "../lib/game.js";
import { CommandDefinition } from "../types.js";
import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  User,
} from "discord.js";

const data = new SlashCommandBuilder()
  .setName("start")
  .setDescription("This starts the bot.")
  .addUserOption((option) =>
    option.setName("black").setDescription("Player for Black").setRequired(true)
  )
  .addUserOption((option) =>
    option.setName("white").setDescription("Player for White").setRequired(true)
  );

const execute = async (interaction: ChatInputCommandInteraction) => {
  const black = interaction.options.getUser("black") as User;
  const white = interaction.options.getUser("white") as User;
  activeGame.game = new Game(black, white);

  await interaction.reply({
    embeds: [activeGame.game.getEmbed()],
    ephemeral: true,
  });
};

const definition: CommandDefinition = {
  data: data as SlashCommandBuilder,
  execute,
};

export default definition;
