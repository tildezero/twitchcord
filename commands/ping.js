const { SlashCommand } = require('slash-create');

module.exports = class PingCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'ping',
      description: 'pong.',
      guildIDs: ['789384477335748668']
    });
    this.filePath = __filename;
  }

  async run(ctx) {
    return `Pong!`;
  }
}
