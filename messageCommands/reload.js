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

    try {
      client.reload(client);
      await message.channel.send("Reloaded");
    } catch (e) {
      await message.channel.send(`\`\`\`js\n${e.stack}\`\`\``);
    }
  },
};
