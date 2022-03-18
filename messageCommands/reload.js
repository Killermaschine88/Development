module.exports = {
  name: "reload",
  devOnly: true,
  alias: ["rl"],
  async execute(message, args, client) {
    for (const path in require.cache) {
      if (path.endsWith(".js")) {
        delete require.cache[path];
      }
    }

    client.reload(client);
    await message.channel.send("Reloaded");
  },
};
