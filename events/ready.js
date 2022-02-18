module.exports = {
  name: "ready",
  async execute(client) {
    console.log(`${new Date().toLocaleTimeString()} > Logged into Discord`)
    await client.application.fetch()
  }
}