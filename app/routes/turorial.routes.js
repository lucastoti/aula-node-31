module.exports = app => {
  const tutorials = require("../controllers/tutorial.controller.js");

  var router = require("express").Router();
  const { query, body, validationResult } = require('express-validator');
  
  router.use(function (req, res, next) {
    if (req.headers.type === 'admin') {
      next();
    } else {
      res.status(500).send({ messagem: 'Usuário não autorizado' });
    }
  });

  // Create a new Tutorial
  router.post("/", 
    body('description').notEmpty().withMessage('Campo descrição é obrigatório'),
    body('title').isLength({ min: 3 }).withMessage('Titulo deve ser maior que 3'),
    body('published').notEmpty().withMessage('Publicado está vazio'),
    (req, res) => {
      const result = validationResult(req);
      result.errors.length ? returnError(result.errors, res) : tutorials.create(req, res);
    });

  // Retrieve all Tutorials
  router.get("/lista-inteira", tutorials.findAll);

  // Retrieve all published Tutorials
  router.get("/published", tutorials.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/id", query('id').notEmpty().withMessage('ID é obrigatório'),
    (req, res) => {
      const result = validationResult(req);
      result.errors.length ? returnError(result.errors, res) : tutorials.findOne(req, res);
    });

  // Update a Tutorial with id
  router.put("/:id", tutorials.update);

  // Delete a Tutorial with id
  router.delete("/:id", tutorials.delete);

  // Delete all Tutorials
  router.delete("/", tutorials.deleteAll);

  function returnError (errors, res) {
    var listaMsgErrors = [];
    errors.forEach(error => {
      listaMsgErrors.push(error.msg);
    });
    res.status(400).send({messagem: listaMsgErrors.join(', ')});
  };

  app.use("/api/tutorials", router);
};
