import { Board, Piece, PlayerPiece, opposite } from "./board.js";
import { MoveDefinition, compass } from "./coordinates.js";
import { Theme, themes } from "./themes.js";
import { EmbedBuilder, User, userMention } from "discord.js";

interface Player {
  user: User;
  moves: MoveDefinition[];
}

export class Game {
  board: Board;
  players: Record<PlayerPiece, Player>;
  activePlayer: PlayerPiece;
  theme: Theme;

  constructor(player1: User, player2: User) {
    this.board = new Board();
    // fill default pieces on board
    this.board.set(3, 3, Piece.White); // D4
    this.board.set(4, 4, Piece.White); // E5
    this.board.set(4, 3, Piece.Black); // E4
    this.board.set(3, 4, Piece.Black); // D5
    this.players = {
      [Piece.Black]: { user: player1, moves: this.getValidMoves(Piece.Black) },
      [Piece.White]: { user: player2, moves: this.getValidMoves(Piece.White) },
    };
    this.activePlayer = Piece.Black;
    this.theme = themes.default;
  }

  isFinished() {
    const allMoves = Object.entries(this.players)
      .map(([, player]) => player.moves)
      .flat();
    return allMoves.length === 0;
  }

  getWinner(): { user: User; piece: PlayerPiece } | undefined {
    let blackCount = 0;
    let whiteCount = 0;
    this.board.loop((_x, _y, piece) => {
      if (piece === Piece.Black) blackCount++;
      if (piece === Piece.White) whiteCount++;
    });
    if (blackCount > whiteCount) {
      return { user: this.players[Piece.Black].user, piece: Piece.Black };
    } else if (whiteCount > blackCount) {
      return { user: this.players[Piece.White].user, piece: Piece.White };
    } else {
      return undefined;
    }
  }

  getPlayer(user: User): PlayerPiece | null {
    // return the piece user is, or null if invalid
    // debug: if user is both, return current turn
    const entries = Object.entries(this.players).filter(
      ([, player]) => player.user === user
    );
    if (entries.length > 1) return this.activePlayer;
    else if (entries.length === 1) {
      const record = entries[0];
      return parseInt(record[0]) as PlayerPiece;
    }
    return null;
  }

  pass() {
    // swap active turn
    this.activePlayer = opposite(this.activePlayer);
  }

  getValidMoves(playerPiece: PlayerPiece): MoveDefinition[] {
    const moves: MoveDefinition[] = [];
    // we loop through every space on the board to determine if it's valid
    // it must be adjacent to an opponent and created "flanked" pieces with that offset
    const offsets = compass.map((def) => def.offset);
    this.board.loop((x, y, piece) => {
      if (piece !== Piece.Empty) return;
      // this coord is empty
      // try every compass offset to see if there are any flanked
      for (const offset of offsets) {
        const flankedCoords = this.board.flanked(x, y, playerPiece, offset);
        if (flankedCoords.length) {
          moves.push({ x, y, offset, flanked: flankedCoords });
        }
      }
    });
    return moves;
  }

  move(x: number, y: number, playerPiece: PlayerPiece): boolean {
    // returns `true` if valid move, returns `false` if invalid
    const playerMoves = this.players[playerPiece].moves;
    const validMoves = playerMoves.filter(
      (move) => move.x === x && move.y === y
    );
    if (!validMoves.length) return false;

    // valid move(s)
    this.board.set(x, y, playerPiece);
    validMoves.forEach((move) => {
      move.flanked.forEach((coords) => this.board.flip(coords.x, coords.y));
    });
    this.pass();
    // re-evaluate next possible moves
    this.players[playerPiece].moves = this.getValidMoves(playerPiece);
    this.players[opposite(playerPiece)].moves = this.getValidMoves(
      opposite(playerPiece)
    );
    return true;
  }

  getEmbed(winnerPiece?: PlayerPiece): EmbedBuilder {
    const playerString = (playerPiece: PlayerPiece) => {
      const badge = () => {
        if (winnerPiece) {
          if (winnerPiece === playerPiece) return "(Winner!)";
        } else {
          if (playerPiece === this.activePlayer) return "(next)";
        }
        return "";
      };
      return `\`${this.theme.pieces[playerPiece]}\` ${userMention(
        this.players[playerPiece].user.id
      )} ${badge()}`;
    };

    const gameScreen = new EmbedBuilder().addFields([
      {
        name: "Players",
        value: `${playerString(Piece.Black)}\n${playerString(Piece.White)}`,
      },
      {
        name: "Game Board",
        value: this.board.draw(this.theme),
      },
    ]);
    return gameScreen;
  }
}
