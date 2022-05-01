import request from "requestV2/index";

import Settings from "./data/Settings";

import * as Const from "./utils/constants";

import * as FileUtils from "./utils/fileUtils";

let started = false;
let i = 0;
let j = 0;
let sent = [];
let running = false;
let color = true;
let divider = 5;

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
  ChatLib.chat(`${Const.prefix} Started searching for Items.`);
  if (j % divider === 0) {
    sent = [];
  }
  j++;
  try {
    request("https://development.baltrazz.repl.co/shards").then((res) => {
      if (res.length > 0) {
        res = JSON.parse(res);
        res.forEach((item) => {
          if (sent.includes(item.command)) return;
          sent.push(item.command);
          sendMessage(item);
        });
      } else {
        return ChatLib.chat(`${Const.prefix} No new Items found.`);
      }
    });
    ChatLib.chat(`${Const.prefix} Finished searching Items and sent them.`);
  } catch (e) {
    started = false;
    ChatLib.chat(`${Const.prefix} Error occured, stopped Module.`);
  }
  running = false;
}).setDelay(20);

register("command", () => {
  if (started) {
    return ChatLib.chat(`${Const.prefix} Module already started.`);
  }
  started = true;
  ChatLib.chat(`${Const.prefix} Started AH Bot.`);
}).setName("ahstart");

register("command", () => {
  if (!started) {
    return ChatLib.chat(`${Const.prefix} Module not started yet.`);
  }
  started = false;
  ChatLib.chat(`${Const.prefix} Stopped AH Bot.`);
}).setName("ahstop");

register("command", (arg1) => {
  if (isNaN(Number(arg1))) {
    ChatLib.chat(`${Const.prefix} ${arg1} isnt a valid number.`);
  } else {
    divider = Number(arg1);
    ChatLib.chat(`${Const.prefix} Succcessfully changed to ${arg1}`);
  }
}).setName("ahdivider");


//DEBUG

const testObject = {
  name:"Aurora Helmet",
  price:"30,300,000",
  rarity:"LEGENDARY",
  command:"/viewauction 055b2876e20a498383e1a0d4196a33d7"
}

function sendTestMessage(testObject) {
  //if (!started) return;
  let colorcode = "a";
  let price = testObject.price.replace(/,/g, "");
  if (price > 20000000 && color) {
    colorcode = "c";
  }
  new Message(new TextComponent(`${Const.prefix} ${Const.rarities[testObject.rarity]}${testObject.name} §f- §${colorcode}${testObject.price} ${Const.suffix}`).setClick("run_command", `${testObject.command}`).setHover("show_text", `${testObject.name}`)).chat();
}

//DEBUG END

//new command System
//TODO: Port old commands to Settings and implement them in code

register("command", (...args) => {
  if(args === undefined) {
    return Settings.openGUI();
  };
  let args2 = [];
  if(args.length > 1) {
    args.forEach(arg => {
      args2[args.indexOf(arg)] = arg;
    });
  };
  if("add".includes(args[0])) {
    try {
      FileUtils.add(args);
    } catch (e) {
      console.log(`${ChatLib.getChatBreak()}`);
      ChatLib.chat(`§4Uncaught Error occured during adding §b${args[1]} §4to the list. Check the console for more Information`);
      console.log(`Command: "add"\nError: "${e.name}"\nMessage: "${e.message}"\nFileName: "${e.fileName}"\nLineNumber: "${e.lineNumber}"`);
    };
  };
  if("remove".includes(args[0])) {
    try {
      FileUtils.remove(args);
    } catch (e) {
      console.log(`${ChatLib.getChatBreak()}`);
      ChatLib.chat(`§4Uncaught Error occured during removing §b${args[1]} §4to the list. Check the console for more Information`);
      console.log(`Command: "remove"\nError: "${e.name}"\nMessage: "${e.message}"\nFileName: "${e.fileName}"\nLineNumber: "${e.lineNumber}"`);
    };
  };
  if("list".includes(args[0])) {
    try {
      FileUtils.list();
    } catch (e) {
      console.log(`${ChatLib.getChatBreak()}`);
      ChatLib.chat(`§4Uncaught Error occured during listing the list. Check the console for more Information`);
      console.log(`Command: "list"\nError: "${e.name}"\nMessage: "${e.message}"\nFileName: "${e.fileName}"\nLineNumber: "${e.lineNumber}"`);
    }
  }
}).setTabCompletions("add", "remove", "list").setName("ahbot");


function sendMessage(item) {
  if (!started) return;
  let colorcode = "a"
  let price = item.price.replace(/,/g, "");
  if (price > 20000000 && color) {
    colorcode = "c";
  }
  new Message(new TextComponent(`${Const.prefix} ${Const.rarities[item.rarity]}${item.name} §f- §${colorcode}${item.price} ${Const.suffix}`).setClick("run_command", `${item.command}`).setHover("show_text", `${item.name}`)).chat();
}