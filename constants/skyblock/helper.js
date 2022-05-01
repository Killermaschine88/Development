global.lbin = {};
global.enchants = {};
const axios = require("axios");
const { decodeData, getImage } = require("../functions/renderLore/renderLore.js");
const Discord = require("discord.js");

async function updateLowestBinPrices(client) {
  log("Started refreshing Prices");
  const res = await getItems();
  let data = res.data;
  const b4 = Date.now();
  lbin = {};
  //addSetItems();
  //await addEnchants();

  data = data.filter(item => !["COMMON", "UNCOMMON"].includes(item.tier) && !item.claimed && item.auctioneer !== "44f0ab5df696477b91516d0795c2f876" && item.auctioneer !== "0e64442a82894fc8a7b6aaa74938501b" && !["misc", "consumables", "blocks"].includes(item.tier) && !item.item_lore.split("\n").some(e => ["Enchanted Book", "SPECIAL", "Furniture", "FURNITURE", "DUNGEON"].includes(e)))

  for (let item of data) {
    const formatted = (await decodeData(Buffer.from(item.item_bytes, "base64"))).i[0]; //item_bytes

    //
    /*
    const check = ignoredCheck(item, formatted);
    if (!check) continue;

    if (!lbin[formatted?.tag?.ExtraAttributes?.id]) {
      lbin[formatted?.tag?.ExtraAttributes?.id] = {
        item: item,
        attributes: formatted,
      };
    } else {
      if (lbin[formatted?.tag?.ExtraAttributes?.id].item.starting_bid > item.starting_bid) {
        lbin[formatted?.tag?.ExtraAttributes?.id] = {
          item: item,
          attributes: formatted,
        };
      }
    }
    */
    //

    if (item.item_name === "Attribute Shard") {
      const attributes = formatted.tag.ExtraAttributes.attributes;
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
      if (item.auctioneer === "f999bee205184827aad5454a76658beb") continue;

      embed.setDescription(`/viewauction ${item.uuid}`);
      embed.addField("Info", `Price: ${item.starting_bid.toLocaleString()}\nItem: ${JSON.stringify(formatted.tag.ExtraAttributes.attributes)}`);
      embed.addField("Seller", `${item.auctioneer}`);
      const img = await getImage(item);

      client.channels.cache.get(channel).send({ content: `${item.auctioneer}`, embeds: [embed], files: [img], components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setLabel("Show Name").setCustomId("show_name").setStyle("SECONDARY"))] });
    }

    if (formatted.tag?.ExtraAttributes?.attributes && formatted.tag?.ExtraAttributes?.attributes["mana_pool"] && formatted.tag?.ExtraAttributes?.attributes["life_regeneration"]) {
      if (item.auctioneer === "f999bee205184827aad5454a76658beb") continue;
      const embed = new Discord.MessageEmbed().setDescription(`\`/viewauction ${item.uuid}\``).addField("Price", `${item.starting_bid.toLocaleString()}`).addField("Name", `${item.item_name}`).addField("Rarity", `${item.tier}`);
      const img = await getImage(item);
      client.channels.cache.get("968043926877503492").send({ embeds: [embed], files: [img], content: `${item.auctioneer}`, components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setLabel("Show Name").setCustomId("show_name").setStyle("SECONDARY"))] });
    }

    if (formatted.tag?.ExtraAttributes?.attributes && formatted.tag?.ExtraAttributes?.attributes["lifeline"] && formatted.tag?.ExtraAttributes?.attributes["life_regeneration"]) {
      if (item.auctioneer === "f999bee205184827aad5454a76658beb") continue;
      const embed = new Discord.MessageEmbed().setDescription(`\`/viewauction ${item.uuid}\``).addField("Price", `${item.starting_bid.toLocaleString()}`).addField("Name", `${item.item_name}`).addField("Rarity", `${item.tier}`);
      const img = await getImage(item);
      client.channels.cache.get("968414012788342784").send({ embeds: [embed], files: [img], content: `${item.auctioneer}`, components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setLabel("Show Name").setCustomId("show_name").setStyle("SECONDARY"))] });
    }
  }

  log(`Finished refreshing Prices, took ${Date.now() - b4}ms`);
  lbin["last_bot_refresh"] = Math.floor(Date.now() / 1000);
  lbin["last_hypixel_refresh"] = Math.floor(Number(res.last_refresh) / 1000);
}

