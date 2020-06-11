import Rcon from "rcon-srcds";

const IP = process.env.MINECRAFT_IP_ADDRESS;
const PORT = process.env.MINECRAFT_RCON_PORT;
const PASSWORD = process.env.MINECRAFT_RCON_PASSWORD;

/**
 * @description Whitelist username on the Minecraft server and adds username to spectator group
 * @param {string} username - Username to be whitelisted and set to spectator mode
 * @returns {Promise<boolean>} - The success of the whitelisting
 */
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

/**
 * @description Unwhitelist username on the Minecraft server
 * @param {string} username - Username to be unwhitelisted
 * @returns {Promise<boolean>} - The success of the unwhitelisting
 */
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
