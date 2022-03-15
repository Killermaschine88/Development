const Discord = require('discord.js')
const red = '🔴'
const yellow = '🟡'
const empty = '⚫'

module.exports = {
  name: "connect4",
  devOnly: false,
  async execute(interaction) {

    //Importing
    const Discord = require('discord.js')
    const red = '🔴'
    const yellow = '🟡'
    const empty = '⚫'

    //Code
    const opponent = interaction.options.getUser('opponent')

    /*if(opponent.bot) {
      return await interaction.editReply(`Can't play against \`${opponent.tag}\` as they are a bot.`)
    }

    if(interaction.user.id === opponent.id) {
      return await interaction.editReply(`You can't play against yourself.`)
    }*/

    let board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ]

    let cache = {'0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0}

    const players = [interaction.user.tag, opponent.tag]

    const embed = new Discord.MessageEmbed().setTitle('Connect4 Match').setColor('GREEN').addField('Players', `\`${interaction.user.tag}\`: ${red}\n\`${opponent.tag}\`: ${yellow}`).setDescription(`Current Turn: \`${players[0]}\`\n\n${renderBoard(board)}`)

    const rows = [new Discord.MessageActionRow(), new Discord.MessageActionRow()]
    const numbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣']

    let i = 0
    while (i < 7) {
      if(i < 5) {
        rows[0].components.push(new Discord.MessageButton().setStyle('PRIMARY').setCustomId(`${i}`).setLabel(numbers[i]))
        i++
      } else {
        rows[1].components.push(new Discord.MessageButton().setStyle('PRIMARY').setCustomId(`${i}`).setLabel(numbers[i]))
        i++
      }
    }
    
    const message = await interaction.editReply({ embeds: [embed], components: rows })
    await interaction.channel.send({content: `Hey <@${opponent.id}>, <@${interaction.user.id}> challenged you to a game of Connect4.`})

    const collector = message.createMessageComponentCollector({
			componentType: 'BUTTON',
			time: 5 * 60000,
		});

    let current_turn_id = interaction.user.id

    collector.on('collect', async (i) => {
      await i.deferUpdate()
      if(i.user.id !== current_turn_id) {
        return
      }

      board = updateBoard(board, i.customId.charAt(0), current_turn_id, interaction)
      embed.setDescription(`Current Turn: \`${players[`${i.user.id === interaction.user.id ? 1 : 0}`]}\`\n\n${renderBoard(board)}`)
      
      current_turn_id = current_turn_id === interaction.user.id ? opponent.id : interaction.user.id //changing current turn id

      cache[i.customId] += 1

      if(cache[i.customId] === 6) {
        if(Number(i.customId) < 5) {
          rows[0].components[i.customId].disabled = true
        } else {
          rows[1].components[Number(i.customId) - 5].disabled = true
        }
      }

      const check = winCheck(board, players, rows)

      if(check.state === 'Tie') {
        await embed.addField(`${check.state}`, `${check.state}`)
        return collector.stop()
      }

      await interaction.editReply({embeds: [embed], components: rows})
    })

    collector.on('end', async () => {
      await interaction.editReply({components: [], embeds: [embed]})
    })
  }
}

function renderBoard(board) {
  let str = ''
  let i = 0
	for(const row of board) {
    for(const index of row) {
      i++
      if(index === 0) str += empty
      else if(index === 1) str += red
      else if(index === 2) str += yellow

      if(i >= row.length) str += '\n'
    }
    i = 0
  }
  str += ':one::two::three::four::five::six::seven:' //add row indicator
  return str
}

function updateBoard(board, row, id, interaction) {
  let i = 0

  for(const r of board) {
    if(r[row] === 0) i++
  }
  board[i-1][row] = id === interaction.user.id ? 1 : 2

  return board
}

function winCheck(board, players, rows) {
  //tie check
  let i = 0
  for(const row of rows) {
    for(const index of row.components) {
      if(index.disabled) i++
    }
  }


  //return states
  if(i === 7) {
    return { winner: null, state: 'Tie'}
  } else {
    return { winner: null, state: null }
  }
}