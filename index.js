const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuidv1 = require('uuid/v1');

const fs = require("fs");

// Aplicatia
const app = express();

// Middleware
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cors());


// Link SPA static files 
app.use("/", express.static('spa'));


// Create
app.post("/dishes", (req, res) => {
  const dishesList = readJSONFile();
  const NewDish = req.body;
  NewDish.id = uuidv1();
  const NewDishList = [...dishesList, NewDish];
  writeJSONFile(NewDishList);
  res.json(NewDish);
});

// Read One
app.get("/dishes/:id", (req, res) => {
  const dishesList = readJSONFile();
  const id = req.params.id;
  let idFound = false;
  let foundArticle;

  dishesList.forEach(dish => {
    if (id === dish.id) {
      idFound = true;
      foundArticle = dish
    }
  });

  if (idFound) {
    res.json(foundArticle);
  } else {
    res.status(404).send(`Dish ${id} was not found`);
  }
});

// Read All
app.get("/dishes", (req, res) => {
  const dishesList = readJSONFile();
  res.json(dishesList);
});

// Update
app.put("/dishes/:id", (req, res) => {
  const dishesList = readJSONFile();
  const id = req.params.id;
  const NewDish = req.body;
  NewDish.id = id;
  idFound = false;

  const NewDishesList = dishesList.map((dish) => {
     if (dish.id === id) {
       idFound = true;
       return NewDish
     }
    return dish
  })
  
  writeJSONFile(NewDishesList);

  if (idFound) {
    res.json(NewDish);
  } else {
    res.status(404).send(`Dish ${id} was not found`);
  }

});

// Delete
app.delete("/dishes/:id", (req, res) => {
  const dishesList = readJSONFile();
  const id = req.params.id;
  const NewDishesList = dishesList.filter((dish) => dish.id !== id)

  if (dishesList.length !== NewDishesList.length) {
    res.status(200).send(`Dish ${id} was removed`);
    writeJSONFile(NewDishesList);
  } else {
    res.status(404).send(`Dish ${id} was not found`);
  }
});

// Functia de citire din fisierul db.json
function readJSONFile() {
  return JSON.parse(fs.readFileSync("db.json"))["dishes"];
}

// Functia de scriere in fisierul db.json
function writeJSONFile(content) {
  fs.writeFileSync(
    "db.json",
    JSON.stringify({ dishes: content }),
    "utf8",
    err => {
      if (err) {
        console.log(err);
      }
    }
  );
}

// Pornim server-ul
app.listen("3000", () =>
  console.log("Server started at: http://localhost:3000")
);