// const { model } = require("mongoose");
const mysql = require("mysql");

var connection = mysql.createPool({
  host        : 'localhost',
  user        : 'root',
  password    : 'aaaaaaaa',
  database    : 'vacCenter' 
});

// var connection = mysql.createConnection({
//     host        : 'localhost',
//     user        : 'root',
//     password    : 'aaaaaaaa',
//     database    : 'vacCenter' 
// });


// connection.connect((err) => {
//     if (err) {
//       console.error('Error connecting to MySQL database:', err);
//       return;
//     }
//     console.log('Connected to MySQL database!');
//   });

module.exports = connection;