async function getItems() {
  const b4 = Date.now();
  const firstPage = await axios.get(`https://api.hypixel.net/skyblock/auctions?page=0`);
  const pages = firstPage.data.totalPages - 1;
  let auctions = [];

  let promises = new Array(pages).fill(null).map(async (_, i) => {
    const page = await axios.get(`https://api.hypixel.net/skyblock/auctions?page=${i}`);
    auctions = [...auctions, ...page.data.auctions.filter((auc) => auc.bin)];
  });
  await Promise.all(promises);

  return {
    data: auctions,
    last_refresh: firstPage.data.lastUpdated,
  };
}

function ignoreCheck(item, found) {
  for (const bl of ["Enchanted Book", "null", "Potion", null]) {
    //Name
    if (item.item.item_name.includes(bl)) return "skip";
  }
  for (const bl of ["Furniture"]) {
    //Lore
    if (item.item.item_lore.includes(bl)) return "skip";
  }

  if (found.item.starting_bid < 100000) return "skip";
  if (item.category === "COSMETIC") return "skip";
}

function getInfo(found, client) {
  let channel = null;
  let b4 = false;
  let role = null;
  if (found.item.starting_bid > 500000000 && !b4) {
    channel = client.channels.cache.get("966098341349965834");
    b4 = true;
    role = "966100906695331852";
  } else if (found.item.starting_bid > 100000000 && !b4) {
    channel = client.channels.cache.get("966098432706117704");
    b4 = true;
    role = "966100933777956925";
  } else if (found.item.starting_bid > 10000000 && !b4) {
    channel = client.channels.cache.get("966098475001466920");
    b4 = true;
    role = "966100963637231626";
  } else {
    channel = client.channels.cache.get("966098527358967898");
  }
  return {
    channel,
    role,
  };
}

function ignoredCheck(item, formatted) {
  //console.log(formatted)
  const extra = formatted.tag.ExtraAttributes;
  if (extra.id.includes("PERSONALITY")) return false;
  if (extra.id.includes("PET")) return false;
  return true;
}

async function addEnchants() {
  enchants = {};
  let data;
  try {
    const res = await axios.get("https://maro.skybrokers.xyz/api/auctions/all");
    if (res.data.data) {
      data = res.data.data;
    }
  } catch (e) {
    log(e, "ERROR");
    return true;
  }

  for (const item of data) {
    enchants[item.id] = item.lowestBin;
  }
  return true;
}

function addSetItems() {
  lbin["HOT_POTATO_BOOK"] = 30000;
  lbin["FUMING_POTATO_BOOK"] = 1400000;
  lbin["RECOMBOBULATOR_3000"] = 5800000;
  lbin["ULTIMATE_SOUL_EATER"] = 25000000;
  lbin["ULTIMATE_WISE"] = 200000;
  lbin["ULTIMATE_WISDOM"] = 250000;
  lbin["ULTIMATE_LEGION"] = 1000000;
  lbin["ULTIMATE_LAST_STAND"] = 250000;
}

//Important Stuff

function getEstimatePrice(item1, item2) {}

function tierToAmount(tier) {
  if (tier === 1) return 1;
  if (tier === 2) return 2;
  if (tier === 3) return 4;
  if (tier === 4) return 8;
  if (tier === 5) return 16;
  if (tier === 6) return 32;
  if (tier === 7) return 64;
  if (tier === 8) return 128;
  if (tier === 9) return 258;
  if (tier === 10) return 512;
}

module.exports = { updateLowestBinPrices, getInfo, ignoredCheck, getEstimatePrice };
