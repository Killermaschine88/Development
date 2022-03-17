module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    //Imports

    //Code
    if (!message.content.startsWith(process.env.PREFIX || "?")) return;
    if (message.author.bot) return;

    const args = message.content
      .slice(process.env.PREFIX || "?")
      .trim()
      .split(/ +/);
    const commandName = args
      .shift()
      .toLowerCase()
      .replace(process.env.PREFIX || "?", "");
    const command = client.messageCommands.get(commandName) || client.messageCommands.find((cmd) => cmd.alias.includes(commandName));

    if (!command) return;

    if (command.devOnly) {
      if (!client.application?.owner?.id) {
        await client.application.fetch();
      }
      if (message.author.id !== client.application?.owner?.id) {
        return message.channel.send("Only my developer is allowed to use this");
      }
    }

    if (process.env.LOGGING) {
      log(`${command.name} used by ${message.author.tag}`);
    }

    await command.execute(message, args, client);
  },
};
