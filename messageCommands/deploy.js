module.exports = {
	name: 'deploy',
  devOnly: true,
  alias: ['dp'],
	async execute(message, args, client) {

    //Imports
    const { commands } = require('../constants/client/commands.js')

    //Code
		if (message.author.id !== client.application?.owner?.id) return message.channel.send("Can't use this!");

		if (!client.application?.owner) await client.application?.fetch();

		if (message.author.id === client.application?.owner.id) {

      await client.guilds.cache.get('944141746483372143')?.commands.set(commands)
			message.channel.send('Commands deployed.');
		}
	},
};