# Othello: an Othello clone Discord bot

<img width="352" alt="Text-based Othello game board" src="https://github.com/vphoebe/othello/assets/18145828/e7cbf403-813b-4ef0-ab74-a1b3789a3219">

## Features

- Fully text-based two-player Othello gameplay, using Discord message embeds in any channel
- Uses simple Discord slash commands which are aware of the active turn

## Usage and commands

Othello uses Discord slash commands. You can just type `/` in your text channel, and then click the Othello icon to see all the commands. Or you can read this.

| Command | Description |
| -- | -- |
| `/start [player 1] [player 2]` | Starts the game with the two users you specify. If any of the players are in an active game, it will be removed. |
| `/move [coordinates]`| Makes your player's move using the grid coordinates. Example: `/move c4` |
| `/pass` | Passes your turn to the next player. Used if there are no available moves. |
| `/rules` | Shows basic rules and usage for commands. |

## Installation

Othello is designed to be operated yourself, so there's a few things to set up first. Before you do anything though, you'll need to set up an application and bot on the [Discord developer portal](https://discord.com/developers/applications). Make sure to have this page handy because you'll need some info soon.

### Docker (recommended)

This is the fastest way to get Othello up and running. The [latest Docker image](https://hub.docker.com/r/nickseman/discord-othello) is at `nickseman/discord-othello:latest`

Make sure to configure the Docker container's environment according to the [Environment](#Environment) section below before starting it up.

Skip down to [Invite](#Invite) to see what's next.

### Node.js

You can also run this locally with Node/pm2 directly. Just make sure to run the `deploy` commmand before you start the main server process, or else the commands won't show up in your server.

### Environment

You'll need to configure the environment variables with a few things from the bot application you created earlier on the Discord developer portal.
| Variable | Value | Example |
|--|--|--|
| TOKEN | Your Discord bot's token. **Required.** | xxxxxxxxxxxx.yyyyyyyyy |
| CLIENT_ID | Your Discord bot's client ID. **Required.** | 00000000000 |
| GUILD_ID | Your Discord server's guild ID. **Required.** | 00000000000 |

### Invite

Check out the Discord developer portal > OAuth2 > URL Generator to create an invite link. Make sure the `bot` and `application.commands` scopes are set. Once you generate the link, visit that URL to invite the bot to your server.
