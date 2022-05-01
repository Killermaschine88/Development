import * as constants from "./constants";

export function list() {
    let list = JSON.parse(FileLib.read("AhBot", "data/items.json"));
    if(list == null) return ChatLib.chat("§4Error: The File to save the items in doesn't exist!");
    ChatLib.chat(`&9&m${ChatLib.getChatBreak()}§r\n§CThe List Contains:`);
    list.forEach(item => {
        ChatLib.chat(`§6${item}`);
    });
    ChatLib.chat(`&9&m${ChatLib.getChatBreak()}§r`);
};

function isIn(list, search) {
    let found = false
    list.forEach(item => {
        item2 = item.toLowerCase();
        if(item2 == search) found = true;
    });
    if(found) return true;
    return false;
};

export function add(newItem) {
    let list = JSON.parse(FileLib.read("AhBot", "data/items.json"));
    if(list == null) return ChatLib.chat("§4Error: The File to save the items in doesn't exist!");
    let args = [];
    newItem.forEach(arg => {
        args[newItem.indexOf(arg)] = arg;
    })
    newItem.reverse().pop();
    if(newItem.length > 1) {
        newItem.reverse();
    }
    newItem = newItem.toString().replace(/,/g, " ");
    newItemLow = newItem.toLowerCase();
    if(isIn(list, newItemLow)) return ChatLib.chat(`§4Error: §f"§b${newItem}§f" §4Already exists in the list`);
    list.push(newItem);
    FileLib.write("AhBot", "data/items.json", JSON.stringify(list, null, "\t"));
};

//TODO: Make the remove function and make it work for command also check if Item is even in list!