const {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const db = require("../../Modals/WarningDB");

module.exports = {
  developer: false,
  data: new SlashCommandBuilder()
    .setName("warning")
    .setDescription("Warning System")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

    .addSubcommand((options) =>
      options
        .setName("add")
        .setDescription("Give a user a warning")
        .addUserOption((options) =>
          options
            .setName("target")
            .setDescription("Select a target.")
            .setRequired(true)
        )
        .addStringOption((options) =>
          options
            .setName("reason")
            .setDescription("Provide a reason.")
            .setRequired(true)
        )
        .addStringOption((options) =>
          options
            .setName("evidence")
            .setDescription("Provide evidence.")
            .setRequired(false)
        )
    )

    .addSubcommand((options) =>
      options
        .setName("check")
        .setDescription("check a user")
        .addUserOption((options) =>
          options
            .setName("target")
            .setDescription("Select a target.")
            .setRequired(true)
        )
    )

    .addSubcommand((options) =>
      options
        .setName("remove")
        .setDescription("remove a warning from a user")
        .addUserOption((options) =>
          options
            .setName("target")
            .setDescription("Select a target.")
            .setRequired(true)
        )
        .addNumberOption((options) =>
          options
            .setName("warnid")
            .setDescription("Provide the warning ID.")
            .setRequired(true)
        )
    )

    .addSubcommand((options) =>
      options
        .setName("clear")
        .setDescription("clear a user")
        .addUserOption((options) =>
          options
            .setName("target")
            .setDescription("Select a target.")
            .setRequired(true)
        )
    ),

  /**
   *
   * @param { CommandInteraction } interaction
   */
  async execute(interaction) {
    const Sub = interaction.options.getSubcommand([
      "add",
      "check",
      "remove",
      "clear",
    ]);
    const Target = interaction.options.getMember("target");
    const Reason = interaction.options.getString("reason");
    const Evidence =
      interaction.options.getString("evidence") || "None provided.";
    const WarnID = interaction.options.getNumber("warnid") - 1;
    const WarnDate = new Date(
      interaction.createdTimestamp
    ).toLocaleDateString();

    if (Sub === "add") {
      db.findOne(
        {
          GuildID: interaction.guild.id,
          UserID: Target.id,
          UserTag: Target.user.tag,
        },
        async (err, data) => {
          if (err) throw err;
          if (data === null) {
            data = new db({
              GuildID: interaction.guild.id,
              UserID: Target.id,
              UserTag: Target.user.tag,
              Content: [
                {
                  ExecuterID: interaction.user.id,
                  ExecuterTag: interaction.user.tag,
                  Reason: Reason,
                  Evidence: Evidence,
                  Date: WarnDate,
                },
              ],
            });
          } else {
            const obj = {
              ExecuterID: interaction.user.id,
              ExecuterTag: interaction.user.tag,
              Reason: Reason,
              Evidence: Evidence,
              Date: WarnDate,
            };
            data.Content.push(obj);
          }
          data.save();
        }
      );

      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("WARNING SYSTEM")
            .setColor("Blurple")
            .setDescription(
              `Warning Added: <@${Target.user.id}>  ||**ID**: ${Target.id} ||\n**Reason**: ${Reason}\n**Evidence**: ${Evidence}`
            ),
        ],
      });
    } else if (Sub === "check") {
      db.findOne(
        {
          GuildID: interaction.guild.id,
          UserID: Target.id,
          UserTag: Target.user.tag,
        },
        async (err, data) => {
          if (err) throw err;
          if (data) {
            interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("WARNING SYSTEM")
                  .setColor("Blurple")
                  .setDescription(
                    `${data.Content.map(
                      (w, i) =>
                        `**ID**: ${i + 1}\n**By**: ${
                          w.ExecuterTag
                        }\n**Date**: ${w.Date}\n**Reason**: ${
                          w.Reason
                        }\n**Evidence**: ${w.Evidence}\n`
                    ).join(" ")}`
                  ),
              ],
            });
          } else if (!data) {
            interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("WARNING SYSTEM")
                  .setColor("Blurple")
                  .setDescription(
                    `<@${Target.user.id}>  ||**ID**: ${Target.id} || has no warnings.`
                  ),
              ],
            });
          }
        }
      );
    } else if (Sub === "remove") {
      db.findOne(
        {
          GuildID: interaction.guild.id,
          UserID: Target.id,
          UserTag: Target.user.tag,
        },
        async (err, data) => {
          if (err) throw err;
          if (data) {
            data.Content.splice(WarnID, 1);
            interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("WARNING SYSTEM")
                  .setColor("Blurple")
                  .setDescription(
                    `<@${Target.user.id}>´s warning id: ${
                      WarnID + 1
                    } has been removed.`
                  ),
              ],
            });
            data.save();
          } else {
            interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("WARNING SYSTEM")
                  .setColor("Blurple")
                  .setDescription(
                    `<@${Target.user.id}>  ||**ID**: ${Target.id} || has no warnings.`
                  ),
              ],
            });
          }
        }
      );
    } else if (Sub === "clear") {
      db.findOne(
        {
          GuildID: interaction.guildId,
          UserID: Target.id,
          UserTag: Target.user.tag,
        },
        async (err, data) => {
          if (err) throw err;
          if (data) {
            await db.findOneAndDelete({
              GuildID: interaction.guildId,
              UserID: Target.id,
              UserTag: Target.user.tag,
            });
            interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("WARNING SYSTEM")
                  .setColor("Blurple")
                  .setDescription(
                    `<@${Target.user.id}>´s warnings were cleard. 🧹`
                  ),
              ],
            });
          } else {
            interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("WARNING SYSTEM")
                  .setColor("Blurple")
                  .setDescription(
                    `<@${Target.user.id}>  ||**ID**: ${Target.id} || has no warnings.`
                  ),
              ],
            });
          }
        }
      );
    }
  },
};
