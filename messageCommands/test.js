const axios = require("axios");
const Discord = require("discord.js");
let checked = [];
//const { getImage } = require("../constants/functions/renderLore/renderLore.js");

module.exports = {
  name: "testa",
  devOnly: true,
  alias: [],
  async execute(message, args, client) {
    setInterval(() => {
      checked = [];
    }, 600000);
    setInterval(async () => {
      const before = Date.now();
      let data;
      try {
        const res = await axios.get("https://api.hypixel.net/skyblock/auctions");
        if (!res.data.success) return;
        data = res.data.auctions.filter((auc) => auc.bin);
      } catch (e) {
        log(e, "ERROR");
      }

      const auctions = data;
      data = getInfo(data);
      const flips = returnFlips(data, auctions);
      await message.channel.send(`Took \`${Date.now() - before}ms\` to find flips`);
      for (const flip of flips) {
        if (flip.item1.tier !== flip.item2.tier) continue;
        if (flip.item2.starting_bid < 150000) continue;
        if (flip.item1.item_lore.includes("Furniture")) continue;
        if (flip.item1.item_name.includes("Enchanted Book")) continue;

        if (checked.includes(flip.item1.uuid)) continue;
        checked.push(flip.item1.uuid);

        //checks

        const embed = new Discord.MessageEmbed().addField("Info", `Name: ${flip.item1.item_name} - ${flip.item2.item_name}\nRarity: ${flip.item1.tier} - ${flip.item2.tier}\nPrice: ${flip.item1.starting_bid.toLocaleString()} - ${flip.item2.starting_bid.toLocaleString()}`).setDescription(`Flip Item: \`/viewauction ${flip.item1.uuid}\`\nNext Item: \`/viewauction ${flip.item2.uuid}\``);
        let channel;
        let b4 = false;
        let role = null;

        if (flip.item2.starting_bid > 500000000 && !b4) {
          channel = client.channels.cache.get("966098341349965834");
          b4 = true;
          role = "966100906695331852";
        } else if (flip.item2.starting_bid > 100000000 && !b4) {
          channel = client.channels.cache.get("966098432706117704");
          b4 = true;
          role = "966100933777956925";
        } else if (flip.item2.starting_bid > 10000000 && !b4) {
          channel = client.channels.cache.get("966098475001466920");
          b4 = true;
          role = "966100963637231626";
        } else {
          channel = client.channels.cache.get("966098527358967898");
        }

        //create img
        const image1 = await getImage(flip.item1);
        const image2 = await getImage(flip.item2);

        channel.send({ content: role ? `<@&${role}>` : null, embeds: [embed], files: [image1, image2] });
      }
    }, 45000);
  }, //cmd end
};

function getInfo(data) {
  const names = [];
  for (const entry of data) {
    const found = names.find((auc) => auc.item_name === entry.item_name);
    if (!found) {
      names.push(entry.item_name);
    }
  }

  const obj = {};
  for (const name of names) {
    const found = data.filter((auc) => auc.item_name === name);
    obj[name] = found.sort((a, b) => a.starting_bid - b.starting_bid);
  }
  return obj;
}

function returnFlips(data, auctions) {
  const flips = [];

  Object.values(data).forEach((item) => {
    if (item.length > 1) {
      //Only if multiple items exist
      let filter = auctions.filter((auc) => auc.item_name === item[0].item_name);
      if (filter) {
        filter = filter.sort((a, b) => b.starting_bid - a.starting_bid);
        if (item[0]?.starting_bid * 1.2 < filter[1]?.starting_bid) {
          flips.push({ item1: item[0], item2: filter[1] });
        }
      }
    }
  });

  return flips;
}
