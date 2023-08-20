import { enabledCommands } from "./commands/index.js";
import { REST, Routes } from "discord.js";
import { config } from "dotenv";

config();

const commands = enabledCommands.map((cmd) => cmd.data.toJSON());

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.TOKEN ?? "");

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID ?? "",
        process.env.GUILD_ID ?? ""
      ),
      { body: commands }
    );

    console.log(
      `Deployed application commands to guild: ${process.env.GUILD_ID}`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
