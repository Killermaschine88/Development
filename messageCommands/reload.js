module.exports = {
	name: 'reload',
  devOnly: true,
  alias: ['rl'],
	async execute(message, args, client) {

    //Imports

    //Code
		if (message.author.id !== client.application?.owner?.id) return message.channel.send("Can't use this!");

		if (!client.application?.owner) await client.application?.fetch();

		if (message.author.id === client.application?.owner.id) {

      for (const path in require.cache) {
        if (path.endsWith('.js')) {
          delete require.cache[path]
        }
      }

      client.reload(client)
      await message.channel.send('Reloaded')
		}
	},
};