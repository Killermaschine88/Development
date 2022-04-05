const commands = [
  /*{
    name: "create-embed",
    description: "create an embed or fetch one via link",
    options: [
      {
        name: "link",
        description: "starb.in or discord message link",
        type: "STRING",
        required: true,
      },
    ],
  },*/
  {
    name: "tictactoe",
    description: "play tictactoe",
    options: [
      {
        name: "opponent",
        description: "your tictactoe opponent",
        type: "USER",
        required: true,
      },
    ],
  },
  {
    name: "connect4",
    description: "play connect4",
    options: [
      {
        name: "opponent",
        description: "your connect4 opponent",
        type: "USER",
        required: true,
      },
    ],
  },
  {
    name: "hangman",
    description: "play hangman",
    options: [
      {
        name: "category",
        description: "the category the word should be from",
        type: "STRING",
        choices: [
          {
            name: "animal",
            value: "animal",
          },
          {
            name: "city",
            value: "city",
          },
        ],
      },
    ],
  },
  {
    name: "calculator",
    description: "Pull out the Calculator",
  },
];

module.exports = { commands };
