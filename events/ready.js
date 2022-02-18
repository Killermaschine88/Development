module.exports = {
  name: "ready",
  async execute() {
    console.log(`${new Date().toLocaleTimeString()} > Logged into Discord`)
  }
}