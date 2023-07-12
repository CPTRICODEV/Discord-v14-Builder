const mongoose = require("mongoose");
const Schema = mongoose.Schema({
  GuildID: {
    type: String,
  },
  UserID: {
    type: String,
  },
  UserTag: {
    type: String,
  },
  Content: {
    type: Array,
  },
});
const model = mongoose.model("WarningDB", Schema);
module.exports = model;
