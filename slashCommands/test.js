const { count } = require('../constants/functions/util.js')
  
module.exports = {
  name: "test",
  devOnly: false,
  async execute(interaction) {
    interaction.editReply(count())
  },
};