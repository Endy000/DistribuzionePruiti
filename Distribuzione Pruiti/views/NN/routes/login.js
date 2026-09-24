const express = require('express');
const conn = require('../utils/connectionDB')

let route = express.Router();

route.get("/", (req, res) => {
    if(req.session.nome) res.redirect("/")
    else res.render("login");
})

route.post("/", (req, res) => {
    console.log("connessione con il database per il login");
    let sql = "SELECT * FROM utenti where Username = ? and Password = ?"
    conn.query(sql, [req.body.username, req.body.password], function (err, result) {
        if (err) console.log(err);
        if (result.length == 0) res.redirect("/error");
        else {
            req.session.nome = req.body.username;
            res.redirect("/login/logged");
        }
    });
});

route.get("/logged", (req, res) => {
    res.render("logged")
})

route.get("/out", (req, res) => {
    req.session.nome = null;
    res.redirect("/");
});

module.exports = route;