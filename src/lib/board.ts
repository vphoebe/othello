import { Coords } from "./coordinates.js";
import { Theme } from "./themes.js";
import { codeBlock } from "discord.js";

export enum Piece {
  Black = 1,
  White = 2,
  Empty = 0,
}

export type PlayerPiece = Piece.Black | Piece.White;

export function opposite(piece: PlayerPiece) {
  if (piece === Piece.Black) return Piece.White;
  return Piece.Black;
}

export class Board {
  data: Piece[][];

  constructor() {
    // 2D array, idx 0-7 on both axes
    const board: Piece[][] = new Array(8)
      .fill(null)
      .map(() => new Array(8).fill(Piece.Empty));

    this.data = board;
  }

  get(x: number, y: number): Piece | null {
    const column = this.data[x];
    if (column) {
      const piece = column[y];
      if (piece in Piece) {
        return piece;
      }
    }
    return null;
  }

  set(x: number, y: number, piece: Piece) {
    this.data[x][y] = piece;
  }

  flip(x: number, y: number): boolean {
    const target = this.get(x, y);
    if (!target) return false;

    const flipped = opposite(target);
    // if undef or empty (0)
    if (!flipped) return false;
    this.set(x, y, flipped);

    return true;
  }

  loop(callbackfn: (x: number, y: number, piece: Piece) => void) {
    // loop through 2D array by coordinates and piece value
    const board = this.data;
    for (const [x, col] of board.entries()) {
      for (const [y, piece] of col.entries()) {
        callbackfn(x, y, piece);
      }
    }
  }

  flanked(
    x: number,
    y: number,
    playerPiece: PlayerPiece,
    offset: Coords
  ): Coords[] {
    // for a given playerPiece and offset direction
    // return the opponent's pieces that are "flanked", if any
    // requires a piece of player's type to be endpoint in the direction
    const traversed: Coords[] = [];
    const { x: i, y: j } = offset;
    let continueFlag = false;
    let endcap = false;
    const targetCoords = { x: x + i, y: y + j };
    const initialTarget = this.get(targetCoords.x, targetCoords.y);
    if (initialTarget === opposite(playerPiece)) {
      continueFlag = true;
      while (continueFlag) {
        const targetPiece = this.get(targetCoords.x, targetCoords.y);
        // in bounds pieces, or until we hit the player's piece type
        if (targetPiece !== null && targetPiece === playerPiece) {
          endcap = true;
          continueFlag = false;
        }
        if (targetPiece !== null && targetPiece === opposite(playerPiece)) {
          traversed.push({ x: targetCoords.x, y: targetCoords.y });
          // then increment by the offset and go again
          targetCoords.x = targetCoords.x + i;
          targetCoords.y = targetCoords.y + j;
        } else {
          continueFlag = false;
        }
      }
    }

    return endcap ? traversed : [];
  }

  draw(theme: Theme): string {
    // take board data and return embeddable string
    const rowAlignedBoard = this.data[0].map((_val, y) =>
      this.data.map((row) => row[y])
    );
    const colHeading = `.   A  B  C  D  E  F  G  H\n`;
    const boardString =
      colHeading +
      rowAlignedBoard
        .map(
          (row, idx) =>
            `${idx + 1}  ${row.map((char) => theme[char]).join(" ")}`
        )
        .join("\n");

    return codeBlock(boardString);
  }
}
