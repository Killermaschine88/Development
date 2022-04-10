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

module.exports = { rows };
