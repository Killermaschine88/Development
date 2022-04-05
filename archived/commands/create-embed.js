const { MessageEmbed, MessageSelectMenu, MessageActionRow } = require("discord.js");
const { getMessageInput } = require("../constants/functions/util.js");
const { data, updateEmbed } = require("../constants/functions/embed.js");
const axios = require("axios");

module.exports = {
  name: "create-embed",
  devOnly: false,
  async execute(interaction) {
    let embed = interaction.options.getString("link");
    if (!embed) {
      embed = new MessageEmbed();
    } else {
      if (embed.includes("star")) {
        try {
          embed = embed.replace(".in/", ".in/raw/");
          embed = (await axios.get(embed)).data;

          const m = await interaction.channel.send({ content: "Heres a Preview of the embed i grabbed it will be auto deleted in 20 sec", embeds: [embed] });
          setTimeout(async () => {
            await m.delete();
          }, 20000);
        } catch (e) {
          return await interaction.followUp("Something went wrong");
        }
      } else if (embed.includes("discord.com/channels")) {
        try {
          const args = embed.split("/");
          const channelId = args[5];
          const messageId = args[6];
          const fetched_embed = (await interaction.client.channels.cache.get(channelId).messages.fetch(messageId))?.embeds[0];
          if (fetched_embed) {
            try {
              const m = await interaction.channel.send({ content: "Heres a Preview of the embed i grabbed it will be auto deleted in 20 sec", embeds: [fetched_embed] });
              setTimeout(async () => {
                await m.delete();
              }, 20000);
              embed = fetched_embed;
            } catch (e) {
              return await interaction.editReply("Something went wrong");
            }
          } else {
            return await interaction.editReply("There was no embed on the given link.");
          }
        } catch (e) {
          return await interaction.editReply("Something went wrong");
        }
      } else {
        return await interaction.followUp("Invalid Input");
      }
    }

    let mainEmbed = new MessageEmbed().setTitle("Embed Creator").setDescription("Welcome to the Embed Creator select something from the SelectMenu to start.").setColor("GREEN");

    const row = new MessageActionRow();
    const selectMenu = new MessageSelectMenu().setCustomId("select").setMaxValues(1).setMinValues(1);

    selectMenu.addOptions(data);
    row.addComponents(selectMenu);

    const message = await interaction.editReply({ embeds: [mainEmbed], components: [row] });

    const collector = message.createMessageComponentCollector({
      componentType: "SELECT_MENU",
      time: 10 * 60000,
    });

    collector.on("collect", async (i) => {
      if (i.user.id !== interaction.user.id) return;
      await i.deferUpdate();
      const id = i.values[0];

      //preview it
      if (id === "preview") {
        try {
          await interaction.followUp({ embeds: [embed], ephemeral: true });
        } catch (e) {
          await interaction.followUp({ embeds: [new MessageEmbed().setTitle("Unable to preview Embed because of:").setDescription(`\`\`\`js\n${e.stack}\`\`\``)], ephemeral: true });
        }
        return;
      } else if (id === "finish") {
        try {
          await interaction.followUp({ embeds: [embed], ephemeral: true });
          await interaction.editReply({ content: `\`\`\`js\n${JSON.stringify(embed, null, 2)}\`\`\``, embeds: [], components: [] });
          collector.stop();
        } catch (e) {
          await interaction.followUp({ embeds: [new MessageEmbed().setTitle("Unable to send Embed because of:").setDescription(`\`\`\`js\n${e.stack}\`\`\``)], ephemeral: true });
        }
        return;
      }

      //rest of the commands
      if (id === "title") {
        mainEmbed.setDescription("Say the title you want to set, say `null` if you want to remove it.");
        await interaction.editReply({ embeds: [mainEmbed], components: [] });
        const content = await getMessageInput(interaction);
        content === "null" ? (embed.title = null) : embed.setTitle(content);
      } else if (id === "description") {
        mainEmbed.setDescription("Say the description you want to set, say `null` if you want to remove it.");
        await interaction.editReply({ embeds: [mainEmbed], components: [] });
        const content = await getMessageInput(interaction);
        content === "null" ? (embed.description = null) : embed.setDescription(content);
      } else if (id === "color") {
        mainEmbed.setDescription("Say the color you want to set, say `null` if you want to remove it.");
        await interaction.editReply({ embeds: [mainEmbed], components: [] });
        const content = await getMessageInput(interaction);
        content === "null" ? (embed.color = null) : embed.setColor(content);
      } else if (id === "timestamp") {
        mainEmbed.setDescription("Say the `yes` you want to set a timestamp, say `null` if you want to remove it.");
        await interaction.editReply({ embeds: [mainEmbed], components: [] });
        const content = await getMessageInput(interaction);
        content === "null" ? (embed.timestamp = null) : embed.setTimestamp();
      } else if (id === "field") {
        //add field logic
      } else if (id === "image") {
        mainEmbed.setDescription("Say the image link you want to set, say `null` if you want to remove it.");
        await interaction.editReply({ embeds: [mainEmbed], components: [] });
        const content = await getMessageInput(interaction);
        content === "null" ? (embed.image = null) : embed.setImage(content);
      } else if (id === "author") {
        //add author logic
      } else if (id === "footer") {
        mainEmbed.setDescription("Say the footer text you want to set, say `null` if you want to remove it.\n\nSide Note: A text is required to display an Icon.");
        await interaction.editReply({ embeds: [mainEmbed], components: [] });
        const content1 = await getMessageInput(interaction);
        mainEmbed.setDescription("Say the footer url you want to set, say `null` if you want to remove it.");
        await interaction.editReply({ embeds: [mainEmbed], components: [] });
        const content2 = await getMessageInput(interaction);

        embed.footer = { text: null, iconURL: null };

        if (content1 === "null") {
          embed.footer.text = null;
        } else {
          embed.footer.text = content1;
        }
        if (content2 === "null") {
          embed.footer.iconURL = null;
        } else {
          embed.footer.iconURL = content2;
        }
      }

      mainEmbed.setDescription("Welcome to the Embed Creator select something from the SelectMenu to start.");
      await interaction.editReply({ embeds: [mainEmbed], components: [row] });
    });

    collector.on("end", async () => {
      await interaction.editReply({ components: [] });
    });
  },
};
