const deepstream = require( 'deepstream.io-client-js' )

// Servidor en PRE
const ds = deepstream( 'deepstream.alestis.online:6020' )

ds.login();
ds.event.emit( 'time', 'timeeaeee' )
