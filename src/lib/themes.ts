/* eslint-disable no-irregular-whitespace */
import { Piece } from "./board.js";

export type Theme = { pieces: Record<Piece, string>; colHeading: string };

export const themes: Record<string, Theme> = {
  default: {
    pieces: {
      [Piece.Black]: "🔵",
      [Piece.White]: "⚪️",
      [Piece.Empty]: "🟩",
    },
    colHeading: `  a⬛️b⬛️c⬛️d⬛️e⬛️f⬛️g⬛️h\n`,
  },
};
