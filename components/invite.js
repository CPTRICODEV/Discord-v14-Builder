const {
  SlashCommandBuilder,
  CommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  developer: false, // if you have setup a developer guild and you want to check the command out in your developer guild then set this to true!.
  data: new SlashCommandBuilder()
    .setName("create-invite")
    .setDescription("Create an invite for your server")
    .setDefaultMemberPermissions(PermissionFlagsBits.CreateInstantInvite) // Change or remove this to allow @everyone to create invite links.
    .addChannelOption((options) =>
      options
        .setName("channel")
        .setDescription("The channel to create the invite in")
        .setRequired(false)
    )
    .addIntegerOption((options) =>
      options
        .setName("max-age")
        .setDescription("The max age for your invite (in seconds)")
        .setRequired(false)
    )
    .addIntegerOption((options) =>
      options
        .setName("max-uses")
        .setDescription("The max number of people who can use this invite")
        .setRequired(false)
    )
    .addStringOption((options) =>
      options
        .setName("reason")
        .setDescription("The reason for creating this invite")
        .setRequired(false)
    ),

  /**
   *
   * @param { CommandInteraction } interaction,
   * @param { Client } client
   */

  async execute(interaction, client) {
    const { options } = interaction;
    const channel = options.getChannel("channel") || interaction.channel;
    const maxAge = options.getInteger("max-age") || 0;
    const maxUses = options.getInteger("max-uses") || 0;
    const reason = options.getString("reason") || "No reason provied";

    const invite = await channel.createInvite({
      maxAge: maxAge,
      maxUses: maxUses,
      reason: reason,
    });

    if (maxAge === 0) maxAge == "infinite";
    if (maxUses === 0) maxUses == "infinite";

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle(`🤖 I have created your invite link!`)
      .addFields({
        name: `🔗 Invite link`,
        value: `https://discord.gg/${invite.code} OR \`${invite.code}\``,
      })
      .addFields({ name: `🗨️ Invite Channel`, value: `*${channel}*` })
      .addFields({ name: `👥 Max Uses`, value: `\`${maxUses}\`` })
      .addFields({ name: `⌛ Max Age`, value: `\`${maxAge}\`` })
      .setDescription(`You created this invite for: *${reason}*`)
      .setTimestamp()
      .setFooter({ text: `Invite Generator` });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
