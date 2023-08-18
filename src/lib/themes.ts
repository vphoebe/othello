import { Piece } from "./board.js";

export type Theme = Record<Piece, string>;

export const themes: Record<string, Theme> = {
  default: {
    [Piece.Black]: "🔵",
    [Piece.White]: "⚪️",
    [Piece.Empty]: "🟩",
  },
};
