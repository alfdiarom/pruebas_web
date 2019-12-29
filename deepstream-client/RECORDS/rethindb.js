// Ten-minute guide with RethinkDB and JavaScript
// https://www.rethinkdb.com/docs/guide/javascript/
/*
npm install rethinkdb
node -i -e "$(< rethindb.js)"
*/

// Import the driver
r = require('rethinkdb')

var connection = null;
r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
    if (err) throw err;
    connection = conn;
})

// Create a new table
// By default, RethinkDB creates a database test. Let’s create a table authors within this database:
r.db('test').tableCreate('authors').run(connection, function(err, result) {
    if (err) throw err;
    console.log(JSON.stringify(result, null, 2));
})

// Insert data
r.table('authors').insert([
    { name: "William Adama", tv_show: "Battlestar Galactica",
      posts: [
        {title: "Decommissioning speech", content: "The Cylon War is long over..."},
        {title: "We are at war", content: "Moments ago, this ship received word..."},
        {title: "The new Earth", content: "The discoveries of the past few days..."}
      ]
    },
    { name: "Laura Roslin", tv_show: "Battlestar Galactica",
      posts: [
        {title: "The oath of office", content: "I, Laura Roslin, ..."},
        {title: "They look like us", content: "The Cylons have the ability..."}
      ]
    },
    { name: "Jean-Luc Picard", tv_show: "Star Trek TNG",
      posts: [
        {title: "Civil rights", content: "There are some words I've known since..."}
      ]
    }
]).run(connection, function(err, result) {
    if (err) throw err;
    console.log(JSON.stringify(result, null, 2));
})

// Retrieve documents
// All documents in a table
// To retrieve all documents from the table authors, we can simply run the query r.table('authors'):

r.table('authors').run(connection, function(err, cursor) {
    if (err) throw err;
    cursor.toArray(function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result, null, 2));
    });
});

// https://rethinkdb.com/api/javascript/connect/
var p = r.connect({
    host: 'localhost',
    port: 28015,
    db: 'marvel'
    })
// https://www.rethinkdb.com/api/javascript/get_all/
p.then(function(conn) {
    console.log('Connected')
    r.dbList()
}).error(function(error) {
    console.log('Error')
})


// https://github.com/rethinkdb/rethinkdb-js
// npm install rethinkdbdash
var r = require('rethinkdbdash')({
    host: 'localhost',
    port: 28015,
    db: 'deepstream'
    })
r.dbList()
r.tableList()
r.table('deepstream_records').getAll()

r.table('deepstream_records').run().then(function(result) {
    assert(Array.isArray(result)) // true
    // With the official driver you need to call
    // result.toArray().then(function(result2) {
    //   assert(Array.isArray(result2))
    // })
  })