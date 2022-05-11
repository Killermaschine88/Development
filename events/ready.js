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

    updateLowestBinPrices(client);
    getFlips(client);
    setInterval(async () => {
      getFlips(client);
    }, 20000);
    setInterval(async () => {
      updateLowestBinPrices(client);
    }, 600000);
  },
};
