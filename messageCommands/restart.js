module.exports = {
	name: 'restart',
  devOnly: true,
  alias: ['rs'],
	async execute(message, args, client) {

    //Imports
    const { execShell } = require('../constants/functions/util.js')

    //Code
    await message.channel.send('Restarting . . .')
		execShell('kill 1')
	},
};