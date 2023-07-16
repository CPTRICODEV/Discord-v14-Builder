const { Schema, Model, model } = require("mongoose");

let Bugs = new Schema({
  GuildID: String,
  MessageID: String,
  Details: Array,
});

module.exports = model("Bugs", Bugs);
