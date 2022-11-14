const Discord = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "verify",
  devOnly: false,
  async execute(interaction) {
    const ign = interaction.options.getString("ign");

    await interaction.editReply({ embeds: [new Discord.MessageEmbed().setDescription("Attempting to verify you...")] });

    setTimeout(async () => {
      try {
        await interaction.deleteReply();
      } catch (e) {} //Ignore Error
    }, 10000);

    const res = await getData(ign);

    if (res === "API Error") {
      return await interaction.editReply({ embeds: [errEmbed("An Error occured while requesting API Data, try again later.")] });
    }
    if (res.discord === "None") {
      return await interaction.editReply({ embeds: [errEmbed(`The Minecraft Account your provided is linked to: \`${res.discord}\`\nYour Discord Account is: \`${interaction.user.tag}\``)] });
    }

    if (res.name === "None") {
      return await interaction.editReply({ embeds: [errEmbed(`The Minecraft Account your provided is invalid.`)] });
    }

    if (await existsAlready(interaction, res.name)) {
      return await interaction.editReply({ embeds: [errEmbed("This Minecraft Account is already linked to another Discord Account.")] });
    }

    if (res.discord === interaction.user.tag) {
      try {
        await interaction.member.roles.add("999308818691399692", "Verified with Minecraft Account");
      } catch (e) {} //Ignore Error

      await updateDB(interaction, res.name, res.uuid);

      //interaction.client.channels.cache.get(interaction.client.config.log.verify).send({ embeds: [sucEmbed(`<@${interaction.user.id}> - \`${interaction.user.tag}\` [${interaction.user.id}] verified as \`${res.name}\``)] });
      await interaction.editReply({ embeds: [sucEmbed(`Verified as \`${res.name}\``)] });
    } else {
      await interaction.editReply({ embeds: [errEmbed(`Couldn't verify you as \`${res.name}\`\nAccount linked to: \`${res.discord}\`\nYour Account: \`${interaction.user.tag}\``)] });
    }
  },
};

async function getData(ign, interaction) {
  let data;
  let name = "";
  let discord = "";
  const uuid = await getUUID(ign, interaction);
  if (!uuid) {
    return "API Error";
  }
  try {
    const res = (await axios.get(`https://api.hypixel.net/player?key=${process.env.API_KEY}&uuid=${uuid}`))?.data;
    if (res.success && res?.cause !== "Invalid API key") {
      name = res.player?.displayname || "None";
      discord = res.player.socialMedia?.links?.DISCORD || "None";
    } else {
      name = res.player.displayName;
      discord = "None";
    }
    return {
      name: name,
      discord: discord,
      uuid: uuid,
    };
  } catch (e) {
    console.error(e);
    return "API Error";
  }
}

async function getUUID(ign, interaction) {
  let response = null;
  try {
    response = (await axios.get(`https://api.mojang.com/users/profiles/minecraft/${ign}`))?.data;
  } catch (e) {
    console.error(e);
  }

  if (response?.id) {
    return response.id;
  } else {
    return null;
  }
}

async function updateDB(interaction, ign, uuid) {
  return await interaction.client.collection.updateOne({ "discord.id": interaction.user.id }, { $set: { discord: { id: interaction.user.id }, minecraft: { name: ign, uuid: uuid } } }, { upsert: true });
}

async function existsAlready(interaction, name) {
  const all = await interaction.client.collection.findOne({ "minecraft.name": name });

  if (all) {
    return true;
  } else {
    return false;
  }
}

function errEmbed(desc) {
  const embed = new Discord.MessageEmbed().setTitle("Error").setColor("RED").setDescription(desc);
  return embed;
}

function sucEmbed(desc) {
  const embed = new Discord.MessageEmbed().setTitle("Success").setColor("GREEN").setDescription(desc);
  return embed;
}
