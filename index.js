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

app.get("/info", (req, res, next) => {
  const query = Persons.find();
  query
    .count()
    .then((count) => {
      let message = `Phonebook has info for ${count} people </br>`;
      let currentTime = new Date();
      return res.send(message + currentTime);
    })
    .catch((error) => {
      next(error);
    });
});

app.post("/api/persons", (req, res, next) => {
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
    name: body.name,
    phone: body.phone,
  });

  person
    .save()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;
  if (!body.name || !body.phone) {
    return res
      .status(400)
      .json({ error: "please provide a name and phone number" });
  }

  const person = {
    name: body.name,
    phone: body.phone,
  };

  Persons.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((err) => next(err));
});

app.get("/api/persons", (req, res) => {
  Persons.find({}).then((people) => {
    res.json(people);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  Persons.findById(id)
    .then((person) => {
      res.json(person);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Persons.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response
      .status(400)
      .send({ error: "Could not delete person, person not found" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

// eslint-disable-next-line no-undef
const PORT = process.env.port || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
