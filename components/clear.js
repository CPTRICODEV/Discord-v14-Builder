const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  CommandInteraction,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  developer: false,
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear the chat or someones messeges")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of messages to clear.")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Select a target to clear their messages.")
        .setRequired(false)
    ),

  /**
   *
   * @param { CommandInteraction } interaction
   */

  async execute(interaction) {
    const { channel, options } = interaction;

    const amount = options.getInteger("amount");
    const target = options.getUser("target");

    const messages = await channel.messages.fetch({
      limit: amount + 0,
    });

    const res = new EmbedBuilder().setColor(0x5fb041);

    try {
      if (target) {
        let i = 0;
        const filtered = [];

        (await messages).filter((msg) => {
          if (msg.author.id === target.id && amount > i) {
            filtered.push(msg);
            i++;
          }
        });

        await channel.bulkDelete(filtered).then((messages) => {
          res.setDescription(
            `Succesfully delted ${messages.size} messages from ${target}`
          );
          interaction.reply({ embeds: [res], ephemeral: [true] });
        });
      } else {
        await channel.bulkDelete(amount, true).then((messages) => {
          res.setDescription(
            `Succesfully delted ${messages.size} messages from the channel`
          );
          interaction.reply({ embeds: [res], ephemeral: [true] });
        });
      }
    } catch (error) {
      res.setDescription(
        "ERROR DETECTED! | You can delete message that are 14 days old"
      );
    }
  },
};
