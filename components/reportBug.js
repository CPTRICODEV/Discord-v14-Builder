const {
  SlashCommandBuilder,
  CommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

const bugsSchema = require("../../Modals/BugsDB");

module.exports = {
  developer: false, // if you have setup a developer guild and you want to check the command out in your developer guild then set this to true!.
  data: new SlashCommandBuilder()
    .setName("bugs")
    .setDescription("Report any bugs")
    .addStringOption((options) =>
      options
        .setName("type")
        .setDescription("Select an option")
        .setRequired(true)
        .addChoices(
          { name: "PJToolKit", value: "PJToolKit" },
          { name: "Discord", value: "Discord" },
          { name: "Website", value: "Website" }
        )
    )
    .addStringOption((options) =>
      options
        .setName("description")
        .setDescription("Describe your problem.")
        .setRequired(true)
    ),

  /**
   *
   * @param { CommandInteraction } interaction,
   * @param { Client } client
   */

  async execute(interaction, client) {
    const { options, guildId, member, user, guild } = interaction;

    const type = options.getString("type");
    const description = options.getString("description");

    const channel = guild.channels.cache.get("1129518953476133005");

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setAuthor({
        name: user.tag,
        iconURL: user.displayAvatarURL({ dynamic: true }),
      })
      .addFields(
        { name: "Bug", value: description, inline: false },
        { name: "Type: ", value: type, inline: false },
        { name: "Status", value: "Pending", inline: false }
      )
      .setTimestamp();

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("bugs-accept")
        .setLabel("✅ Fixed")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("bugs-decline")
        .setLabel("⛔ Not Fixed")
        .setStyle(ButtonStyle.Danger)
    );

    try {
      const m = await channel.send({
        embeds: [embed],
        components: [buttons],
        fetchReply: true,
      });

      await channel.send({
        content: "Use `/bug in the bot-commands channel to submit your bug",
      });

      await interaction.reply({
        content: "Bug was succesfully sent to the channel.",
        ephemeral: true,
      });

      await bugsSchema.create({
        GuildID: guildId,
        MessageID: m.id,
        Details: [
          {
            MemberID: member.id,
            Type: type,
            Bug: description,
          },
        ],
      });
    } catch (err) {
      console.log(err);
    }
  },
};
