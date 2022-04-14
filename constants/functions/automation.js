const sourcebin = require("sourcebin");

async function checkAutomation(msg, client) {
  if (msg.channel.id === "963810201260134400") {
    //Sourcebin Uploader
    await msg.delete();
    const bin = await sourcebin.create(
      [
        {
          content: msg.content,
          language: "Javascript",
        },
      ],
      {
        title: "Code",
        description: "Code",
      }
    );

    await msg.channel.send(`<${bin.url}>`);
    return true;
  }

  if(msg.channel.id === "964268555833069668") { //URL Checker
    const res = await got(msg.content)
    console.log(res)
  }
}

module.exports = { checkAutomation };
