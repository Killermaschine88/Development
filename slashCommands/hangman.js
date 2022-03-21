const Discord = require("discord.js");
const { getStage, getRandomWord } = require("../constants/functions/hangman.js");
const { getMessageInput } = require("../constants/functions/game.js");

module.exports = {
  name: "hangman",
  devOnly: false,
  async execute(interaction) {
    const category = interaction.options.getString("category");

    const word = getRandomWord(category).split("");

    let guessWord = [];
    let i = 0;
    while (i < word.length) {
      guessWord.push("_");
      i++;
    }

    const embed = new Discord.MessageEmbed()
      .setTitle("Hangman Game")
      .setColor("GREEN")
      .setDescription(`Category: ${!category ? "all" : category}\nWord: \`${guessWord.join("")}\``);

    const rows = [new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setStyle("PRIMARY").setLabel("Guess Letter").setCustomId("guessLetter"), new Discord.MessageButton().setStyle("PRIMARY").setLabel("Guess Word").setCustomId("guessWord"))];

    const rows1 = [new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setStyle("PRIMARY").setLabel("Guess Letter").setCustomId("guessLetter").setDisabled(true), new Discord.MessageButton().setStyle("PRIMARY").setLabel("Guess Word").setCustomId("guessWord").setDisabled(true))];

    const message = await interaction.editReply({ embeds: [embed], components: rows });

    const collector = message.createMessageComponentCollector({
      componentType: "BUTTON",
      time: 5 * 60000,
    });

    let wrongGuess = 0;
    let guessedLetters = [];

    collector.on("collect", async (i) => {
      await i.deferUpdate();
      if (i.user.id !== interaction.user.id) return;
      await interaction.editReply({ components: rows1 });

      if (i.customId === "guessLetter") {
        const m = await interaction.followUp({ embeds: [new Discord.MessageEmbed().setDescription(`Guess a new letter.\n\nAlready guessed: ${guessedLetters.join(", ")}`)] });
        const letter = (await getMessageInput(interaction)).toLowerCase();
        await m.delete();
        if (guessedLetters.includes(letter)) {
          await interaction.editReply({ embeds: [embed], components: rows });
          return await interaction.followUp({ content: `You already guesssed \`${letter}\``, ephemeral: true });
        }
        if (letter?.length !== 1) {
          await interaction.editReply({ embeds: [embed], components: rows });
          return await interaction.followUp({ content: "Can't guess multiple letters at once.", ephemeral: true });
        }
        if (!letter) {
          wrongGuess++;
        } else {
          let i = 0;
          let before = guessWord.join("");
          for (const letter_ of word) {
            if (word[i] === letter) {
              guessWord[i] = letter;
              i++;
            } else {
              i++;
            }
          }
          if (before === guessWord.join("")) {
            wrongGuess++;
          }
        }

        embed.setDescription(`${getStage(wrongGuess)}\n\nCategory: ${!category ? "all" : category}\nWord: \`${guessWord.join("")}\``);

        const check = winCheck(guessWord, wrongGuess);

        if (check.state === "Won") {
          embed.addField("​", "**Won**");
          return collector.stop();
        } else if (check.state === "Lost") {
          embed.setColor("RED");
          embed.addField("​", `**Lost**, the word was \`${word.join("")}\``);
          return collector.stop();
        } else {
          guessedLetters.push(letter);

          embed.setDescription(`${getStage(wrongGuess)}\n\nCategory: ${!category ? "all" : category}\nWord: \`${guessWord.join("")}\``);
          await interaction.editReply({ embeds: [embed], components: rows });
        }
      } else if (i.customId === "guessWord") {
        const m = await interaction.followUp({ embeds: [new Discord.MessageEmbed().setDescription(`Guess the word.`)] });
        const words = (await getMessageInput(interaction)).toLowerCase();
        await m.delete();

        if (words === word.join("")) {
          embed.addField("​", "**Won**");
          embed.setDescription(`${getStage(wrongGuess)}\n\nCategory: ${!category ? "all" : category}\nWord: \`${words}\``);
          return collector.stop();
        } else {
          wrongGuess++;
          await interaction.editReply({ embeds: [embed], components: rows });
        }
      }
    });

    collector.on("end", async () => {
      return await interaction.editReply({ embeds: [embed], components: [] });
    });
  },
};

function winCheck(guessWord, wrongGuess) {
  let state = "";

  if (!guessWord.includes("_") && wrongGuess !== 7) {
    state = "Won";
  }
  if (wrongGuess === 7) {
    state = "Lost";
  }

  return {
    state: state,
  };
}
