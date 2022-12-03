/* eslint-disable no-undef */
require("dotenv-flow").config();
const mongoose = require("mongoose");

const login = encodeURIComponent(process.env.MONGODB_LOGIN);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
console.table({ login, password });
const url = `mongodb+srv://${login}:${password}@cluster0.wvoz7g2.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose
  .connect(url)
  .then(() => {
    console.log("---CONNECTED---");
  })
  .catch((error) => {
    console.error(error);
  });

const phoneValidation = (v) => {
  return /\d{2,3}-\d{1,}/.test(v);
};

const personSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: true },
  phone: {
    type: String,
    minLength: 8,
    validate: {
      validator: phoneValidation,
    },
    required: [true, "User phone number required"],
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();

    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
