import { CommandDefinition } from "../types.js";
import move from "./move.js";
import pass from "./pass.js";
import start from "./start.js";
import rules from "./rules.js";

export const enabledCommands: CommandDefinition[] = [start, move, pass, rules];
