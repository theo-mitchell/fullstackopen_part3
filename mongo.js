require("dotenv-flow").config();
const { response } = require("express");
const mongoose = require("mongoose");

const login = encodeURIComponent(process.env.MONGODB_LOGIN);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
console.table({ login, password });
const url = `mongodb+srv://${login}:${password}@cluster0.wvoz7g2.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
});

const Person = mongoose.model("Person", personSchema);

mongoose.connect(url).then(
  () => {
    console.log("---CONNECTED---");
    const newPerson = { name: "another person", phone: "1234" };
    const person = new Person(newPerson);

    person.save().then(() => {
      Person.find({}).then((persons) => {
        console.log('phonebook:')
        for (let person of persons) {
            console.log(person.name,' ',person.phone);
        }
        mongoose.connection.close();
      });
    });
  },
  (err) => {
    console.log(err);
    mongoose.connection.close();
  }
);
