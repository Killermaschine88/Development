const commands = [{
  name: 'tictactoe',
  description: 'Play tictactoe',
  options: [{
    name: 'opponent',
    type: 'USER',
    description: 'Your opponent',
    required: true
  }]
}]

module.exports = { commands }