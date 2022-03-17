module.exports = {
  name: "ready",
  async execute(client) {
    //Imports

    //Code
    log(`Logged into Discord`);
    await client.application.fetch();
  },
};
