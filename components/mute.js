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
    .setName("mute")
    .setDescription("Mute the select user")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages) // this will set the permissions of the command, remove it if you want everyone to use it, leave it if you want only administrators to use the command.
    .addUserOption((options) =>
      options
        .setName("target")
        .setDescription("Select the user you want to mute")
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("time")
        .setDescription("How long should the mute last? (1m, 1h, 1 day)")
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("reason")
        .setDescription("What is the reason of the mute?")
    ),

  /**
   *
   * @param { CommandInteraction } interaction,
   * @param { Client } client
   */

  async execute(interaction, client) {
    const { guild, options } = interaction;

    const user = options.getUser("target");
    const member = options.getMember("target");
    const time = options.getString("time");
    const convertedTime = ms(time);
    const reason = options.getString("reason") || "No reason provided";

    const errEmbed = new EmbedBuilder()
      .setDescription("Something went wrong. Please try agin later")
      .setColor(0xc72c3b);

    const successEmbed = new EmbedBuilder()
      .setTitle("**:white_check_mark_ Muted**")
      .setDescription(`Succesfully muted ${user}`)
      .addFields(
        { name: "Reason", value: `${reason}`, inline: true },
        { name: "Duration", value: `${time}`, inline: true }
      )
      .setColor(0x5fb041)
      .setTimestamp();

    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    )
      return interaction.reply({ embeds: [errEmbed], ephemeral: true });

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.ModerateMembers
      )
    )
      return interaction.reply({ embeds: [errEmbed], ephemeral: true });

    if (!convertedTime)
      return interaction.reply({ embeds: [errEmbed], ephemeral: true });

    try {
      console.log(convertedTime);
      await member.timeout(convertedTime, reason);

      interaction.reply({ embeds: [successEmbed], ephemeral: true });
    } catch (err) {
      console.log(err);
    }
  },
};
