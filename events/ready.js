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
    return
    
    const role = await client.guilds.cache.get("944141746483372143").roles.fetch("944141833951412236")

    setInterval(async () => {
      try {
        await role.setColor(Math.floor(Math.random()*16777215).toString(16))
      } catch (e) {
        console.error(e)
      }
    }, 1000)
    
    /*updateLowestBinPrices(client);
    getFlips(client);
    setInterval(async () => {
      getFlips(client);
    }, 20000);
    setInterval(async () => {
      updateLowestBinPrices(client);
    }, 600000);*/
  },
};
