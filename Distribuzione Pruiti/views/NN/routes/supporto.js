const express = require('express');
const conn = require('../utils/connectionDB')

let route = express.Router();

route.get("/", (req, res) => {
    res.render("supporto");
})

route.get("/logged", (req, res) => {
    res.render("logged")
})

route.get("/out", (req, res) => {
    req.session.nome = null;
    res.redirect("/");
});

module.exports = route;