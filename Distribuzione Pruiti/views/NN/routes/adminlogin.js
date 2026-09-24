const express = require('express');
const conn = require('../utils/connectionDB');

let route = express.Router();

route.get("/", (req, res) => {
    if (req.session.admin) res.redirect("/admin/dashboard");
    else res.render("adminlogin");
});

route.post("/", (req, res) => {
    let sql = "SELECT * FROM admin WHERE username = ?";
    
    conn.query(sql, [req.body.username], async function (err, result) {
        if (err) return console.log(err);

        if (result.length === 0) {
            return res.redirect("/error");
        }

        const admin = result[0];

        req.session.admin = {
            id: admin.ID,
            username: admin.username
        };

        res.redirect("/admin/dashboard");
    });
});

route.get("/dashboard", (req, res) => {
    if (!req.session.admin) return res.redirect("/adminlogin");
    res.render("admin_dashboard");
});

route.get("/out", (req, res) => {
    req.session.admin = null;
    res.redirect("/");
});

module.exports = route;