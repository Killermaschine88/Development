module.exports = {
  name: "debug",
  async execute(debug) {
    if(!process.env.LOGGING) return
    console.log(`${new Date().toLocaleTimeString()} > ${debug}`)
  }
}