function globalStart() {
  require("dotenv").config();
  global.color = require("colorette");
  global.shards = [];
  setInterval(() => {
    shards = [];
  }, 6 * 60 * 1000);

  //starting web server
  const app = require("express")();
  app.listen(3000);
  app.get("/", (req, res) => res.send("OK"));

  app.get("/shards", (req, res) => {
    if(req.query.key !== process.env.KEY) {
      //return res.status(403).send("Disallowed")
    }
    res.send(shards);
  });

  global.log = function (str, type = "DEFAULT") {
    if (type === "DEFAULT") {
      console.log(`${new Date().toLocaleTimeString()} > ${str}`);
    } else if (type === "ERROR") {
      console.log(`${color.red(`${new Date().toLocaleTimeString()} > ${str}`)}`);
    }
  };
}

module.exports = { globalStart };
