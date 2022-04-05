const Discord = require("discord.js");
let { rows, calculate, checkRows } = require("../constants/functions/calculator.js");

module.exports = {
  name: "calculator",
  devOnly: false,
  async execute(interaction) {
    const message = await interaction.editReply({ content: '0', components: rows });

    const collector = message.createMessageComponentCollector({
      componentType: "BUTTON",
      time: 5 * 60000,
    });

    let str = '0';
    let ans = '0';

    collector.on("collect", async (i) => {
      if (i.user.id !== interaction.user.id) return;
      await i.deferUpdate();
      const res = calculate(i.customId, str, ans);
      str = res.str !== '' ? res.str : '0'
      ans = res.ans !== '' ? res.ans : '0'

      await interaction.editReply({ content: str });
    });

    collector.on("end", async () => {
      await interaction.editReply({ content: 'Calculator expired', components: [] });
    });
  },
};
