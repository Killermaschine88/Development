const ignored = ['Heartbeat', 'heartbeat']

module.exports = {
  name: "debug",
  async execute(debug) {

    //Imports

    //Code
    if(!process.env.LOGGING) return

    for(const word of ignored) {
      if(debug.includes(word)) return
    }
    return
    log(debug)
  }
}