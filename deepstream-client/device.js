const deepstream = require( 'deepstream.io-client-js' )
const ds = deepstream( '10.1.2.89:6020' )
ds.login()

ds.event.subscribe( 'device', function( eventData ){
    console.log(eventData.balena.ip_address)
    console.log(eventData.stats.load[0] + "% @ 1min")
    console.log(eventData.stats.tstamp)
    console.log("")
})
