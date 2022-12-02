require("dotenv-flow").config();
const mongoose = require("mongoose");

const login = encodeURIComponent(process.env.MONGODB_LOGIN);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
console.table({ login, password });
const url = `mongodb+srv://${login}:${password}@cluster0.wvoz7g2.mongodb.net/phonebookApp?retryWrites=true&w=majority`;


mongoose
  .connect(url)
  .then((result) => {
    console.log("---CONNECTED---");
  })
  .catch((error) => {
    console.error();
  });

const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
});

module.exports = mongoose.model("Person", personSchema);
