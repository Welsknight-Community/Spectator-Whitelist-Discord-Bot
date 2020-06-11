import { Message } from "discord.js";
import { User } from "../types/user";
import * as MinecraftAPI from "minecraft-api";
import fs from "fs";

export const checkCommand = async (
  message: Message,
  args: string[]
): Promise<void> => {
  if (!message.member.hasPermission("ADMINISTRATOR")) {
    message.reply("You do not have the permission to run this command");
    return;
  } else if (args.length == 0) {
    message.reply(`How to perform the command:
    !check <Discord Id | Minecraft UUID | Minecraft Username>
    Ex: !check 136925587120979969`);
    return;
  }
  const rawdata = fs.readFileSync("spectators.json");
  const users: User[] = JSON.parse(rawdata.toString());
  let user: User = null;
  if (users.some((u) => u.discordId == args[0])) {
    console.log("Test");
    user = users.filter((u) => u.discordId == args[0])[0];
  } else if (users.some((u) => u.mainMinecraftUUID == args[0])) {
    user = users.filter((u) => u.mainMinecraftUUID == args[0])[0];
  } else if (users.some((u) => u.spectatorMinecraftUUID == args[0])) {
    user = users.filter((u) => u.spectatorMinecraftUUID == args[0])[0];
  } else {
    try {
      const uuid = await MinecraftAPI.uuidForName(args[0]);
      if (users.some((u) => u.mainMinecraftUUID == uuid)) {
        user = users.filter((u) => u.mainMinecraftUUID == uuid)[0];
      } else if (users.some((u) => u.spectatorMinecraftUUID == uuid)) {
        user = users.filter((u) => u.spectatorMinecraftUUID == uuid)[0];
      }
    } catch {
      console.log("Unable to find Minecraft Profile with username: " + args[0]);
    }
  }
  if (user == null) {
    message.reply(
      `Could not find spectator information based on the following id: ${args[0]}`
    );
    return;
  }
  message.reply(`Here is the information we have for this user:
  Discord: <@${user.discordId}>
  Main Minecraft Username: ${await MinecraftAPI.nameForUuid(
    user.mainMinecraftUUID
  )}
  Main Minecraft UUID: ${user.mainMinecraftUUID}
  Spectator Minecraft Username: ${await MinecraftAPI.nameForUuid(
    user.spectatorMinecraftUUID
  )}
  Spectator Minecraft UUID: ${user.spectatorMinecraftUUID}
  `);
};
