const deepstream = require( 'deepstream.io-client-js' )

const ds = deepstream( 'deepstream.alestis.online:6020' )

ds.login()
ds.event.subscribe( 'time', eventCallback )

function eventCallback(data) {
    console.log(data)
}