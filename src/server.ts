import { Client, DMChannel } from "discord.js";
import * as dotenv from "dotenv";
import { whitelistCommand } from "./commands/whitelist";
import { unwhitelistCommand } from "./commands/unwhitelist";
import { checkCommand } from "./commands/check";

dotenv.config();

const DISCORD_TOKEN = process.env.DISCORD_BOT_ACCESS_TOKEN;
const NEXUS_TOKEN = process.env.NEXUS_WHITELIST_ACCESS_TOKEN;
const PREFIX = process.env.PREFIX;

const client = new Client();

if (DISCORD_TOKEN == "" || NEXUS_TOKEN == "") {
  console.warn("No Discord or Nexus Whitelist Token Supplied!");
} else {
  client.login(DISCORD_TOKEN);
}

client.on("ready", () => {
  console.log("Logged on as " + client.user.tag);
});

client.on("message", (message) => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;
  if (
    message.channel instanceof DMChannel ||
    typeof message.guild === undefined
  ) {
    message.reply(
      "Bot commands can only be executed from the Discord server channel!"
    );
    return;
  }
  const args = message.content.slice(PREFIX.length).split(/ +/);
  const command = args.shift().toLowerCase();
  if (command == "whitelist") {
    whitelistCommand(message, args);
  } else if (command == "unwhitelist") {
    unwhitelistCommand(message, args);
  } else if (command == "check") {
    checkCommand(message, args);
  }
});
