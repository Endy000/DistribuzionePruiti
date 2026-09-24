const express = require("express");
const bp = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const session = require("express-session");
const conn = require("./utils/connectionDB");

const app = express();

// middleware
app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());+
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session({
    secret: "chiave",
    resave: false,
    saveUninitialized: true
}));


// =========================
// HOME + FILTRI DINAMICI
// =========================
app.get("/", (req, res) => {

    const copertoniQuery = "SELECT * FROM copertoni";

    const filtriQuery = {
        tipologia: "SELECT DISTINCT Tipo FROM copertoni",
        stile: "SELECT DISTINCT Stile FROM copertoni",
        marca: "SELECT DISTINCT Marca FROM copertoni",
        disegno: "SELECT DISTINCT Disegno FROM copertoni"
    };

    conn.query(copertoniQuery, (err, copertoni) => {

        if (err) {
            console.log(err);
            return res.status(500).send("Errore server");
        }

        conn.query(filtriQuery.tipologia, (err, tipologia) => {
        conn.query(filtriQuery.stile, (err, stile) => {
        conn.query(filtriQuery.marca, (err, marca) => {
        conn.query(filtriQuery.disegno, (err, disegno) => {

            if (err) {
                console.log(err);
                return res.status(500).send("Errore server");
            }

            res.render("index", {
                copertoni,
                utente: req.session.nome,
                filtri: {
                    tipologia,
                    stile,
                    marca,
                    disegno
                }
            });

        });
        });
        });
        });

    });
});


// // routes
// app.use("/login", require("./routes/login"));
// app.use("/adminlogin", require("./routes/adminlogin"));
// app.use("/register", require("./routes/register"));
// app.use("/supporto", require("./routes/supporto"));


// pagine statiche
app.get("/chi", (req, res) => res.render("chi"));
app.get("/error", (req, res) => res.render("error"));
app.get("/IL", (req, res) => res.render("infol"));


// =========================
// SEARCH AUTOCOMPLETE
// =========================
app.get("/search", (req, res) => {

    const query = req.query.query || "";
    const like = `%${query}%`;

    const sql = `
        SELECT * FROM copertoni 
        WHERE Tipo LIKE ? 
        OR Marca LIKE ?
        OR Nome LIKE ?
        LIMIT 5
    `;

    conn.query(sql, [like, like, like], (err, resp) => {
        if (err) {
            console.log(err);
            return res.status(500).json([]);
        }
        res.json(resp);
    });
});


// =========================
// API COPERTONI (FILTRI LIVE)
// =========================
app.get("/api/copertoni", (req, res) => {

    let sql = "SELECT * FROM copertoni WHERE 1=1";
    const params = [];

    let {
        search,
        tipologia,
        stile,
        marca,
        disegno
    } = req.query;

    const toArray = (v) => {
        if (!v) return null;
        return Array.isArray(v) ? v : [v];
    };

    tipologia = toArray(tipologia);
    stile = toArray(stile);
    marca = toArray(marca);
    disegno = toArray(disegno);

    if (search && search.trim() !== "") {
        sql += " AND (Tipo LIKE ? OR Marca LIKE ? OR Nome LIKE ?)";
        const like = `%${search}%`;
        params.push(like, like, like);
    }

    if (tipologia) {
        sql += " AND Tipo IN (?)";
        params.push(tipologia);
    }

    if (stile) {
        sql += " AND Stile IN (?)";
        params.push(stile);
    }

    if (marca) {
        sql += " AND Marca IN (?)";
        params.push(marca);
    }

    if (disegno) {
        sql += " AND Disegno IN (?)";
        params.push(disegno);
    }

    conn.query(sql, params, (err, resp) => {
        if (err) {
            console.log(err);
            return res.status(500).json([]);
        }

        res.json(resp);
    });
});


// =========================
// SERVER START
// =========================
const PORT = process.env.PORT || 4600;

app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
});