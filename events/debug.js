const ignored = ["Heartbeat", "heartbeat"];
const { exec } = require("child_process");

module.exports = {
  name: "debug",
  async execute(debug) {
    if ((debug.includes("Hit a 429") && debug.includes("/gateway/bot")) || (debug.includes("Hit a 429") && debug.includes("Infinity"))) {
      exec("kill 1", (err, stdout, stderr) => {
        console.log({ err, stdout, stderr });
      });
    }
    if (!process.env.LOGGING) return;

    for (const word of ignored) {
      if (debug.includes(word)) return;
    }
    //log(debug);
  },
};
