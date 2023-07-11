const { Client, ActivityType, version } = require("discord.js");
const mongoose = require("mongoose");
const config = require("../../config.json");

module.exports = {
  name: "ready",
  once: true,

  /**
   *
   * @param {Client} client
   */

  async execute(client) {
    const activities = [
      "Discord.js v14 Builder",
      "Discord.js v14 Builder",
      `Version: ${version}`,
    ];

    console.log(`Client is now logged in as "${client.user.username}"`);

    setInterval(() => {
      const randomIndex = Math.floor(
        Math.random() * (activities.length - 1) + 1
      );
      const newActivity = activities[randomIndex];
      client.user.setPresence({
        activities: [{ name: newActivity, type: ActivityType.Watching }],
      });
    }, 1000);

    if (!config.Bot.DBURL) return;
    await mongoose
      .connect(config.Bot.DBURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log(
          `"${client.user.username}" is now connected to the database ✓`
        );
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
