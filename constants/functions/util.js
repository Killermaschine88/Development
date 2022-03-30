const { exec } = require("child_process");

const sleep = async (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

function execShell(str) {
  exec(str, (err, stdout, stderr) => {
    console.log({ err, stdout, stderr });
  });
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
      m = collected.first()?.content
      collected.first().delete()
    })
    .catch((collected) => {
      m = null;
    });
  return m;
}

module.exports = { sleep, execShell, getMessageInput };
