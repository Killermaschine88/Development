import request from "requestV2/index"
let started = false;
let render = false;
let i = 0;
let j = 0;
let sent = [];
let running = false;
const prefix = "[§eAH Bot§f]"
const suffix = "§l§f[§6CLICK ME§f]"
const rarities = {
  COMMON: "§7",
  UNCOMMON: "§a",
  RARE: "§9",
  EPIC: "§5",
  LEGENDARY: "§6",
  MYTHIC: "§d"
}

const blacklist = ["Your Implosion", "There are blocks"]

//Implosion Hider
register("chat", (message, event) => {
  if(blacklist.some(word => message.includes(word))) {
    cancel(event)
  }
}).setCriteria("${message}")

register("step", () => {
  if (!started) return;
  if(running) return;
  running = true
  ChatLib.chat(`${prefix} Started searching for Items.`);
  if(j % 5 === 0) {
    sent = []
  }
  j++
  //Whatever you wanna call every 30 seconds and started has to be true
  try {
    request("https://development.baltrazz.repl.co/shards").then(res => {
        if (res.length > 0) {
            res = JSON.parse(res);
            res.forEach(item => {
                if(sent.includes(item.command)) return;
              sent.push(item.command)
                sendMessage(item);
                //sent.push(item.command)
            })
          } else {
            return ChatLib.chat(`${prefix} No new Items found.`);
          }
    })
    ChatLib.chat(`${prefix} Finished searching Items and sent them.`);
  } catch (e) {
    started = false;
    return ChatLib.chat(`${prefix} Error occured, stopped Module.`);
  }
  running = false
}).setDelay(20);

register("command", () => {
  if (started) {
    return ChatLib.chat(`${prefix} Module already started.`);
  }
  started = true;
  ChatLib.chat(`${prefix} Started AH Bot.`);
}).setName("startah");

register("command", () => {
  if (!started) {
    return ChatLib.chat(`${prefix} Module not started yet.`);
  }
  started = false;
  ChatLib.chat(`${prefix} Stopped AH Bot.`);
}).setName("stopah");

/*let imagE;
const GUIClass = Java.type("net.minecraft.client.gui.GuiChat").class.toString();
render = false;

register("postguirender", (mouseX, mouseY, guiname) => {
  //ChatLib.chat("before " + guiname.class.toString())
  if (!guiname.class.toString() == GUIClass) return;
  if (!render) return;
  ChatLib.chat("after " + guiname.class.toString())
  imagE.draw(1, 1);
  render = false;
});

register("chatcomponenthovered", () => {
  render = true;
});*/

function sendMessage(item) {
  if (!started) return;
  //imagE = new Image(`${item.name}${i++}`, `${item.image}`);
  new Message(new TextComponent(`${prefix} ${rarities[item.rarity]}${item.name} §f- §a${item.price} ${suffix}`).setClick("run_command", `${item.command}`).setHover("show_text", `${item.name}`)).chat();
}
