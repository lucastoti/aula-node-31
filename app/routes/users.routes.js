module.exports = app => {

  	var router = require("express").Router();

	router.get("/lista", (req, res) => {
	  res.status(200).send('Requisicao feita com sucesso');
	});

  	app.use("/api/users", router);
};
