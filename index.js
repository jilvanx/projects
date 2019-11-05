const express = require('express');

const server = express();

server.use(express.json());
server.use(countRequest);
server.listen(3000);

const projects = [];

function checkProjectExists (req, res, next) {
  const { id } = req.params

  const existProject = projects.find(project => project.id === id);
  
  if (!existProject) {
    return res.status(400).json({ error: 'Project not exists!'})
  }

  return next();
}

/**
 * Middleware que dá log no número de requisições
 */
function countRequest(req, res, next) {

  console.count("Request number");

  return next();
}

/**
 * Return all projects
 */
server.get('/projects', (req, res) => {
  return res.json(projects);
});

/**
 * Request body: id, title
 * create new project
 */
server.post('/projects', countRequest, (req, res) => {

  const { id, title } = req.body;

  const newProject = {
    id,
    title,
    tasks: [],
  }

  projects.push(newProject);

  return res.json(newProject);
});

/**
 * Route params: id
 * Request body: title
 * Update the project with params id
 */
server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id === id);

  project.title = title;

  return res.json(project);
});

/**
 * Route params: id
 * Delete the project by params id
 */
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectDel = projects.findIndex(project => project.id === id);

  projects.splice(projectDel, 1);

  return res.send();
});

/**
 * Request body: id
 * Create a new task in the project by id
 */
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const { title } = req.body;

  const project = projects.find(project => project.id === id);

  project.tasks.push(title);

  return res.json(project);
});