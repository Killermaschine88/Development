function getStage(stage) {
  let str = "";
  const states = {
    0: "\n",
    1: `  +---+
  |   |
      |
      |
      |
      |
=========`,
    2: `  +---+
  |   |
  O   |
      |
      |
      |
=========`,
    3: `  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
    4: `  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
    5: `  +---+
  |   |
  O   |
 /|\  |
      |
      |
=========
`,
    6: `  +---+
  |   |
  O   |
 /|\  |
 /    |
      |
=========`,
    7: `  +---+
  |   |
  O   |
 /|\  |
 / \  |
      |
=========`
  };

  return states[stage];
}

function getRandomWord(category) {
  const obj = {
    'animal': ['bird', 'fish'],
    'city': ['vienna']
  }

  let array;
  if(!category) {
    array = Object.keys(obj)
    array = array[Math.floor(Math.random() * array.length)]
  } else {
    array = obj[category]
  }

  return obj[array][Math.floor(Math.random() * obj[array].length)]
}

module.exports = { getStage, getRandomWord };
