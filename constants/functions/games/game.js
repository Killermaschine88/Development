function gameStartCheck(interaction, user) {
  let state = false;
  let reason;

  if (user.bot) {
    state = true;
    reason = `Can't play against \`${user.tag}\` as they are a bot.`;
  }
  if (interaction.user.id === user.id) {
    state = true;
    reason = "You can't play against yourself";
  }

  return {
    state,
    reason,
  };
}

function notifyPlayers(interaction, user, game) {
  return `Hey <@${user.id}>, <@${interaction.user.id}> challenged you to a game of ${game}.`;
}

async function getMessageInput(interaction) {
  const filter = (m) => m.author.id === interaction.user.id;
  let m = null;

  await interaction.channel
    .awaitMessages({
      filter,
      max: 1,
      time: 120000,
      errors: ["time"],
    })
    .then((collected) => {
      let content = collected.values();
      content = content.next().value.content;
      let message = collected.values();
      interaction.channel.messages.fetch(message.next().value.id).then(async (msg) => await msg.delete());
      m = content;
    })
    .catch((collected) => {
      m = null;
    });
  return m;
}

module.exports = { gameStartCheck, notifyPlayers, getMessageInput };
