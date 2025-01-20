import express from "express";
import cors from "cors";

const app = express();
const port = 8000;
const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};
const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};
const findUserByJob = (job, list) => {
  return users["users_list"].filter((list) => list["job"] === job);
};
const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);
const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

app.use(cors());
app.use(express.json());

app.get("/users", (req, res) => {
  const name = req.query.name;
  if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found");
  } else {
    res.send(result);
  }
});

app.get("/users/:name/:job", (req, res) => {
  const name = req.params["name"];
  const job = req.params["job"];
  if (name != undefined && job != undefined) {
    let filterByName = findUserByName(name);
    let result = findUserByJob(job, filterByName);
    result = { user_list: result };
    res.send(result);
  } else {
    res.status(404).send("Name and/or job not found");
  }
});

app.post("/users", (req, res) => {
  let userToAdd = req.body;
  generateID();

  function generateLetters() {
    const letterOptions = "abcdefghijklmnopqrstuvwxyz";
    let letters = "";
    for (let i = 0; i < 3; i++) {
      letters += letterOptions.charAt(
        Math.floor(Math.random() * letterOptions.length)
      );
    }
    return letters;
  }
  function generateDigits() {
    let digits = "";
    for (let i = 0; i < 3; i++) {
      digits += Math.round(Math.random() * 9).toString(10);
    }
    return digits;
  }
  // ID format: 3 letters followed by 3 digits
  function generateID() {
    let letters = generateLetters();
    let digits = generateDigits();

    let generatedID = letters.concat(digits);
    let takenID = findUserById(generatedID);
    if (takenID === undefined) {
      // Update the original info to include the ID
      userToAdd = { ["id"]: generatedID, ...userToAdd };
      let result = addUser(userToAdd);
      result = { user_list: result };
      res.status(201).send(result);
    } else {
      generateID();
    }
  }
});

app.delete("/users/:id", (req, res) => {
  //  const id = req.body["id"];
  const id = req.params["id"];
  let result = findUserById(id);
  if (result != undefined) {
    const index = users["users_list"].indexOf(result);
    users["users_list"].splice(index, 1); // Format of splice: (starting index of deletion, how many items to delete)
    res.status(204).send();
  } else {
    res.status(404).send("Resource not found");
  }
});

app.listen(port, () => {
  console.log("Example app listening at http://localhost:${port}");
});
