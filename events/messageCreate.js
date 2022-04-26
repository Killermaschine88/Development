const { checkAutomation } = require("../constants/functions/automation.js");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if ((message.channel.id === "968043926877503492" || message.channel.id === "968414012788342784") && message.author.id === "844951901653041203") {
      shards.push({
        name: message.embeds[0].fields[1].value,
        price: message.embeds[0].fields[0].value,
        rarity: message.embeds[0].fields[2].value,
        image: message.attachments.first().url,
        command: message.embeds[0].description.replaceAll("`", ""),
      });
    }
    if (message.author.bot) return;
    if (await checkAutomation(message, client)) {
      return;
    }

    if (!message.content.startsWith(process.env.PREFIX || "?")) return;

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
