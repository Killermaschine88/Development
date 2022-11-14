const { MessageEmbed } = require("discord.js");
const { exec } = require("child_process");

module.exports = {
  name: "pull",
  devOnly: false,
  async execute(interaction) {
    // Ignore if not dev access role
    if (!interaction.member.roles.cache.has("1010570031664484402")) return;

    // CD into Minecraft Directory
    exec("cd /home/Minecraft", (err, stdout, stderr) => {
      console.log({ err, stdout, stderr });
      // Git Pull
      exec("git pull", (err, stdout, stderr) => {
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
    });

    // // Git Pull
    // exec("git pull", (err, stdout, stderr) => {
    //   console.log({ err, stdout, stderr });
    //   if (stdout.includes("Already up to date.")) return interaction.editReply({ embeds: [new MessageEmbed().setColor("GREEN").setDescription("Already upto date.")] });
    //   else {
    //     return interaction.editReply({
    //       embeds: [
    //         new MessageEmbed()
    //           .setColor("GREEN")
    //           .setTitle("Git pull")
    //           .setDescription("```ansi\n" + stdout + "\n```\n\n```diff\n" + stderr + "\n```\n"),
    //       ],
    //     });
    //   }
    // });
  },
};
