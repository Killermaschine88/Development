const { execShell } = require('../constants/functions/util.js')

module.exports = {
	name: 'restart',
  devOnly: true,
  alias: ['rs'],
	async execute(message, args, client) {

    //Imports

    //Code
    await message.channel.send('Restarting . . .')
		execShell('kill 1')
	},
};