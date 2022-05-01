const Discord = require("discord.js");
const axios = require("axios");
const { decodeData, getImage } = require("../functions/renderLore/renderLore.js");
const { getInfo, ignoredCheck, getEstimatePrice } = require("./helper.js");

let cache = [];
setInterval(() => {
  cache = [];
}, 300000);

async function getFlips(client) {
  let data;
  try {
    const res = await axios.get(`https://api.hypixel.net/skyblock/auctions`);
    if (!res.data.success) return;
    data = res.data.auctions.filter((auc) => auc.bin);
  } catch (e) {
    return log(e, "ERROR");
  }

  for (let item of data) {
    item = {
      item: item,
      attributes: (await decodeData(Buffer.from(item.item_bytes, "base64"))).i[0],
    };

    const found = lbin[item.attributes.tag.ExtraAttributes.id];
    let perPiece1 = "x";
    let perPiece2 = "x";

    if (!found) continue;

    if (cache.includes(item.item.uuid)) continue;

    cache.push(item.item.uuid);

    //filter out unwanted items
    //const check = ignoredCheck(item.item, item.attributes);
    //if (check) continue;
    //if (item.attributes?.tag.ExtraAttributes.id.includes("PERSONALIT")) continue;
    if (found.item.starting_bid < 100000) continue;

    if (item.attributes.Count > 1 || found.attributes.Count > 1) {
      perPiece1 = (item.item.starting_bid / item.attributes.Count).toFixed(2);
      perPiece2 = (found.item.starting_bid / found.attributes.Count).toFixed(2);
    }

    if (item.item.starting_bid * 1.2 < found.item.starting_bid) {
      const res = getInfo(found, client);
      let channel = res.channel;
      let role = res.role;

      const embed = new Discord.MessageEmbed().setDescription(`Lowest: \`/viewauction ${item.item.uuid}\`\nNext: \`/viewauction ${found.item.uuid}\``).addField("Prices", `Lowest: ${item.item.starting_bid.toLocaleString()} (${perPiece1} per) [${item.attributes.Count}x]\nNext: ${found.item.starting_bid.toLocaleString()} (${perPiece2} per) [${found.attributes.Count}x]`);
      const image1 = await getImage(item.item);
      const image2 = await getImage(found.item);

      channel.send({ content: role ? `<@&${role}>` : null, embeds: [embed], files: [image1, image2] });
    }

    //shard and doubles
    if (item.item.item_name === "Attribute Shard") {
      const attributes = item.attributes.tag.ExtraAttributes.attributes;
      //console.log(attributes);
      const embed = new Discord.MessageEmbed();
      let channel;
      if (attributes["mana_pool"]) {
        channel = "968040644553633792";
      }
      if (attributes["life_regeneration"]) {
        channel = "968040665479020554";
      }
      if (attributes["attack_speed"]) {
        channel = "968064802826100747";
      }
      if (!channel) continue;
      if (item.item.auctioneer === "f999bee205184827aad5454a76658beb") continue;

      embed.setDescription(`/viewauction ${item.item.uuid}`);
      embed.addField("Info", `Price: ${item.item.starting_bid.toLocaleString()}\nItem: ${JSON.stringify(item.attributes.tag.ExtraAttributes.attributes)}`);
      const img = await getImage(item.item);
      embed.addField("Seller", `${item.item.auctioneer}`);

      client.channels.cache.get(channel).send({ embeds: [embed], files: [img], content: `${item.item.auctioneer}`, components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setLabel("Show Name").setCustomId("show_name").setStyle("SECONDARY"))] });
    }

    if (item.attributes.tag?.ExtraAttributes?.attributes && item.attributes.tag?.ExtraAttributes?.attributes["mana_pool"] && item.attributes.tag?.ExtraAttributes?.attributes["life_regeneration"]) {
      if (item.item.auctioneer === "f999bee205184827aad5454a76658beb") continue;
      const embed = new Discord.MessageEmbed().setDescription(`\`/viewauction ${item.item.uuid}\``).addField("Price", `${item.item.starting_bid.toLocaleString()}`).addField("Name", `${item.item.item_name}`).addField("Rarity", `${item.item.tier}`);
      const img = await getImage(item.item);
      client.channels.cache.get("968043926877503492").send({ embeds: [embed], files: [img], content: `${item.item.auctioneer}`, components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setLabel("Show Name").setCustomId("show_name").setStyle("SECONDARY"))] });
    }

    if (item.attributes.tag?.ExtraAttributes?.attributes && item.attributes.tag?.ExtraAttributes?.attributes["lifeline"] && item.attributes.tag?.ExtraAttributes?.attributes["life_regeneration"]) {
      if (item.item.auctioneer === "f999bee205184827aad5454a76658beb") continue;
      const embed = new Discord.MessageEmbed().setDescription(`\`/viewauction ${item.item.uuid}\``).addField("Price", `${item.item.starting_bid.toLocaleString()}`).addField("Name", `${item.item.item_name}`).addField("Rarity", `${item.item.tier}`);
      const img = await getImage(item.item);
      client.channels.cache.get("968414012788342784").send({ embeds: [embed], files: [img], content: `${item.item.auctioneer}`, components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setLabel("Show Name").setCustomId("show_name").setStyle("SECONDARY"))] });
    }
  }
}

module.exports = { getFlips };

/* entry of "attributes"
{
  id: 352,
  Count: 1,
  tag: {
    ench: [],
    HideFlags: 254,
    display: { Lore: [Array], Name: '§dSpiritual Bonemerang §6✪§6✪§6✪§6✪§6✪' },
    ExtraAttributes: {
      rarity_upgrades: 1, //not existing or 1
      hot_potato_count: 10, //not existing - 15
      modifier: 'spiritual', //not existing / string
      dungeon_item_level: 5, //not existing - 10 (maybe 15 cuz new items)
      originTag: 'QUICK_CRAFTING',
      id: 'BONE_BOOMERANG',
      enchantments: { //not existing or existing
        impaling: 3,
        critical: 6,
        smite: 6,
        looting: 4,
        syphon: 3,
        scavenger: 4,
        telekinesis: 1,
        vampirism: 5,
        experience: 3,
        giant_killer: 5,
        venomous: 5,
        first_strike: 4,
        thunderlord: 5,
        ultimate_wise: 5,
        cubism: 5,
        lethality: 6,
        PROSECUTE: 5
      },
      uuid: '8ca3728c-3cbd-4e2e-b89c-311cab325e57',
      timestamp: '2/4/21 11:11 AM'
    }
  },
  Damage: 0
}
*/
