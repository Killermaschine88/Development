const { getFlips } = require("../constants/skyblock/main.js");
const { updateLowestBinPrices } = require("../constants/skyblock/helper.js");

module.exports = {
  name: "ready",
  async execute(client) {
    log(`Logged into Discord`);
    client.user.setActivity("Error Logs", {
      type: "WATCHING",
    });
    await client.application.fetch();

    /*const allmembers = (await client.guilds.cache.get("830328430695677972").members.fetch()).forEach(async member => {

      try {
        await member.roles.add("830329790610538527")
      } catch (e) {
        console.log(e)
      }
    })*/
  },
};
