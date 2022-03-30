module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (!message.content.startsWith(process.env.PREFIX || "?")) return;
    if (message.author.bot) return;
    if (message.channel.parent.id === "954349475151888424") return;

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

async function getTicketUsers(channel) {
  let state = true;
  let id = "0";
  let collections = [];
  let users = [];

  while (state) {
    const collection = await channel.messages.fetch({ limit: 100, after: id });
    if (collection.size === 0) {
      state = false;
    } else {
      id = collection.first().id;
      collections.push(collection);
    }
  }

  for (const coll of collections) {
    coll.forEach((m) => {
      const user = users.find((u) => u.id === m.author.id);
      if (user) {
        user.messages++;
      } else {
        users.push({ id: m.author.id, tag: m.author.tag, messages: 1 });
      }
    });
  }

  users = users.sort((a, b) => b.messages - a.messages);
  let str = "";
  for (const user of users) {
    str += `${user.messages} - <@!${user.id}> - ${user.tag}\n`;
  }
  return str;
}
