const Discord = require("discord.js");
let { rows, calculate, checkRows } = require("../constants/functions/calculator.js");

module.exports = {
  name: "calculator",
  devOnly: false,
  async execute(interaction) {
    const message = await interaction.editReply({ content: null, components: rows });

    const collector = message.createMessageComponentCollector({
      componentType: "BUTTON",
      time: 5 * 60000,
    });

    let str = null;
    let ans = null;

    collector.on("collect", async (i) => {
      if (i.user.id !== interaction.user.id) return;
      await i.deferUpdate();
      const res = calculate(i.customId, str, ans);
      str = res.str;
      ans = res.ans;

      rows = checkRows(rows, ans)

      await interaction.editReply({ content: str, components: rows });
    });

    collector.on("end", async () => {
      await interaction.editReply({ content: 'Calculator expired', components: [] });
    });
  },
};
