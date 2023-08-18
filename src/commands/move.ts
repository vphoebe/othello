import { gridToCoords } from "../lib/coordinates.js";
import { activeGame } from "../lib/game.js";
import { CommandDefinition } from "../types.js";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("move")
  .setDescription("Enter coordinates to make your move.")
  .addStringOption((option) =>
    option
      .setName("coordinates")
      .setDescription("Enter grid coordinates (eg. C4)")
      .setRequired(true)
      .setMinLength(2)
      .setMaxLength(2)
  );

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

  const input = interaction.options
    .getString("coordinates")
    ?.toLocaleUpperCase() as string; // required
  const coords = gridToCoords(input);
  if (!coords) {
    await interaction.reply({ ephemeral: true, content: "Invalid move." });
    return;
  }
  const validMove = activeGame.game.move(coords.x, coords.y, playerPiece);
  if (!validMove) {
    await interaction.reply({ ephemeral: true, content: "Invalid move." });
    return;
  } else {
    const winner = activeGame.game.getWinner();
    await interaction.reply({
      ephemeral: false,
      content: `${interaction.user.displayName} placed a ${
        activeGame.game.theme[playerPiece]
      } piece on ${input}. ${
        winner ? `\n${winner.user.displayName} is the winner!` : ""
      }`,
      embeds: [activeGame.game.getEmbed(winner?.piece)],
    });
    return;
  }
};

const definition: CommandDefinition = {
  data: data as SlashCommandBuilder,
  execute,
};

export default definition;
