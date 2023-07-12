const {
  EmbedBuilder,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Client,
  ChannelType,
  UserFlags,
  version,
} = require("discord.js");
const os = require("os");
const { connection } = require("mongoose");

module.exports = {
  developer: false,
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Check the bot status"),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param { Client } client
   */

  async execute(interaction, client) {
    const status = ["Disconnected", "Connected", "Connecting", "Disconnecting"];

    await client.user.fetch();
    await client.application.fetch();

    const getChannelTypeSize = (type) =>
      client.channels.cache.filter((channel) => type.includes(channel.type))
        .size;

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Random")
          .setTitle(`🤖 ${client.user.username} Status`)
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
          .setDescription(
            `**Beskrivelse:**  \n${client.application.description || null}`
          )
          .addFields(
            { name: "🖥️ Client", value: client.user.tag, inline: true },
            {
              name: "🗓️ Created",
              value: `<t:${parseInt(client.user.createdTimestamp / 1000)}:R>`,
              inline: true,
            },
            {
              name: "✅ Verified",
              value: client.user.flags & UserFlags.VerifiedBot ? "Ja" : "Nej",
              inline: true,
            },
            {
              name: "👨🖥️ Owner",
              value: `${client.application.owner.tag || "Ingen"}`,
              inline: true,
            },
            {
              name: "📚 DataBase",
              value: status[connection.readyState],
              inline: true,
            },
            {
              name: "🖥 System",
              value: os
                .type()
                .replace("Windows_NT", "Windows")
                .replace("Darwin", "macOS"),
              inline: true,
            },
            {
              name: "🧠 CPU Model",
              value: `${os.cpus()[0].model}`,
              inline: true,
            },
            {
              name: "💾 CPU Usage",
              value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
                2
              )}%`,
              inline: true,
            },
            {
              name: "⏰ Up Since",
              value: `<t:${parseInt(client.readyTimestamp / 1000)}:R>`,
              inline: true,
            },
            { name: "👩🏻‍🔧 Node.js", value: process.version, inline: true },
            { name: "🛠 Discord.js", value: version, inline: true },
            { name: "🏓 Ping", value: `${client.ws.ping}ms`, inline: true },
            {
              name: "🤹🏻‍♀️ Commands",
              value: `${client.commands.size}`,
              inline: true,
            },
            {
              name: "🌍 Servers",
              value: `${client.guilds.cache.size}`,
              inline: true,
            },
            {
              name: "👨‍👩‍👧‍👦 Users",
              value: `${client.users.cache.size}`,
              inline: true,
            },
            {
              name: "💬 Text Channels",
              value: `${getChannelTypeSize([
                ChannelType.GuildText,
                ChannelType.GuildNews,
              ])}`,
              inline: true,
            },
            {
              name: "🎤 Voice Channels",
              value: `${getChannelTypeSize([
                ChannelType.GuildVoice,
                ChannelType.GuildStageVoice,
              ])}`,
              inline: true,
            },
            {
              name: "🧵 Threads",
              value: `${getChannelTypeSize([
                ChannelType.GuildPublicThread,
                ChannelType.GuildPrivateThread,
                ChannelType.GuildNewsThread,
              ])}`,
              inline: true,
            }
          ),
      ],
      ephemeral: true,
    });
  },
};
