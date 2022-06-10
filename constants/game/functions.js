const { getRandomNumber } = require("../functions/util.js");
const { options } = require("./util.js")

class GameMap {
  constructor({ width, height }) {
    width = 100
    height = 100
    let array = Array.from({ length: height }).map(() => []);

    for (const row of array) {
      while (row.length < width) {
        const block = this.getRandomStructure();
        row.push(block.value)
        //if(!block.value) console.log(block)
      }
    }

    const x = (width / 2).toFixed() - 1;
    const y = (height / 2).toFixed() - 1;

    array[y][x] = 2;

    this.map = array;
    this.pos = { x: x, y: y };
    console.log(array)
  }

  getRandomStructure() {
    let num = getRandomNumber(0, 1000, 1)
    num = num < 500 ? getRandomNumber(0, 1000, 1) : num
    const found = options.find(prop => prop.chance > num)
    return found ? found : { name: "grass", value: 0, chance: 1000 }
  }

  getView(distance) {
    const newMap = [];

    for (let y = -distance; y <= distance; y++) {
      if (!newMap[distance + y] || !this.map[this.pos.y + y]) newMap[distance + y] = [];
      for (let x = -distance; x <= distance; x++) {
        if (this.pos.x + x < 0 || !this.map[this.pos.y + y] || !this.map[this.pos.x + x]) {
          newMap[distance + y][distance + x] = 9;
        } else {
          newMap[distance + y][distance + x] = this.map[this.pos.y + y][this.pos.x + x];
        }
      }
    }
    return newMap;
  }

  renderMap(distance) {
    let str = "";
    let map = this.getView(distance);
    for (const row of map) {
      for (const index of row) {
        if (index === 0) str += "🟩";
        if (index === 1) str += "<:wall:962821149480345600>"; //Wall
        if (index === 2) str += "<:steve:519905060558209024>"; // change later
        if (index === 3) str += "<:gold_nugget:869900883977183244>"; //GoldNugget
        if (index === 9) str += "<:air:962820785666416730>"; //Air
      }
      str += "\n";
    }
    return str;
  }
}

function handleMovementButtonClick(obj, int) {
  const { customId: id } = int;

  if (id === "up") {
    if (obj.map[obj.pos.y - 1] && obj.map[obj.pos.y - 1][obj.pos.x] !== 1 && !obj.map[obj.pos.y - 1][obj.pos.x] !== undefined) {
      obj.map[obj.pos.y][obj.pos.x] = 0;
      obj.map[obj.pos.y - 1][obj.pos.x] = 2;
      obj.pos.y--;
    }
  } else if (id === "down") {
    if (obj.map[obj.pos.y + 1] && obj.map[obj.pos.y + 1][obj.pos.x] !== 1 && !obj.map[obj.pos.y + 1][obj.pos.x] !== undefined) {
      obj.map[obj.pos.y][obj.pos.x] = 0;
      obj.map[obj.pos.y + 1][obj.pos.x] = 2;
      obj.pos.y++;
    }
  } else if (id === "left") {
    if (obj.map[obj.pos.x - 1] && obj.map[obj.pos.y][obj.pos.x - 1] !== 1 && !obj.map[obj.pos.y][obj.pos.x - 1] !== undefined) {
      obj.map[obj.pos.y][obj.pos.x] = 0;
      obj.map[obj.pos.y][obj.pos.x - 1] = 2;
      obj.pos.x--;
    }
  } else if (id === "right") {
    if (obj.map[obj.pos.x + 1] && obj.map[obj.pos.y][obj.pos.x + 1] !== 1 && !obj.map[obj.pos.y][obj.pos.x + 1] !== undefined) {
      obj.map[obj.pos.y][obj.pos.x] = 0;
      obj.map[obj.pos.y][obj.pos.x + 1] = 2;
      obj.pos.x++;
    }
  }

  return { obj: obj };
}

function placeStructure(map, block) {
  //
}

module.exports = { GameMap, handleMovementButtonClick };
