const Discord = require("discord.js");

const row1 = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setStyle("PRIMARY").setLabel("ans").setCustomId("ans").setDisabled(true), new Discord.MessageButton().setStyle("PRIMARY").setLabel("(").setCustomId("("), new Discord.MessageButton().setStyle("PRIMARY").setLabel(")").setCustomId(")"), new Discord.MessageButton().setStyle("PRIMARY").setLabel("AC").setCustomId("AC"));
const row2 = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setStyle("SECONDARY").setLabel("7").setCustomId("7"), new Discord.MessageButton().setStyle("SECONDARY").setLabel("8").setCustomId("8"), new Discord.MessageButton().setStyle("SECONDARY").setLabel("9").setCustomId("9"), new Discord.MessageButton().setStyle("PRIMARY").setLabel("/").setCustomId("/"));
const row3 = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setStyle("SECONDARY").setLabel("4").setCustomId("4"), new Discord.MessageButton().setStyle("SECONDARY").setLabel("5").setCustomId("5"), new Discord.MessageButton().setStyle("SECONDARY").setLabel("6").setCustomId("6"), new Discord.MessageButton().setStyle("PRIMARY").setLabel("*").setCustomId("*"));
const row4 = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setStyle("SECONDARY").setLabel("1").setCustomId("1"), new Discord.MessageButton().setStyle("SECONDARY").setLabel("2").setCustomId("2"), new Discord.MessageButton().setStyle("SECONDARY").setLabel("3").setCustomId("3"), new Discord.MessageButton().setStyle("PRIMARY").setLabel("-").setCustomId("-"));
const row5 = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setStyle("SECONDARY").setLabel("0").setCustomId("0"), new Discord.MessageButton().setStyle("SECONDARY").setLabel(".").setCustomId("."), new Discord.MessageButton().setStyle("SUCCESS").setLabel("=").setCustomId("="), new Discord.MessageButton().setStyle("PRIMARY").setLabel("+").setCustomId("+"));

const rows = [];
rows.push(row1, row2, row3, row4, row5);

function calculate(id, str, ans) {
  str = str ? str : "";
  ans = ans ? ans : "";

  if (id === "AC") {
    return { str: null, ans: null };
  } else if (id === "=") {
    const res = parse(str);
    ans = res;
    str = res;
    return { str: `${str}`, ans: `${ans}` };
  } else if (id === "ans") {
    return { str: `${(str += ans)}`, ans: `${ans}` };
  } else {
    return { str: `${(str += id)}`, ans: `${ans}` };
  }
}

function parse(str) {
  return Function(`'use strict'; return (${str})`)();
}

function checkRows(rows, ans) {
  if(ans === null || ans === '') {
    rows[0].components[0].disabled = true
  } else {
    rows[0].components[0].disabled = false
  }
  return rows
}

module.exports = { rows, calculate, checkRows };
