const Discord = require("discord.js");
const checkmark = "✅";
const cross = "❌";
const { gameStartCheck, notifyPlayers } = require("../constants/functions/games/game.js");

module.exports = {
  name: "tictactoe",
  devOnly: false,
  async execute(interaction) {
    const opponent = interaction.options.getUser("opponent");

    const check = gameStartCheck(interaction, opponent);

    if (check.state) {
      return await interaction.editReply(check.reason);
    }

    await interaction.channel.send(notifyPlayers(interaction, opponent, "TicTacToe"));

    const embed = new Discord.MessageEmbed().setTitle("TicTacToe Match").setColor("GREEN").setDescription(`Current turn: \`${interaction.user.tag}\`\n\n\`${interaction.user.tag}: ${checkmark}\`\n\`${opponent.tag}: ${cross}\``);

    const rows = [new Discord.MessageActionRow(), new Discord.MessageActionRow(), new Discord.MessageActionRow()];
    const players = [interaction.user.tag, opponent.tag];

    let i = 0;
    let j = 0;

    while (i < 3) {
      while (j < 3) {
        rows[i].components.push(new Discord.MessageButton().setLabel("​").setStyle("SECONDARY").setCustomId(`${i}${j}`));
        j++;
      }
      j = 0;
      i++;
    }

    const message = await interaction.editReply({
      embeds: [embed],
      components: rows,
    });

    const collector = message.createMessageComponentCollector({
      componentType: "BUTTON",
      time: 5 * 60000,
    });

    let current_turn_id = interaction.user.id;

    collector.on("collect", async (i) => {
      if (i.user.id !== current_turn_id) return;
      await i.deferUpdate();

      const index1 = i.customId.charAt(0);
      const index2 = i.customId.charAt(1);

      rows[index1].components[index2].disabled = true;
      rows[index1].components[index2].label = current_turn_id === interaction.user.id ? checkmark : cross;

      current_turn_id = current_turn_id === interaction.user.id ? opponent.id : interaction.user.id; //changing current turn id

      const result = winCheck(rows, players);

      if (result.state) {
        embed.addField("Result", `Winner: \`${result.winner}\``);
        return collector.stop();
      }

      let j = 0;

      for (const row of rows) {
        for (const button of row.components) {
          if (button.disabled) j++;
        }
      }

      if (j === 9) {
        embed.addField("Result", "Tie");
        return collector.stop();
      }

      embed.setDescription(`Current turn: \`${players[`${i.user.id === interaction.user.id ? 1 : 0}`]}\`\n\n\`${interaction.user.tag}: ${checkmark}\`\n\`${opponent.tag}: ${cross}\``);

      await interaction.editReply({ embeds: [embed], components: rows });
    });

    collector.on("end", async () => {
      for (const row of rows) {
        for (const button of row.components) {
          button.disabled = true;
        }
      }
      embed.setDescription(`\`${interaction.user.tag}: ${checkmark}\`\n\`${opponent.tag}: ${cross}\``);

      return await interaction.editReply({ embeds: [embed], components: rows });
    });
  },
};

function winCheck(rows, players) {
  let winner = null;
  const row0 = rows[0].components;
  const row1 = rows[1].components;
  const row2 = rows[2].components;

  //vertical
  if (row0[0].label === checkmark && row0[1].label === checkmark && row0[2].label === checkmark) {
    winner = players[0];
  }
  if (row0[0].label === cross && row0[1].label === cross && row0[2].label === cross) {
    winner = players[1];
  }
  if (row1[0].label === checkmark && row1[1].label === checkmark && row1[2].label === checkmark) {
    winner = players[0];
  }
  if (row1[0].label === cross && row1[1].label === cross && row1[2].label === cross) {
    winner = players[1];
  }
  if (row2[0].label === checkmark && row2[1].label === checkmark && row2[2].label === checkmark) {
    winner = players[0];
  }
  if (row2[0].label === cross && row2[1].label === cross && row2[2].label === cross) {
    winner = players[1];
  }

  //horizontal
  if (row0[0].label === checkmark && row1[0].label === checkmark && row2[0].label === checkmark) {
    winner = players[0];
  }
  if (row0[0].label === cross && row1[0].label === cross && row2[0].label === cross) {
    winner = players[1];
  }
  if (row0[1].label === checkmark && row1[1].label === checkmark && row2[1].label === checkmark) {
    winner = players[0];
  }
  if (row0[1].label === cross && row1[1].label === cross && row2[1].label === cross) {
    winner = players[1];
  }
  if (row0[2].label === checkmark && row1[2].label === checkmark && row2[2].label === checkmark) {
    winner = players[0];
  }
  if (row0[2].label === cross && row1[2].label === cross && row2[2].label === cross) {
    winner = players[1];
  }

  //diagonal
  if (row0[0].label === checkmark && row1[1].label === checkmark && row2[2].label === checkmark) {
    winner = players[0];
  }
  if (row0[0].label === cross && row1[1].label === cross && row2[2].label === cross) {
    winner = players[1];
  }
  if (row0[2].label === checkmark && row1[1].label === checkmark && row2[0].label === checkmark) {
    winner = players[0];
  }
  if (row0[2].label === cross && row1[1].label === cross && row2[0].label === cross) {
    winner = players[1];
  }

  //return winner
  return { state: winner ? true : false, winner: winner };
}
