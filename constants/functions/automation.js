const Discord = require("discord.js");
const sourcebin = require("sourcebin");
const got = require("got");
const axios = require("axios");

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

  if (msg.channel.id === "964268555833069668") {
    //URL Checker
    await msg.delete();
    try {
      const res = await got(msg.content);
      const redirects = res.redirectUrls.join(" -> ");

      const embed = new Discord.MessageEmbed()
        .setTimestamp()
        .setDescription(`Info for ${msg.content}\nStatus Code: ${res.statusCode || "Unknown"}`)
        .addField("Redirects", `${msg.content} -> ${redirects || "None"}`, true);

      await msg.channel.send({ embeds: [embed] });
      return true;
    } catch (e) {
      await msg.channel.send(`URL: \`${msg.content}\`\n\n**Error**\n\`\`\`js\n${JSON.stringify(e.stack, null, 4)}\n\`\`\``);
      return true;
    }
  }

  if (msg.channel.id === "968069354832920606") {
    //UUID to IGN
    await msg.delete();
    let ign;
    try {
      const res = await axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${msg.content}`);
      if (res.data?.name) {
        ign = res.data.name;
      } else {
        await msg.channel.send("No IGN found");
        return true;
      }
    } catch (e) {
      console.log(e);
      await msg.channel.send("Error");
      return true;
    }
    await msg.channel.send(`\`${ign}\``);
    return true;
  }
}

module.exports = { checkAutomation };
