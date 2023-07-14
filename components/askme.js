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
      "Ja, helt sikkert! Du vil få den bedste dag nogensinde.",
      "Nej, aldrig i livet! Hvis du gør det, vil hele universet implodere.",
      "Måske, hvem ved? Tag en chance og se hvad der sker!",
      "Spørg mig igen om 100 år. Måske vil jeg have et bedre svar til dig.",
      "Absolut! Du skal bare huske at medbringe snacks og godt humør.",
      "Nope! Det er bedre at undgå det som pesten.",
      "Til månen og tilbage! Du vil være en ægte stjerne!",
      "Tvivlsomt, meget tvivlsomt. Men lad os se hvad der sker!",
      "Hvis du tror på det, så måske. Men lad være med at sætte for høje forventninger.",
      "Jeg ville ønske, jeg kunne svare, men jeg er bare en bot. Så lad os sige 42!",
      "Det lyder som en dårlig idé, undgå det for enhver pris. Du vil takke mig senere.",
      "Det er det mest fantastiske, jeg nogensinde har hørt! Jeg vil skrive en sang om det.",
      "Hvad ville Elon Musk gøre? Han ville sikkert sende en raket til Mars for at finde svaret.",
      "Spørg din mor om det. Hun har altid gode råd og visdom at dele.",
      "Det er en stor beslutning! Du bør overveje fordele og ulemper, og lytte til dit hjerte.",
      "Oh, helt klart! Det er den bedste idé, jeg nogensinde har hørt. Verden er klar til det!",
      "Hmm, lad mig tænke... Ja! Du vil have den mest fantastiske oplevelse nogensinde.",
      "Nej, det ville være som at hælde kold mælk først og derefter tilføje cereal. Bare ikke rigtigt.",
      "Åh, det er så fristende, men jeg vil råde dig til at tænke grundigt over det. Eller spis en cookie og glem det.",
      "Definitivt! Du vil være den ultimative mester af det, du planlægger at gøre.",
      "Desværre ikke. Men hey, der er masser af andre fantastiske ting at gøre i livet!",
      "Det er en tricky situation. Du bør tage et skridt tilbage og vurdere alle mulighederne omhyggeligt.",
    ];

    const randomAnswer =
      funnyAnswers[Math.floor(Math.random() * funnyAnswers.length)];
    interaction.reply(`Spørgsmål: ${question}\nSvar: ${randomAnswer}`);
  },
};
