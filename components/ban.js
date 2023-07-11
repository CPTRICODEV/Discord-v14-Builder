const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
} = require("discord.js");

module.exports = {
  developer: false,
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Ban a specific user")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((options) =>
      options
        .setName("ban")
        .setDescription("ban a specific target")
        .addUserOption((options) =>
          options.setName("target").setDescription("Select a user")
        )
        .addStringOption((options) =>
          options
            .setName("reason")
            .setDescription("Reson for banning the user?")
        )
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  execute(interaction, client) {
    const user = interaction.options.getMember("target");
    const member = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason");
    interaction.reply({
      content: `:wave: You have banned:  **${member.username}#${member.discriminator}** | Reason: ${reason}`,
      ephemeral: true,
    });
    setTimeout(() => {
      user.ban();
    }, 5000);
  },
};
