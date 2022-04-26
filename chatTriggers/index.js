let started = false;
let render = false;
let i = 0;
const axios = require("axios");
let sent = []

register("step", () => {
  if (!started) return;
  //Whatever you wanna call every 30 seconds and started has to be true
  try {
    const res = (await axios.get("https://development.baltrazz.repl.co/shards"))?.data;
    if (res.length > 0) {
      for (const item of res) {
        if(sent.includes(item.command)) continue;
        sendMessage(item);
        sent.push(item.command)
      }
    } else {
      return ChatLib.chat("No new Items found.");
    }
  } catch (e) {
    started = false;
    return ChatLib.chat("Error occured, stopped Module.");
  }
}).setDelay(30);

register("command", () => {
  if (started) {
    return ChatLib.chat("Module already started.");
  }
  started = true;
  ChatLib.chat("Started AH Bot.");
  sendMessage();
}).setName("startah");

register("command", () => {
  if (!started) {
    return ChatLib.chat("Module not started yet.");
  }
  started = false;
  ChatLib.chat("Stopped AH Bot.");
}).setName("stopah");

let imagE;
const GUIClass = Java.type("net.minecraft.client.gui.GuiChat").class.toString();
render = false;

register("postguirender", (mouseX, mouseY, guiname) => {
  if (!guiname.class.toString() == GUIClass) return;
  if (!render) return;
  imagE.draw(1, 1);
  render = false;
});
register("chatcomponenthovered", () => {
  render = true;
});

function sendMessage(item) {
  if (!started) return;
  imagE = new Image(`${item.name}${i++}`, `${item.image}`);
  new Message(new TextComponent(`${item.name} - ${item.price}`).setClick("run_command", `${item.command}`).setHover("show_text", "§eImage")).chat();
}
