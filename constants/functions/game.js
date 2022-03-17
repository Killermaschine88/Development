function gameStartCheck(interaction, user) {
  let state = false
  let reason;

  if(user.bot) {
    state = true,
    reason = `Can't play against \`${user.tag}\` as they are a bot.`
  }
  if(interaction.user.id === user.id) {
    state = true
    reason = 'You can\'t play against yourself'
  }

  return {
    state,
    reason
  }
}

function notifyPlayers(interaction, user, game) {
  return `Hey <@${user.id}>, <@${interaction.user.id}> challenged you to a game of ${game}.`
}


module.exports = { gameStartCheck, notifyPlayers }