const { SlashCommand } = require('slash-create');

module.exports = class HelloCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'hello',
      description: 'Says hello to you.',
      guildIDs: ['789384477335748668']
    });
    this.filePath = __filename;
  }

  async run(ctx) {
    return ctx.send({content: "hi", ephmeral: false});
  }
}
