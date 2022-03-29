const { commands } = require("../constants/client/commands.js");

module.exports = {
  name: "deploy",
  devOnly: true,
  alias: ["dp"],
  async execute(message, args, client) {
    await client.guilds.cache.get(message.guild.id)?.commands.set(commands);
    message.channel.send("Commands deployed.");
  },
};
