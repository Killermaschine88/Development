module.exports = {
  name: "interactionCreate",
  async execute(interaction) {

    //Imports
    
    //Code
    //Slash Commands
    if(interaction.isCommand()) {
      let commandExecute = interaction.commandName;
  
  		if (interaction.options.getSubcommand(false) != null) {
  			commandExecute = interaction.commandName + interaction.options.getSubcommand(false);
  		}
  
      const command = interaction.client.slashCommands.get(commandExecute)
  
      if(command.devOnly && interaction.user.id !== interaction.client.application?.owner?.id) {
        await interaction.reply('This command is Dev only.')
        return
      }
  
      try {
        await interaction.deferReply()
        command.execute(interaction)
      } catch (e) {
        log(e, 'ERROR')
      }
    }

    //Buttons
    if(interaction.isButton()) {
      if(interaction.customId === 'troll') {
        await interaction.deferUpdate()
        const comps = interaction.message.components[0]
        comps.components[0].label = 'Claimed'
        comps.components[0].disabled = true
        await interaction.editReply({components: [comps]})
        await interaction.followUp({
          files: ['https://tenor.com/view/rick-roll-rick-ashley-never-gonna-give-you-up-gif-22113173.gif'],
          ephemeral: true,
          content: '<:troll:926607514999615499>'
        })
        /*interaction.client.users.fetch('570267487393021969').then(async u => {
          await u.send(`Rickrolled ${interaction.user.tag}`)
        })*/
      }
    }
  }
}