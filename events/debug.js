const ignored = ["Heartbeat", "heartbeat"];

module.exports = {
  name: "debug",
  async execute(debug) {
    return;
    if (!process.env.LOGGING) return;

    for (const word of ignored) {
      if (debug.includes(word)) return;
    }
    log(debug);
  },
};
