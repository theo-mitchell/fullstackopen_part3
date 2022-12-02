const express = require("express");
const app = express();
const morgan = require("morgan");
const Persons = require("./models/persons");

app.use(express.static("build"));
app.use(express.json());

morgan.token("body", (req) => {
  let body = "";

  if (JSON.stringify(req.body) !== "{}") {
    body = JSON.stringify(req.body);
  }

  return body;
});

const createMorganResponse = (tokens, request, response) => {
  return [
    tokens.method(request, response),
    tokens.url(request, response),
    tokens.status(request, response),
    tokens.res(request, response, "content-length"),
    "-",
    tokens["response-time"](request, response),
    "ms",
    tokens["body"](request, response),
  ].join(" ");
};

app.use(morgan(createMorganResponse));

const createId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: 5,
    name: "Elmo",
    number: "39-23-6423122",
  },
];

app.get("/info", (req, res) => {
  let message = `Phonebook has info for ${Persons.length} people </br>`;
  let currentTime = new Date();
  return res.send(message + currentTime);
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name || !body.phone) {
    return res
      .status(400)
      .json({ error: "please provide a name and phone number" });
  }

  // nameMatch = persons.find((person) => person.name === body.name);
  // if (nameMatch) {
  //   return res.status(400).json({ error: "name must be unique" });
  // }

  const person = new Persons({
    id: createId(),
    name: body.name,
    phone: body.phone,
  });

  person.save().then((result) => {
    res.json(result);
  });
  // persons = persons.concat(person);
  // return res.json(person);
});

app.get("/api/persons", (req, res) => {
  Persons.find({}).then((people) => {
    res.json(people);
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (!person) {
    return res.status(404).end();
  }

  return res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  return res.json(persons);
});

const PORT = process.env.port || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
