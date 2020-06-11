import { Message } from "discord.js";
import * as MinecraftAPI from "minecraft-api";
import fs from "fs";
import { User } from "../types/user";
import { minecraftUnwhitelist } from "../utils/minecraft";

export const unwhitelistCommand = async (
  message: Message,
  args: string[]
): Promise<void> => {
  if (!message.member.hasPermission("ADMINISTRATOR")) {
    message.reply("You do not have the permission to run this command");
    return;
  } else if (args.length == 0) {
    message.reply(`How to perform the command:
    !unwhitelist <Discord Id>
    Ex: !unwhitelist 136925587120979969`);
    return;
  } else if (isNaN(args[0] as any)) {
    message.reply("No valid Discord Id provided");
    return;
  }
  const rawdata = fs.readFileSync("spectators.json");
  const users: User[] = JSON.parse(rawdata.toString());
  const newUsers = users.filter((u) => u.discordId != message.author.id);
  if (newUsers.length == users.length) {
    message.reply(
      `Account with Discord id ${args[0]} does not have an associate spectator account`
    );
    return;
  }
  const user = users.filter((u) => u.discordId == message.author.id);
  const username = await MinecraftAPI.nameForUuid(
    user[0].spectatorMinecraftUUID
  );
  if (await minecraftUnwhitelist(username)) {
    fs.writeFileSync("spectators.json", JSON.stringify(newUsers));
    message.reply(`The Minecraft account ${username} has been unwhitelisted.`);
    return;
  }
  message.reply("Failed to connect to the Minecraft server. Try again later");
};
