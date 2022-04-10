const { getRandomNumber } = require("../functions/util.js");

function generateMap({ width, height }) {
  const options = [
    {
      name: "wall",
      value: 1,
      chance: 15,
    },
    {
      name: "grass",
      value: 0,
      chance: 99,
    },
  ];

  const array = Array.from({ length: height }).map(() => []);

  for (const row of array) {
    while (row.length < width) {
      row.push(options.find((entry) => entry.chance >= getRandomNumber(0, 100))?.value || 0);
    }
  }

  const x = (width / 2).toFixed() - 1;
  const y = (height / 2).toFixed() - 1;

  array[y][x] = 2;

  return {
    map: array,
    pos: {
      x: x,
      y: y,
    },
  };
}

function renderMap(obj, distance) {
  let str = "";
  let map = getView(obj, distance);
  for (const row of map) {
    for (const index of row) {
      if (index === 0) str += "🟩";
      if (index === 1) str += "<:wall:962821149480345600>";
      if (index === 2) str += "<:steve:519905060558209024>"; // change later
      if (index === 9) str += "<:air:962820785666416730>";
    }
    str += "\n";
  }
  return str;
}

function getView(map, distance) {
  const newMap = [];

  for (let y = -distance; y <= distance; y++) {
    if (!newMap[distance + y] || !map.map[map.pos.y + y]) newMap[distance + y] = [];
    for (let x = -distance; x <= distance; x++) {
      if (map.pos.x + x < 0 || !map.map[map.pos.y + y] || !map.map[map.pos.x + x]) {
        newMap[distance + y][distance + x] = 9;
      } else {
        newMap[distance + y][distance + x] = map.map[map.pos.y + y][map.pos.x + x];
      }
    }
  }

  return newMap;
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

  return obj;
}

module.exports = { generateMap, renderMap, handleMovementButtonClick };
