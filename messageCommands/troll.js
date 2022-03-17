module.exports = {
	name: 'troll',
	devOnly: true,
	alias: ['tr'],
	async execute(message, args, client) {

		//Imports
    const Discord = require('discord.js')

		//Code
		await message.delete()
		let channelname;

		if(message.mentions.channels.first()) {
			channelname = message.mentions.channels.first().name
		message.mentions.channels.first().send({
				content: '<https://discord.troll/ZJMqnRdTgaKaUZY>',
				files: ['https://cdn.discordapp.com/attachments/222197033908436994/948198728408375296/Gift.png'],
				components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setStyle('SUCCESS').setCustomId('troll').setLabel('Accept'))]
			})
		} else {

			channelname = message.channel.name

			message.channel.send({
				content: '<https://discord.gif/ZJMqnRdTgaKaUZY>',
				files: ['https://cdn.discordapp.com/attachments/222197033908436994/948198728408375296/Gift.png'],
				components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setStyle('SUCCESS').setCustomId('troll').setLabel('Accept'))]
			})
		}

		/*client.users.fetch('570267487393021969').then(async u => {
			await u.send(`Troll used by ${message.author.tag} into ${channelname}`)
		})*/
	},
};