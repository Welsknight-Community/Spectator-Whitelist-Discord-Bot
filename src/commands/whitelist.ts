import { Message } from "discord.js";
import * as MinecraftAPI from "minecraft-api";
import fs from "fs";
import { User } from "../types/user";
import axios, { AxiosRequestConfig } from "axios";
import { minecraftWhitelist } from "../utils/minecraft";
import dotenv from "dotenv";

//Configures environment variables
dotenv.config();

const GAME_SERVER = process.env.GAME_SERVER_ID;
const NEXUS_TOKEN = process.env.NEXUS_WHITELIST_ACCESS_TOKEN;

/**
 * @description The function that runs when the whitelist command is called
 * @param {Message} message - Discord message of the command
 * @param {string[]} args -  arguments of the command
 */
export const whitelistCommand = async (
  message: Message,
  args: string[]
): Promise<void> => {
  if (args.length == 0) {
    message.reply(`How to perform the command:
    !whitelist <Alt Account>
    Ex: !whitelist Zapdos_Alt`);
    return;
  }
  const uuid = await MinecraftAPI.uuidForName(args[0]);
  const rawdata = fs.readFileSync("spectators.json");
  const users: User[] = JSON.parse(rawdata.toString());
  if (users.some((u) => u.discordId == message.author.id)) {
    message.reply("You already setup a spectator account.");
    return;
  }
  const user = users.filter((u) => u.spectatorMinecraftUUID == uuid);
  if (user.length == 1) {
    message.reply("This account is already a spectator");
    return;
  }
  let options: AxiosRequestConfig = {
    url:
      "https://api.nexuswhitelist.com/users/user?discordId=" +
      message.author.id,
    headers: {
      Authorization: "Bearer " + NEXUS_TOKEN,
      "User-Agent":
        "DiscordBot (https://github.com/Welsknight-Community/Spectator-Whitelist-Discord-Bot, 11.3.0) Node.js/v12.16.0",
    },
    method: "get",
  };
  let mainMinecraftUUID: string;
  try {
    const resp = await axios(options);
    mainMinecraftUUID = resp.data.minecraftId;
    console.log(resp);
    if (mainMinecraftUUID == null) {
      message.reply(
        "You have not registered your main Minecraft account. Please do that before you whitelist your spectator account"
      );
      return;
    }
  } catch (error) {
    console.log(error);
    message.reply("Could not find your Discord account in Nexus Whitelist.");
    return;
  }
  options = {
    url:
      "https://api.nexuswhitelist.com/whitelist/" +
      GAME_SERVER +
      "/check?id=" +
      mainMinecraftUUID,
    headers: {
      Authorization: "Bearer " + NEXUS_TOKEN,
      "User-Agent":
        "DiscordBot (https://github.com/Welsknight-Community/Spectator-Whitelist-Discord-Bot, 11.3.0) Node.js/v12.16.0",
    },
    method: "get",
  };
  try {
    const resp = await axios(options);
    const whitelisted = resp.data.whitelisted;
    console.log(resp);
    if (whitelisted != true) {
      message.reply(
        `<@${message.author.id}> You are not whitelisted on the server you are trying to add the spectator account to.`
      );
      return;
    }
  } catch (error) {
    console.log(error);
    message.reply(
      "Could not find your main minecraft account in Nexus Whitelist."
    );
    return;
  }
  users.push({
    discordId: message.author.id,
    mainMinecraftUUID: mainMinecraftUUID.replace("-", ""),
    spectatorMinecraftUUID: uuid,
  });
  if ((await minecraftWhitelist(args[0])) == true) {
    fs.writeFileSync("spectators.json", JSON.stringify(users));
    message.reply(`The Minecraft account ${args[0]} has been whitelisted.`);
    return;
  }
  message.reply("Failed to connect to the Minecraft server. Try again later");
};
