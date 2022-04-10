const Discord = require("discord.js");

const { generateMap, renderMap, handleMovementButtonClick } = require("../constants/game/functions.js");
const { rows } = require("../constants/game/util.js");

module.exports = {
  name: "game",
  devOnly: false,
  async execute(interaction) {
    let obj = generateMap({ width: 5, height: 5 });

    const embed = new Discord.MessageEmbed().setDescription(renderMap(obj, 3));

    const msg = await interaction.editReply({ embeds: [embed], components: rows });

    const collector = msg.createMessageComponentCollector({
      componentType: "BUTTON",
      time: 10 * 60 * 1000,
    });

    collector.on("collect", async (i) => {
      if (i.user.id !== interaction.user.id) return;
      await i.deferUpdate();

      if (["up", "down", "left", "right"].includes(i.customId)) {
        obj = handleMovementButtonClick(obj, i);
      }

      if (i.customId === "cancel") {
        return collector.stop();
      }

      embed.setDescription(renderMap(obj, 3));

      await interaction.editReply({ embeds: [embed] });
    });

    collector.on("stop", async () => {
      return await interaction.editReply({ components: [] });
    });
  },
};
