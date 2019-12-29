// https://deepstreamhub.com/tutorials/getting-started/node/

// Using node REPL
// npm install deepstream.io-client-js
const deepstream = require( 'deepstream.io-client-js' );
const ds = deepstream('10.1.2.89:6020');
ds.login();

// RECORDS
// Creating a new record or retrieving an existent one is done using getRecord()
var myRecord = ds.record.getRecord( 'test/johndoe' );
//console.log(myRecord)

//and retrieved using .get()
myRecord.get(); // returns the entire data
console.log(myRecord.get())

//myRecord.get( 'temperature' );// returns value of field 'temperature'
//console.log(myRecord.get( 'temperature' ))

// subscribe to changes made by you or other clients using .subscribe()
//myRecord.subscribe( data => {}); // get notified when any data changes
//myRecord.subscribe( 'timestamp', timestamp => {});// get notified when first name changes

// EVENTS

// RPCs