const { execShell } = require("../constants/functions/util.js");

module.exports = {
  name: "restart",
  devOnly: true,
  alias: ["rs"],
  async execute(message, args, client) {
    await message.channel.send("Restarting . . .");
    execShell("kill 1");
  },
};
