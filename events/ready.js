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

    await updateLowestBinPrices(client);
    await getFlips(client);
    setInterval(async () => {
      await getFlips(client);
    }, 20000);
    setInterval(async () => {
      await updateLowestBinPrices(client);
    }, 600000);
  },
};
