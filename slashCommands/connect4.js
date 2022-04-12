const Discord = require("discord.js");
const red = "🔴";
const yellow = "🟡";
const empty = "⚫";
const { gameStartCheck, notifyPlayers } = require("../constants/functions/games/game.js");

module.exports = {
  name: "connect4",
  devOnly: false,
  async execute(interaction) {
    const opponent = interaction.options.getUser("opponent");

    const check = gameStartCheck(interaction, opponent);

    if (check.state) {
      return await interaction.editReply(check.reason);
    }

    await interaction.channel.send(notifyPlayers(interaction, opponent, "Connect4"));

    let board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ];

    let cache = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

    const players = [interaction.user.tag, opponent.tag];

    const embed = new Discord.MessageEmbed()
      .setTitle("Connect4 Match")
      .setColor("GREEN")
      .addField("Players", `\`${interaction.user.tag}\`: ${red}\n\`${opponent.tag}\`: ${yellow}`)
      .setDescription(`Current Turn: \`${players[0]}\`\n\n${renderBoard(board)}`);

    const rows = [new Discord.MessageActionRow(), new Discord.MessageActionRow()];
    const numbers = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣"];

    let i = 0;
    while (i < 7) {
      if (i < 5) {
        rows[0].components.push(new Discord.MessageButton().setStyle("PRIMARY").setCustomId(`${i}`).setLabel(numbers[i]));
        i++;
      } else {
        rows[1].components.push(new Discord.MessageButton().setStyle("PRIMARY").setCustomId(`${i}`).setLabel(numbers[i]));
        i++;
      }
    }

    const message = await interaction.editReply({
      embeds: [embed],
      components: rows,
    });

    const collector = message.createMessageComponentCollector({
      componentType: "BUTTON",
      time: 10 * 60000,
    });

    let current_turn_id = interaction.user.id;

    collector.on("collect", async (i) => {
      if (i.user.id !== current_turn_id) return;
      await i.deferUpdate();

      board = updateBoard(board, i.customId.charAt(0), current_turn_id, interaction);
      embed.setDescription(`Current Turn: \`${players[`${i.user.id === interaction.user.id ? 1 : 0}`]}\`\n\n${renderBoard(board)}`);

      current_turn_id = current_turn_id === interaction.user.id ? opponent.id : interaction.user.id; //changing current turn id

      cache[i.customId] += 1;

      if (cache[i.customId] === 6) {
        if (Number(i.customId) < 5) {
          rows[0].components[i.customId].disabled = true;
        } else {
          rows[1].components[Number(i.customId) - 5].disabled = true;
        }
      }

      const check = winCheck(board, players, rows);

      if (check.state === "Tie") {
        embed.addField(`Result`, `Tie`);
        return collector.stop();
      } else if (check.state === "Won") {
        embed.addField("Result", `Winner: \`${check.winner}\``);
        return collector.stop();
      }

      await interaction.editReply({ embeds: [embed], components: rows });
    });

    collector.on("end", async () => {
      embed.setDescription(renderBoard(board));
      await interaction.editReply({ components: [], embeds: [embed] });
    });
  },
};

function renderBoard(board) {
  let str = "";
  let i = 0;
  for (const row of board) {
    for (const index of row) {
      i++;
      if (index === 0) str += empty;
      else if (index === 1) str += red;
      else if (index === 2) str += yellow;

      if (i >= row.length) str += "\n";
    }
    i = 0;
  }
  str += ":one::two::three::four::five::six::seven:"; //add row indicator
  return str;
}

function updateBoard(board, row, id, interaction) {
  let i = 0;

  for (const r of board) {
    if (r[row] === 0) i++;
  }
  board[i - 1][row] = id === interaction.user.id ? 1 : 2;

  return board;
}

function checkRow({ board, value }) {
  // iterating the board
  for (const row of board) {
    let consecutiveMatchCount = 0;
    // iterating the row
    for (const dot of row) {
      // checking if the element from the next column equals the value
      if (dot === value) {
        consecutiveMatchCount++;
        if (consecutiveMatchCount === 4) return true;
      } else {
        consecutiveMatchCount = 0;
      }
    }
  }
  return false;
}

function checkColumn({ board, value }) {
  let consecutiveMatchCount = 0;
  // iterating the board
  for (const row of board) {
    // iterating the row and getting index
    for (const [columnIndex, dot] of row.entries()) {
      if (dot === value) {
        // checking if there are 4 elements with the same value in the same column
        for (const secondRowIteration of board) {
          if (secondRowIteration[columnIndex] === value) {
            consecutiveMatchCount++;
          } else {
            consecutiveMatchCount = 0;
          }
        }
      }
    }
    if (consecutiveMatchCount === 4) return true;
  }
  return false;
}

function checkDiagonal({ board, value, up }) {
  // iterating the board and getting index
  for (let [rowIndex, row] of board.entries()) {
    // iterating the row and getting index
    for (let [columnIndex, dot] of row.entries()) {
      if (dot === value) {
        let rowIndexValue = rowIndex
        // Creating index holders
        let columnIndexValue = columnIndex
        let consecutiveMatchCount = 0;
        // while the following element of the diagonal equals the value
        while (board[rowIndexValue]?.[columnIndexValue] === value) {
          consecutiveMatchCount++;
          if (consecutiveMatchCount === 4) return true;
          // going up and right
          if (up) {
            rowIndexValue--;
            columnIndexValue++;
            // going down and right
          } else {
            rowIndexValue++;
            columnIndexValue++;
          }
        }
      }
    }
  }
  return false;
}

function checkWinFromPlayer(board, value) {
  return checkDiagonal({ board, up: true, value }) || checkDiagonal({ board, up: false, value }) || checkRow({ board, value }) || checkColumn({ board, value });
}

function winCheck(board, players, rows) {
  //tie check
  let count = 0;
  for (const row of rows) {
    for (const index of row.components) {
      if (index.disabled) count++;
    }
  }
  //rest
  let winner = null;
  if (checkWinFromPlayer(board, 1)) winner = players[0];
  if (checkWinFromPlayer(board, 2)) winner = players[1];

  //return states
  if (count === 7) {
    return { winner: null, state: "Tie" };
  } else if (winner) {
    return { winner: winner, state: "Won" };
  } else {
    return { winner: null, state: null };
  }
}
