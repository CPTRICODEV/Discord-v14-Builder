const {
  SlashCommandBuilder,
  CommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

const ms = module.require("ms");

module.exports = {
  developer: false, // if you have setup a developer guild and you want to check the command out in your developer guild then set this to true!.
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Unmute the select user")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages) // this will set the permissions of the command, remove it if you want everyone to use it, leave it if you want only administrators to use the command.
    .addUserOption((options) =>
      options
        .setName("target")
        .setDescription("Select the user you want to unmute")
        .setRequired(true)
    ),

  /**
   *
   * @param { CommandInteraction } interaction,
   * @param { Client } client
   */

  async execute(interaction) {
    const { guild, options } = interaction;

    const user = options.getUser("target");
    const member = guild.members.cache.get(user.id);

    const errEmbed = new EmbedBuilder()
      .setDescription("Something went wrong. Please try again later.")
      .setColor(0xc72c3b);

    const succesEmbed = new EmbedBuilder()
      .setTitle("**:white_check_mark: Unmuted**")
      .setDescription(`Succesfully unmuted ${user}.`)
      .setColor(0x5fb041)
      .setTimestamp();

    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    )
      return interaction.reply({ embeds: [errEmbed], ephemeral: true }); // this if statement is optional (but recommended)

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.ModerateMembers
      )
    )
      return interaction.reply({ embeds: [errEmbed], ephemeral: true });

    try {
      await member.timeout(null);

      interaction.reply({ embeds: [succesEmbed], ephemeral: true });
    } catch (err) {
      console.log(err);
    }
  },
};
