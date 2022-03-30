module.exports = {
  name: "ready",
  async execute(client) {
    log(`Logged into Discord`);
    client.user.setActivity("Error Logs", {
      type: "WATCHING",
    });
    await client.application.fetch();
  },
};
