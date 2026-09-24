const express = require('express');
const conn = require('../utils/connectionDB')

let route = express.Router();

route.get("/", (req, res) => {
    res.render("register");
});

route.post("/", (req, res) => {

    let sql = "SELECT * FROM utenti where Username = ? and Password = ?";
    conn.query(sql, [req.body.username, req.body.password], function (e, r) {
        if (e) console.log(err);
        if (r.length != 0) {res.redirect("/error")}
        else {
            sql = "insert into utenti(Username, Password) values(?, ?)";
            conn.query(sql, [req.body.username, req.body.password], function (err, result) {
            if (err) console.log(err);
            res.redirect("/register/registered");
            })
        }
    }) 

});

route.get("/registered", (req, res) => {
    res.render("registered")
});

module.exports = route;