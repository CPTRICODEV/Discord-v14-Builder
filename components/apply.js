const {
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  developer: false, // if you have setup a developer guild and you want to check the command out in your developer guild then set this to true!.
  data: new SlashCommandBuilder()
    .setName("apply")
    .setDescription("Send an application to get on the team!"),

  /**
   *
   * @param { CommandInteraction } interaction,
   * @param { Client } client
   */

  async execute(interaction, client) {
    const modal = new ModalBuilder()
      .setTitle("Application for pjtoolkit")
      .setCustomId("apply");

    const name = new TextInputBuilder()
      .setCustomId("name")
      .setRequired(true)
      .setPlaceholder("Your First Name")
      .setLabel("Name")
      .setStyle(TextInputStyle.Short);

    const alder = new TextInputBuilder()
      .setCustomId("alder")
      .setRequired(true)
      .setPlaceholder("How old are you? (16+)")
      .setLabel("Age")
      .setStyle(TextInputStyle.Short);

    const description = new TextInputBuilder()
      .setCustomId("description")
      .setRequired(true)
      .setPlaceholder(
        "Describe yourself, highlighting skills, strengths, including relevant experience and ideas."
      )
      .setLabel("Description")
      .setStyle(TextInputStyle.Paragraph);

    const one = new ActionRowBuilder().addComponents(name);
    const two = new ActionRowBuilder().addComponents(alder);
    const three = new ActionRowBuilder().addComponents(description);

    modal.addComponents(one, two, three);
    await interaction.showModal(modal);
  },
};
