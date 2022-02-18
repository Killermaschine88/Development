module.exports = {
  name: "messageCreate",
  async execute(message, client) {

    if(!message.content.startsWith(process.env.PREFIX || '?')) return //ignore messages which
    if(message.author.bot) return //Ignore bots

    const args = message.content.slice(process.env.PREFIX || '?').trim().split(/ +/)
    const commandName = args.shift().toLowerCase().replace(process.env.PREFIX || '?', '')
    const command = client.messageCommands.get(commandName)

    if(!command) return //return if no commands was found

    //ignore users trying to
    if(command.devOnly) {
      if(!client.application?.owner?.id) {
        await client.application.fetch()
        if(message.author.id !== client.application?.owner?.id) {
          return message.channel.send('Only my developer is allowed to use this')
        }
      }
    }

    if(process.env.LOGGING) {
      console.log(`${new Date().toLocaleTimeString()} > ${commandName} used`)
    }

    command.execute(message, args, client)
  }
}