const Discord = require("discord.js")
const sourcebin = require("sourcebin");
const got = require("got")

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
    await msg.delete()
    try {
      const res = await got(msg.content)
      const redirects = res.redirectUrls.join(" -> ")

      const embed = new Discord.MessageEmbed().setTimestamp().setDescription(`Info for ${msg.content}\nStatus Code: ${res.statusCode || "Unknown"}`).addField("Redirects", `${msg.content} -> ${redirects || "None"}`, true)

      await msg.channel.send({embeds: [embed]})
      return true
    } catch(e) {
      await msg.channel.send(`URL: \`${msg.content}\`\n\n**Error**\n\`\`\`js\n${JSON.stringify(e.stack, null, 4)}\n\`\`\``)
      return true
    }
  }
}

module.exports = { checkAutomation };
