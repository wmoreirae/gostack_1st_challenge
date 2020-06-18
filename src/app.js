const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const new_repo = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0,
  }

  repositories.push(new_repo);
  return response.json(new_repo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs} = request.body;

  if (!isUuid(id)){
    return response.status(400).json({message: "Requested ID is not a valid ID"});
  }

  const repo = repositories.find(e => {return id == e.id});
  if (repo === undefined){
    return response.status(404).json({message: "No repository with the requested ID was found"});
  }

  repo.title = title;
  repo.url = url;
  repo.techs = techs;

  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)){
    return response.status(400).json({message: "Requested ID is not a valid ID"});
  }

  const repo = repositories.find(e => {return id == e.id});
  if (repo === undefined){
    return response.status(404).json({message: "No repository with the requested ID was found"});
  }

  const index = repositories.indexOf(repo)
  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)){
    return response.status(400).json({message: "Requested ID is not a valid ID"});
  }

  const repo = repositories.find(e => {return id == e.id});
  if (repo === undefined){
    return response.status(404).json({message: "No repository with the requested ID was found"});
  }

  repo.likes += 1

  return response.json(repo);
});

module.exports = app;
