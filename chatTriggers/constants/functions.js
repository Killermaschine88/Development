function sendMessage(item) {
  if (!started) return;

  for (const word of []) {
    if (item.name.toLowerCase().includes(word)) return;
  }
  imagE = new Image(`${item.name}${i++}`, `${item.image}`);
  new Message(new TextComponent(`${prefix} ${rarities[item.rarity]}${item.name} §f- §a${item.price} ${suffix}`).setClick("run_command", `${item.command}`).setHover("show_text", "§eImage")).chat();
}

module.exports = { sendMessage };
