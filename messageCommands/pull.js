const { exec } = require("child_process");
const Discord = require("discord.js");

module.exports = {
  name: "pull",
  devOnly: true,
  alias: [],
  async execute(message, args, client) {
    exec("git pull origin main", (err, stdout, stderr) => {
      console.log({ err, stdout, stderr });
      if (stdout.includes("Already up to date.")) return message.channel.send({ embeds: [new Discord.MessageEmbed().setColor("GREEN").setDescription("Already upto date.")] });
      else {
        return message.channel.send({
          embeds: [
            new Discord.MessageEmbed()
              .setColor("GREEN")
              .setTitle("Git pull")
              .setDescription("```ansi\n" + stdout + "\n```\n\n```diff\n" + stderr + "\n```\n"),
          ],
        });
      }
    });
  },
};
