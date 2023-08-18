import { Board, Piece, PlayerPiece, opposite } from "./board.js";
import { compass } from "./coordinates.js";
import { Theme, themes } from "./themes.js";
import { EmbedBuilder, User } from "discord.js";

export const activeGame: {
  game: Game | null;
} = {
  game: null,
};

export class Game {
  board: Board;
  players: {
    [Piece.Black]: User;
    [Piece.White]: User;
  };
  activePlayer: Piece.Black | Piece.White;
  theme: Theme;

  constructor(player1: User, player2: User) {
    this.board = new Board();
    // fill default pieces on board
    this.board.set(3, 3, Piece.White); // D4
    this.board.set(4, 4, Piece.White); // E5
    this.board.set(4, 3, Piece.Black); // E4
    this.board.set(3, 4, Piece.Black); // D5
    this.activePlayer = Piece.Black;
    this.players = {
      [Piece.Black]: player1,
      [Piece.White]: player2,
    };
    this.theme = themes.default;
  }

  isFinished() {
    const totalMoves =
      this.findValidMoveCount(Piece.Black) +
      this.findValidMoveCount(Piece.White);
    console.log(`Total moves available: ${totalMoves}`);
    return totalMoves === 0;
  }

  getWinner(): { user: User; piece: PlayerPiece } | undefined {
    if (!this.isFinished()) return undefined;
    let blackCount = 0;
    let whiteCount = 0;
    this.board.loop((_x, _y, piece) => {
      if (piece === Piece.Black) blackCount++;
      if (piece === Piece.White) whiteCount++;
    });
    if (blackCount > whiteCount) {
      return { user: this.players[Piece.Black], piece: Piece.Black };
    } else if (whiteCount > blackCount) {
      return { user: this.players[Piece.White], piece: Piece.White };
    }
  }

  getPlayer(user: User) {
    // return the piece user is, or null if invalid
    // debug: if user is both, return current turn
    if (
      user === this.players[Piece.Black] &&
      user === this.players[Piece.White]
    )
      return this.activePlayer;
    if (user === this.players[Piece.Black]) return Piece.Black;
    if (user === this.players[Piece.White]) return Piece.White;
    return null;
  }

  pass() {
    // swap active turn
    this.activePlayer = opposite(this.activePlayer);
  }

  findValidMoveCount(playerPiece: PlayerPiece): number {
    let moves = 0;
    // we loop through every space on the board to determine if it's valid
    // it must be adjacent to an opponent and created "flanked" pieces with that offset
    const offsets = compass.map((def) => def.offset);
    this.board.loop((x, y, piece) => {
      if (piece !== Piece.Empty) return;
      // this coord is empty
      // try every compass offset to see if there are any flanked
      let doesFlank = false;
      for (const offset of offsets) {
        const flankedCoords = this.board.flanked(x, y, playerPiece, offset);
        if (flankedCoords.length) {
          doesFlank = true;
        }
      }
      if (doesFlank) moves++;
    });
    return moves;
  }

  // game logic methods
  // returns `true` if valid move, returns `false` if invalid

  move(x: number, y: number, playerPiece: PlayerPiece): boolean {
    // game-logic evaluated version of "set()"
    // player-initiated moves should always use this
    const target = this.board.get(x, y);
    if (target === null || target !== Piece.Empty) return false;

    let wasValid = false;
    for (const def of compass) {
      const flankedCoords = this.board.flanked(x, y, playerPiece, def.offset);
      if (flankedCoords.length) {
        // valid move found
        wasValid = true;
        console.log(`Valid move for ${x}, ${y} in ${def.dir} direction`);
        // place player's piece
        this.board.set(x, y, playerPiece);
        // flip flanked
        for (const coords of flankedCoords) {
          console.log(`Flipping ${coords.x} ${coords.y}`);
          this.board.flip(coords.x, coords.y);
        }
      }
    }
    if (wasValid) {
      this.pass();
    }
    return wasValid;
  }

  getEmbed(winnerPiece?: PlayerPiece): EmbedBuilder {
    const playerString = (playerPiece: PlayerPiece) =>
      `${this.theme[playerPiece]} ${this.players[playerPiece].displayName} ${
        !winnerPiece && playerPiece === this.activePlayer ? "(their turn)" : ""
      } ${winnerPiece && winnerPiece === playerPiece ? "[WINNER!]" : ""}`;

    const gameScreen = new EmbedBuilder()
      .setTitle("Othello")
      .addFields({
        name: "Players",
        value: playerString(Piece.Black) + "\n" + playerString(Piece.White),
      })
      .addFields({
        name: "Game Board",
        value: this.board.draw(this.theme),
      });
    return gameScreen;
  }
}
