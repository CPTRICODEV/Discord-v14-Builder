const {
  PermissionFlagsBits,
  EmbedBuilder,
  IntegrationApplication,
  CommandInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

const bugsSchema = require("../../Modals/BugsDB");

module.exports = {
  name: "interactionCreate",

  async execute(interaction) {
    const { member, guildId, customId, message, guild } = interaction;

    const channel = guild.channels.cache.get("1129522795177578526");

    if (!interaction.isButton()) return;

    if (customId == "bugs-accept" || customId == "bugs-decline") {
      if (!member.permissions.has(PermissionFlagsBits.Administrator))
        return interaction.reply({
          content: "You do not have permissions for that.",
          ephermeral: true,
        });

      bugsSchema.findOne(
        { GuildID: guildId, MessageID: message.id },
        async (err, data) => {
          if (err) throw err;

          if (!data) {
            return interaction.reply({
              content: "No data was found.",
              ephermeral: true,
            });
          }

          const embed = message.embeds[0];

          if (!embed)
            return interaction.reply({
              content: "No data was found",
              ephermeral: true,
            });

          switch (customId) {
            case "bugs-accept":
              embed.data.fields[2] = {
                name: "Status",
                value: "Fixed",
                inline: true,
              };
              const acceptedEmbed = EmbedBuilder.from(embed).setColor("Green");

              message.edit({ embeds: [acceptedEmbed] });
              interaction.reply({
                content: "Bugs successfully declined.",
                ephermeral: true,
              });
              break;

            case "bugs-decline":
              embed.data.fields[2] = {
                name: "Status",
                value: "Not Fixed",
                inline: true,
              };
              const declineEmbed = EmbedBuilder.from(embed).setColor("Red");

              message.edit({ embeds: [declineEmbed] });
              interaction.reply({
                content: "Bugs successfully declined.",
                ephermeral: true,
              });
              break;
          }
        }
      );
    }
  },
};
