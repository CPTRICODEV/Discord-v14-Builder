// User and bot permissions
const {Client, GatewayIntentBits, Partials, Collection, MembershipScreeningFieldType, ModalBuilder, ModalSubmitFields, ModalSubmitInteraction, TextInputBuilder, TextInputStyle,ActionRowBuilder, InteractionCollector, InteractionType, EmbedBuilder, ChannelManager, ChannelFlags, PermissionOverwrites } = require('discord.js')
const {Guilds, GuildMembers, GuildMessages} = GatewayIntentBits;
const {User, Message, GuildMember, ThreadMember} = Partials;


// Handlers
const { loadEvents } = require('./Handlers/eventHandler')
const { loadCommands } = require('./Handlers/commandHandler');

// Gives the client, all the permissions
const client = new Client({ 
    intents: [Guilds, GuildMember, GuildMembers], 
    partials: [User, Message, GuildMember, ThreadMember]
});


// Makes some collections
client.commands = new Collection();
client.buttons = new Collection();

// Get the config file, so we can use it. 
client.config = require('./config.json');




// starting the bot, and starts the handlers 
client.login(client.config.Bot.Token) .then(() => {
    loadEvents(client);
    loadCommands(client);

}).catch((err) => console.log(err));