const { MessageEmbed } = require("discord.js");
const { exec } = require("child_process");

module.exports = {
  name: "pull",
  devOnly: false,
  async execute(interaction) {
    // Ignore if not dev access role
    if (!interaction.member.roles.cache.has("1010570031664484402")) return interaction.editReply("Go away nerd!");

    // CD into Minecraft Directory and Git Pull
    exec("cd /home/Minecraft && git pull", (err, stdout, stderr) => {
      console.log({ err, stdout, stderr });
      if (stdout.includes("Already up to date.")) return interaction.editReply({ embeds: [new MessageEmbed().setColor("GREEN").setDescription("Already upto date.")] });
      else {
        return interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setColor("GREEN")
              .setTitle("Git pull")
              .setDescription("```ansi\n" + stdout + "\n```\n\n```diff\n" + stderr + "\n```\n"),
          ],
        });
      }
    });
  },
};
