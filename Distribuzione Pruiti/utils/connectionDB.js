const mysql = require ("mysql")

const conn = mysql.createConnection({
    host:"localhost",
    user:"root",
    port: 3306,
    database:"Distribuzione_P"
})

module.exports = conn;