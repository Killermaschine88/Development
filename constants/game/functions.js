const { getRandomNumber } = require("../functions/util.js");

class GameMap {
  constructor({ width, height }) {
    const options = [
      {
        name: "treasure",
        value: 3,
        chance: 5,
      },
      {
        name: "wall",
        value: 1,
        chance: 30,
      },
      {
        name: "grass",
        value: 0,
        chance: 150,
      },
    ];

    let array = Array.from({ length: height }).map(() => []);

    for (const row of array) {
      while (row.length < width) {
        row.push(options.find((entry) => entry.chance >= getRandomNumber(0, 150))?.value || 0);
      }
    }

    const x = (width / 2).toFixed() - 1;
    const y = (height / 2).toFixed() - 1;

    array[y][x] = 2;

    this.map = array;
    this.pos = { x: x, y: y };
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
        if (index === 1) str += "<:wall:962821149480345600>";
        if (index === 2) str += "<:steve:519905060558209024>"; // change later
        if (index === 3) str += "<:gold_nugget:869900883977183244>";
        if (index === 9) str += "<:air:962820785666416730>";
      }
      str += "\n";
    }
    return str;
  }
}

function handleMovementButtonClick(obj, int) {
  const { customId: id } = int;
  let walkedOn;

  if (id === "up") {
    if (obj.map[obj.pos.y - 1] && obj.map[obj.pos.y - 1][obj.pos.x] !== 1 && !obj.map[obj.pos.y - 1][obj.pos.x] !== undefined) {
      walkedOn = obj.map[obj.pos.y - 1][obj.pos.x];
      obj.map[obj.pos.y][obj.pos.x] = 0;
      obj.map[obj.pos.y - 1][obj.pos.x] = 2;
      obj.pos.y--;
    }
  } else if (id === "down") {
    if (obj.map[obj.pos.y + 1] && obj.map[obj.pos.y + 1][obj.pos.x] !== 1 && !obj.map[obj.pos.y + 1][obj.pos.x] !== undefined) {
      walkedOn = obj.map[obj.pos.y + 1][obj.pos.x];
      obj.map[obj.pos.y][obj.pos.x] = 0;
      obj.map[obj.pos.y + 1][obj.pos.x] = 2;
      obj.pos.y++;
    }
  } else if (id === "left") {
    if (obj.map[obj.pos.x - 1] && obj.map[obj.pos.y][obj.pos.x - 1] !== 1 && !obj.map[obj.pos.y][obj.pos.x - 1] !== undefined) {
      walkedOn = obj.map[obj.pos.y][obj.pos.x - 1];
      obj.map[obj.pos.y][obj.pos.x] = 0;
      obj.map[obj.pos.y][obj.pos.x - 1] = 2;
      obj.pos.x--;
    }
  } else if (id === "right") {
    if (obj.map[obj.pos.x + 1] && obj.map[obj.pos.y][obj.pos.x + 1] !== 1 && !obj.map[obj.pos.y][obj.pos.x + 1] !== undefined) {
      walkedOn = obj.map[obj.pos.y][obj.pos.x + 1];
      obj.map[obj.pos.y][obj.pos.x] = 0;
      obj.map[obj.pos.y][obj.pos.x + 1] = 2;
      obj.pos.x++;
    }
  }

  return { obj: obj, walkedOn: walkedOn };
}

module.exports = { GameMap, handleMovementButtonClick };
