const { MessageActionRow, MessageButton } = require("discord.js");

const choices = [
  { emoji: "<:handL:962827798844702790>", id: "interact", style: "SECONDARY" },
  { emoji: "⬆️", id: "up", style: "PRIMARY" },
  { emoji: "❌", id: "cancel", style: "DANGER" },
  { emoji: "⬅️", id: "left", style: "PRIMARY" },
  { emoji: "⬇️", id: "down", style: "PRIMARY" },
  { emoji: "➡️", id: "right", style: "PRIMARY" },
];

const rows = [new MessageActionRow(), new MessageActionRow()];

for (let i = 0; i < choices.length; i++) {
  rows[i < 3 ? 0 : 1].components.push(new MessageButton().setStyle(choices[i].style).setCustomId(choices[i].id).setEmoji(choices[i].emoji));
}

const options = [
  {
    name: "grass",
    value: 0,
    chance: 1000,
  },
  {
    name: "wall",
    value: 1,
    chance: 100,
  },
  {
    name: "treasure",
    value: 3,
    chance: 1,
  },
  /*{
    name: "temple",
    value: 4,
    chance: 0.1
  }*/
];

module.exports = { rows, options };
