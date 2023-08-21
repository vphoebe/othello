import { gridToCoords } from "../lib/coordinates.js";
import { state } from "../lib/state.js";
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
  const game = interaction.guildId
    ? state.get(interaction.guildId, interaction.user)
    : undefined;

  if (!game || !interaction.guildId) {
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

  const input = interaction.options
    .getString("coordinates")
    ?.toLocaleUpperCase() as string; // required
  const coords = gridToCoords(input);
  if (!coords) {
    await interaction.reply({ ephemeral: true, content: "Invalid move." });
    return;
  }
  const wasValidMove = game.move(coords.x, coords.y, playerPiece);
  if (!wasValidMove) {
    await interaction.reply({ ephemeral: true, content: "Invalid move." });
    return;
  }

  let winner;
  const isFinished = game.isFinished();
  if (isFinished) winner = game.getWinner();

  let winnerText = "";

  if (winner) {
    winnerText = `${winner.user.displayName} is the winner!`;
  } else if (isFinished && !winner) {
    winnerText = "It's a tie!";
  }

  await interaction.reply({
    ephemeral: false,
    content: `${interaction.user.displayName} placed a ${game.theme.pieces[playerPiece]} piece on ${input}. ${winnerText}`,
    embeds: [game.getEmbed(winner?.piece)],
  });
  if (winner) {
    state.delete(interaction.guildId, interaction.user);
  }
  return;
};

const definition: CommandDefinition = {
  data: data as SlashCommandBuilder,
  execute,
};

export default definition;
