import { activeGame } from "../lib/game.js";
import { CommandDefinition } from "../types.js";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("pass")
  .setDescription("Pass your turn to the other player.");

const execute = async (interaction: ChatInputCommandInteraction) => {
  if (!activeGame.game) {
    await interaction.reply({
      ephemeral: true,
      content: "Use /start to start a new game!",
    });
    return;
  }
  const playerPiece = activeGame.game.getPlayer(interaction.user);
  if (!playerPiece) {
    await interaction.reply({
      ephemeral: true,
      content: "You're not playing! Wait until the next round...",
    });
    return;
  }
  if (playerPiece !== activeGame.game.activePlayer) {
    await interaction.reply({
      ephemeral: true,
      content: "It's not your turn yet! Please hang on.",
    });
    return;
  }
  activeGame.game.pass();

  await activeGame.interaction?.editReply({
    embeds: [activeGame.game.getEmbed()],
  });
  await interaction.reply({
    ephemeral: true,
    content: `You passed your turn.`,
  });
  return;
};

const definition: CommandDefinition = {
  data: data as SlashCommandBuilder,
  execute,
};

export default definition;
