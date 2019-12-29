// https://deepstreamhub.com/tutorials/getting-started/node/

// Using node REPL is required ---> to obtain the output of 'console' commmands

// npm install deepstream.io-client-js
const deepstream = require( 'deepstream.io-client-js' )
const server = process.env.DS_HOST || 'adn-iot-pro.sev.alestis'
const ds = deepstream(server + ':6020')
ds.login()
console.log('Deepstream server = ', server)

// RECORDS
// Creating a new record or retrieving an existent one is done using getRecord()

/*
var deviceRecord = ds.record.getRecord( 'device/Fin1.0' )
console.log(deviceRecord.get('ping'))
console.log(deviceRecord.get('stats.uptime'))

const register = deviceRecord.get()
console.log(register.ping)
console.log(register.stats.uptime)
*/

var myRecord = ds.record.getRecord( 'test/johndoe' )
//and retrieved using .get()
myRecord.get() // returns the entire data

myRecord.whenReady(record => {
    let state = record.get()
    console.log('state= ' , state)
    myRecord.state = state
  })

  // This line only works in REPL
  // console.log('myRecord.state= ' , myRecord.state)

  const myRecordState = async () => {
      let state = await myRecord.state
    return state
  }
// Promise { <pending> } !!!
let state = myRecordState()
console.log('myRecordState = ', state)

// subscribe to changes made by you or other clients using .subscribe()
myRecord.subscribe( data => {console.log('subscribe = ', data)}) // get notified when any data changes
myRecord.subscribe( 'firstname', firstname => {console.log(firstname)}) // get notified when first name changes

// EVENTS

// RPCs