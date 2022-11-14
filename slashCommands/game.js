const Discord = require("discord.js");

const { GameMap, handleMovementButtonClick } = require("../constants/game/functions.js");
const { rows } = require("../constants/game/util.js");

module.exports = {
  name: "game",
  devOnly: false,
  async execute(interaction) {
    await interaction.editReply("Started generating Map...");
    let map = new GameMap({ height: 2500, width: 2500 });

    let viewDistance = interaction.options.getInteger("distance");
    if (!viewDistance || viewDistance > 6) viewDistance = 3;
    const embed = new Discord.MessageEmbed().setDescription(map.renderMap(viewDistance)).setColor("GREEN");

    const msg = await interaction.editReply({ content: null, embeds: [embed], components: rows });

    const collector = msg.createMessageComponentCollector({
      componentType: "BUTTON",
      time: 14 * 60 * 1000,
    });

    let stats = {
      steps: 0,
      treasures: 0,
    };

    collector.on("collect", async (i) => {
      if (i.user.id !== interaction.user.id) return;
      await i.deferUpdate();

      if (["up", "down", "left", "right"].includes(i.customId)) {
        const returned = handleMovementButtonClick(map, i);
        if (returned?.error) {
          return await interaction.followUp({ content: returned.error, ephemeral: true });
        }
        map.pos = returned.obj.pos;
      }

      if (i.customId === "cancel") {
        return collector.stop();
      }

      embed.setDescription(map.renderMap(viewDistance));
      //embed.fields = [];
      //embed.addField("Stats", `Steps taken: ${stats.steps}\nTreasures found: ${stats.treasures}`);

      await interaction.editReply({ embeds: [embed] });
    });

    collector.on("end", async () => {
      embed.setColor("RED");
      return await interaction.editReply({ embeds: [embed], components: [] });
    });
  },
};
