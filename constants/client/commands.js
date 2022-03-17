const commands = [
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
];

module.exports = { commands };
