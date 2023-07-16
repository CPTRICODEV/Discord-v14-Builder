// User and bot permissions
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  MembershipScreeningFieldType,
  ModalBuilder,
  ModalSubmitFields,
  ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  InteractionCollector,
  InteractionType,
  EmbedBuilder,
  ChannelManager,
  ChannelFlags,
  PermissionOverwrites,
  Events,
} = require("discord.js");
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

// Handlers
const { loadEvents } = require("./Handlers/eventHandler");
const { loadCommands } = require("./Handlers/commandHandler");

// Gives the client, all the permissions
const client = new Client({
  intents: [Guilds, GuildMember, GuildMembers],
  partials: [User, Message, GuildMember, ThreadMember],
});

// Makes some collections
client.commands = new Collection();

// Get the config file, so we can use it.
client.config = require("./config.json");

// starting the bot, and starts the handlers
client
  .login(client.config.Bot.Token)
  .then(() => {
    loadEvents(client);
    loadCommands(client);
  })
  .catch((err) => console.log(err));

// Apply Functionality

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;

  if (interaction.customId === "apply") {
    const name = interaction.fields.getTextInputValue("name");
    const age = interaction.fields.getTextInputValue("alder");
    const description = interaction.fields.getTextInputValue("description");

    const id = interaction.user.id;
    const member = interaction.member;
    const server = interaction.guild.id || "No Sever provided";

    const channel = await client.channels.cache.get("1129498750990172230");

    const embed = new EmbedBuilder()
      .setTitle(`Application from ${interaction.user.username}`)

      .addFields({ name: "Name: ", value: `${name}` })
      .addFields({ name: "Age: ", value: `${age}` })
      .addFields({ name: "Description: ", value: `${description}` })
      .addFields({ name: "User ID", value: `${id}` })
      .addFields({ name: "Member", value: `${member}` })
      .addFields({ name: "Server ID", value: `${server}` })
      .setThumbnail(`${interaction.user.avatarURL()}`)
      .setTimestamp();

    await channel.send({ embeds: [embed] }).catch((err) => {});
    await interaction.reply({
      content: `Your application has been submitted`,
      ephemeral: true,
    });
  }
});

// Bug Report

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;

  if (interaction.customId === "command-bug") {
    const description = interaction.fields.getTextInputValue("command-bug");
    const status = interaction.fields.getTextInputValue("status-bug");
    const member = interaction.member;

    const channel = await client.channels.cache.get("1129518953476133005");

    const formattedDescription = `\`${description}\``;
    const formattedStatus = `\`${status}\``;

    await channel
      .send({
        content: `**${formattedDescription}\n**Status: ${formattedStatus}\n**Submitted By: ${member}**`,
      })
      .catch((err) => {});
  }
});
