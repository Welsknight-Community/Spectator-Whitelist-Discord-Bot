import dotenv from "dotenv";
import Rcon from "rcon-srcds";

dotenv.config();

const IP = process.env.MINECRAFT_IP_ADDRESS;
const PORT = process.env.MINECRAFT_RCON_PORT;
const PASSWORD = process.env.MINECRAFT_RCON_PASSWORD;

export const minecraftWhitelist = async (
  username: string
): Promise<boolean> => {
  console.log(PASSWORD);
  const server = new Rcon({ host: IP, port: PORT });
  try {
    await server.authenticate(PASSWORD);
    console.log(`Authenticated on  ${IP}:${PORT}`);
    server.execute("whitelist add " + username);
    console.log(`Whitelisted ${username} on ${IP}:${PORT}`);
    server.execute(`lp user ${username} parent set spectators`);
    console.log(`Set ${username} to Spectator Mode on ${IP}:${PORT}`);
    return true;
  } catch {
    console.log(`Failed to whitelist username on ${IP}:${PORT}`);
    return false;
  }
};

export const minecraftUnwhitelist = async (
  username: string
): Promise<boolean> => {
  console.log(PASSWORD);

  const server = new Rcon({ host: IP, port: PORT });
  try {
    await server.authenticate(PASSWORD);
    console.log(`Authenticated on  ${IP}:${PORT}`);
    server.execute("whitelist remove " + username);
    console.log(`Unwhitelisted username on ${IP}:${PORT}`);
    return true;
  } catch (e) {
    console.log(`Failed to unwhitelist username on ${IP}:${PORT}`);
    return false;
  }
};
