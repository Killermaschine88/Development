import request from "./requestV2/index";
import Settings from "./settings/main.js";

let started = false;
let render = false;
let i = 0;
let sent = [];
const { prefix, suffix, rarities } = require("./constants/file.js");

//Command
register("command", () => Settings.openGUI()).setName("test");

/*return

//Rest
register("step", () => {
  if (!started) return;
  //Whatever you wanna call every 30 seconds and started has to be true
  try {
    request("https://development.baltrazz.repl.co/shards").then((res) => {
      if (res.length > 0) {
        res = JSON.parse(res);
        res.forEach((item) => {
          if (sent.includes(item.command)) return;
          sendMessage(item);
          sent.push(item.command);
        });
      } else {
        return ChatLib.chat(`${prefix} No new Items found.`);
      }
    });
  } catch (e) {
    started = false;
    return ChatLib.chat(`${prefix} Error occured, stopped Module.`);
  }
}).setDelay(15);

let imagE;
const GUIClass = Java.type("net.minecraft.client.gui.GuiChat").class.toString();
render = false;

register("postguirender", (mouseX, mouseY, guiname) => {
  ChatLib.chat("before " + guiname.class.toString());
  if (!guiname.class.toString() == GUIClass) return;
  if (!render) return;
  ChatLib.chat("after " + guiname.class.toString());
  imagE.draw(1, 1);
  render = false;
});

register("chatcomponenthovered", () => {
  render = true;
});
*/