const {
  SlashCommandBuilder,
  CommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  developer: false, // if you have setup a developer guild and you want to check the command out in your developer guild then set this to true!.
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Reply with the selected user info")
    .addUserOption((options) =>
      options
        .setName("target")
        .setDescription("Select a user to get info from!")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // this will set the permissions of the command, remove it if you want everyone to use it, leave it if you want only administrators to use the command.

  /**
   *
   * @param { CommandInteraction } interaction
   */

  execute(interaction) {
    const user = interaction.options.getUser("target");
    const member = interaction.options.getMember("target");
    var options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    let rolemap = member.roles.cache
      .sort((a, b) => b.position - a.position)
      .map((r) => r)
      .join(" ");
    if (rolemap.length > 1024)
      rolemap = "`The user has to many roles to display all of them!`";
    if (!rolemap) rolemap = "`The user doesn't have any roles!`";
    let status2 = {
      true: "Bot",
      false: "Not a Bot",
    };

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: `${user.tag}`,
            iconURL: `${user.displayAvatarURL()}`,
          })
          .setThumbnail(user.displayAvatarURL())
          .setColor("#ea7777")
          .addFields(
            {
              name: "📛" + " Name",
              value: "`" + `${user.username}` + "`",
              inline: true,
            },
            {
              name: "🆔" + " ID",
              value: "`" + `${user.id}` + "`",
              inline: true,
            },
            {
              name: "✍️" + " Nickname",
              value: "`" + `${member.nickname || "No Nickname"}` + "`",
              inline: true,
            },
            {
              name: ":robot:" + " Bot",
              value: "`" + `${status2[user.bot]}` + "`",
              inline: true,
            },
            {
              name: ":door:" + " Account Created",
              value:
                `<t:` + `${Math.floor(user.createdTimestamp / 1000)}` + `:R>`,
              inline: true,
            },
            {
              name: ":airplane_departure:" + " Joined",
              value:
                `<t:` + `${Math.floor(member.joinedTimestamp / 1000)}` + `:R>`,
              inline: true,
            },
            {
              name: ":fire:" + " Server Boosting Since",
              value:
                "`" +
                `${
                  member.premiumSince?.toLocaleDateString("en-US", options) ||
                  "Not Boosting"
                }` +
                "`",
              inline: true,
            },
            {
              name: "🔇" + " Last Timeout",
              value:
                "`" +
                `${
                  member.communicationDisabledUntil?.toLocaleDateString(
                    "en-US",
                    options
                  ) || "Never Timed Out"
                }` +
                "`",
              inline: true,
            },
            {
              name: "🎧" + " Voice Channel",
              value: `${
                member.voice.channel || "`Currently not in a Voice Channel`"
              }`,
              inline: true,
            },
            {
              name: "🛡️" + " Roles",
              value: rolemap,
              inline: true,
            },
            {
              name: "📜" + " Permissions",
              value: "`" + `${member.permissions.toArray()}` + "`",
              inline: false,
            }
          )
          .setTimestamp(),
      ],
    });
  },
};
