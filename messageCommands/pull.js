module.exports = {
  name: "pull",
  devOnly: true,
  alias: [],
  async execute(message, args, client) {
    //Imports
    const { exec } = require("child_process");

    //Code
    exec("git pull origin main", (err, stdout, stderr) => {
      console.log({ err, stdout, stderr });
      if (stdout.includes("Already up to date.")) return message.channel.send("Already upto date.");
      else {
        return message.channel.send("Git pull", "```ansi\n" + stdout + "\n```\n\n```diff\n" + stderr + "\n```\n");
      }
    });
  },
};
