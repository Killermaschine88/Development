module.exports = {
  name: "interactionCreate",
  async execute(interaction) {

    //Imports
    
    //Code
    if(interaction.isCommand()) {
      let commandExecute = interaction.commandName;
  
  		if (interaction.options.getSubcommand(false) != null) {
  			commandExecute = interaction.commandName + interaction.options.getSubcommand(false);
  		}
  
      const command = interaction.client.slashCommands.get(commandExecute)
  
      if(command.devOnly) {
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
    
  }
}