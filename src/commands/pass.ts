import { state } from "../lib/state.js";
import { CommandDefinition } from "../types.js";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("pass")
  .setDescription("Pass your turn to the other player.");

const execute = async (interaction: ChatInputCommandInteraction) => {
  const game = interaction.guildId
    ? state.get(interaction.guildId, interaction.user)
    : undefined;

  if (!game) {
    await interaction.reply({
      ephemeral: true,
      content: "Use /start to start a new game!",
    });
    return;
  }
  const playerPiece = game.getPlayer(interaction.user);
  if (!playerPiece) {
    await interaction.reply({
      ephemeral: true,
      content: "You're not playing! Wait until the next round...",
    });
    return;
  }
  if (playerPiece !== game.activePlayer) {
    await interaction.reply({
      ephemeral: true,
      content: "It's not your turn yet! Please hang on.",
    });
    return;
  }
  game.pass();

  await interaction.reply({
    content: `${interaction.user.displayName} passed their turn.`,
    embeds: [game.getEmbed()],
  });
  return;
};

const definition: CommandDefinition = {
  data: data as SlashCommandBuilder,
  execute,
};

export default definition;
