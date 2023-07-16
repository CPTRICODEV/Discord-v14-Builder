const {
  SlashCommandBuilder,
  CommandInteraction,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  developer: false, // if you have setup a developer guild and you want to check the command out in your developer guild then set this to true!.
  data: new SlashCommandBuilder()
    .setName("askme")
    .setDescription("The bot will answher in a funny way")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // this will set the permissions of the command, remove it if you want everyone to use it, leave it if you want only administrators to use the command.
    .addStringOption((options) =>
      options
        .setName("question")
        .setDescription("What is you question")
        .setRequired(true)
    ),

  /**
   *
   * @param { CommandInteraction } interaction,
   * @param { Client } client
   */

  async execute(interaction, client) {
    const question = interaction.options.getString("question");

    const funnyAnswers = [
      "Yes, absolutely! You will have the best day ever.",
      "No, never in a million years! If you do, the entire universe will implode.",
      "Maybe, who knows? Take a chance and see what happens!",
      "Ask me again in 100 years. Maybe I'll have a better answer for you.",
      "Absolutely! Just remember to bring snacks and a good mood.",
      "Nope! It's better to avoid it like the plague.",
      "To the moon and back! You will be a true star!",
      "Doubtful, very doubtful. But let's see what happens!",
      "If you believe it, maybe. But don't set your expectations too high.",
      "I wish I could answer, but I'm just a bot. So let's say 42!",
      "That sounds like a bad idea, avoid it at all costs. You'll thank me later.",
      "It's the most amazing thing I've ever heard! I will write a song about it.",
      "What would Elon Musk do? He would probably send a rocket to Mars to find the answer.",
      "Ask your mom about it. She always has good advice and wisdom to share.",
      "That's a big decision! You should consider the pros and cons and listen to your heart.",
      "Oh, definitely! It's the best idea I've ever heard. The world is ready for it!",
      "Hmm, let me think... Yes! You will have the most amazing experience ever.",
      "No, that would be like pouring cold milk first and then adding cereal. Just not right.",
      "Oh, it's so tempting, but I would advise you to think it through. Or have a cookie and forget about it.",
      "Definitely! You will be the ultimate master of what you're planning to do.",
      "Unfortunately not. But hey, there are plenty of other amazing things to do in life!",
      "It's a tricky situation. You should take a step back and carefully assess all the options.",
    ];

    const randomAnswer =
      funnyAnswers[Math.floor(Math.random() * funnyAnswers.length)];
    interaction.reply(`Spørgsmål: ${question}\nSvar: ${randomAnswer}`);
  },
};
