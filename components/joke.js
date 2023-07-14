const {
  SlashCommandBuilder,
  CommandInteraction,
  PermissionFlagsBits,
} = require("discord.js");

const axios = require("axios");

module.exports = {
  developer: false, // if you have setup a developer guild and you want to check the command out in your developer guild then set this to true!.
  data: new SlashCommandBuilder()
    .setName("joke")
    .setDescription("Reply to you with a random joke")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // this will set the permissions of the command, remove it if you want everyone to use it, leave it if you want only administrators to use the command.

  /**
   *
   * @param { CommandInteraction } interaction,
   * @param { Client } client
   */

  execute(interaction, client) {
    axios.get("https://v2.jokeapi.dev/joke/Any?format=txt").then((res) => {
      interaction.reply({
        content: `${res.data}`,
        ephemeral: [true],
      });
    });
  },
};
