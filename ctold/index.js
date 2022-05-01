import request from "requestV2/index";
let started = false;
let render = false;
let i = 0;
let j = 0;
let sent = [];
let running = false;
let color = true;
let divider = 5;
const prefix = "[§eAH Bot§f]";
const suffix = "§l§f[§6CLICK ME§f]";
const rarities = {
  COMMON: "§7",
  UNCOMMON: "§a",
  RARE: "§9",
  EPIC: "§5",
  LEGENDARY: "§6",
  MYTHIC: "§d",
};

const blacklist = ["Your Implosion", "There are blocks"];

//Implosion Hider
register("chat", (message, event) => {
  if (blacklist.some((word) => message.includes(word))) {
    cancel(event);
  }
}).setCriteria("${message}");

register("step", () => {
  if (!started) return;
  if (running) return;
  running = true;
  ChatLib.chat(`${prefix} Started searching for Items.`);
  if (j % divider === 0) {
    sent = [];
  }
  j++;
  //Whatever you wanna call every 30 seconds and started has to be true
  try {
    request("https://development.baltrazz.repl.co/shards").then((res) => {
      if (res.length > 0) {
        res = JSON.parse(res);
        res.forEach((item) => {
          if (sent.includes(item.command)) return;
          sent.push(item.command);
          sendMessage(item);
          //sent.push(item.command)
        });
      } else {
        return ChatLib.chat(`${prefix} No new Items found.`);
      }
    });
    ChatLib.chat(`${prefix} Finished searching Items and sent them.`);
  } catch (e) {
    started = false;
    ChatLib.chat(`${prefix} Error occured, stopped Module.`);
  }
  running = false;
}).setDelay(20);

register("command", () => {
  if (started) {
    return ChatLib.chat(`${prefix} Module already started.`);
  }
  started = true;
  ChatLib.chat(`${prefix} Started AH Bot.`);
}).setName("ahstart");

register("command", () => {
  if (!started) {
    return ChatLib.chat(`${prefix} Module not started yet.`);
  }
  started = false;
  ChatLib.chat(`${prefix} Stopped AH Bot.`);
}).setName("ahstop");

register("command", (arg1) => {
  if (isNaN(Number(arg1))) {
    ChatLib.chat(`${prefix} ${arg1} isnt a valid number.`);
  } else {
    divider = Number(arg1);
    ChatLib.chat(`${prefix} Succcessfully changed to ${arg1}`);
  }
}).setName("ahdivider");

register("command", () => {
  if (color) {
    color = false;
    ChatLib.chat(`${prefix} Disabled Price Color change`);
  } else {
    color = true;
    ChatLib.chat(`${prefix} Enabled Price Color change`);
  }
}).setName("ahcolor");


function sendMessage(item) {
  if (!started) return;
  let colorcode = "a";
  ChatLib.chat("before")
  if (Number(item.price.replaceAll(",", "")) > 20000000 && color) {
    colorcode = "c";
  }
  ChatLib.chat("after")
  new Message(new TextComponent(`${prefix} ${rarities[item.rarity]}${item.name} §f- §${colorcode}${item.price} ${suffix}`).setClick("run_command", `${item.command}`).setHover("show_text", `${item.name}`)).chat();
}

import RichPresence from "RichPresence";

const rpc = new RichPresence("844951901653041203", {
  state: "Making Money",
  details: "on Skyblock",
  startTimestamp: Date.now(),
  //largeImageKey: "imageName", //this image is uploaded to the rich presence section of your application https://discord.com/developers/applications
  largeImageText: "Hello"
})