const { commands } = require("../constants/client/commands.js");

module.exports = {
  name: "deploy",
  devOnly: true,
  alias: ["dp"],
  async execute(message, args, client) {
    await client.guilds.cache.get("944141746483372143")?.commands.set(commands);
    message.channel.send("Commands deployed.");
  },
};
