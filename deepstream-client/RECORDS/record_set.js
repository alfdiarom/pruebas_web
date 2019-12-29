// https://deepstreamhub.com/tutorials/getting-started/node/

// Using node REPL
// npm install deepstream.io-client-js

    const deepstream = require( 'deepstream.io-client-js' )
const server = process.env.DS_HOST || '10.1.2.89'
const ds = deepstream(server + ':6020')
ds.login()
console.log('Deepstream server = ', server)

// RECORDS
// Creating a new record or retrieving an existent one is done using getRecord()
var myRecord = ds.record.getRecord( 'test/johndoe' )

// you can set the entire data
myRecord.set({
    firstname: 'John',
    lastname: 'Doe'
})

// or just a path
myRecord.set( 'hobbies', [ 'sailing', 'reading' ] )