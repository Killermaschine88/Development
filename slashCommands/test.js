const { MessageEmbed } = require('discord.js')
const { getMessageInput } = require('../constants/functions/util.js')
module.exports = {
  name: "test",
  devOnly: false,
  async execute(interaction) {

    await getMessageInput(interaction)
  }
}