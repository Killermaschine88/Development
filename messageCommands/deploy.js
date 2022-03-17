module.exports = {
	name: 'deploy',
  devOnly: true,
  alias: ['dp'],
	async execute(message, args, client) {

    //Imports
    const { commands } = require('../constants/client/commands.js')

    //Code
      await client.guilds.cache.get('944141746483372143')?.commands.set(commands)
			message.channel.send('Commands deployed.')
	},
};