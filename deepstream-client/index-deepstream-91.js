const deepstream = require( 'deepstream.io-client-js' );

// Servidor en PRE

// const ds = deepstream( '10.1.2.89:6020' );
/*
const ds = deepstream( '10.10.2.90:6020' );
ds.login();
ds.event.subscribe( 'PolarisEddystone2_OOCC', function( eventData ){
    console.log(eventData);
});
*/

// Servidor en OOCC
const ds_dev = deepstream( '10.10.2.91:6020' );
ds_dev.login();
ds_dev.event.subscribe( 'PolarisEddystone2', function( eventData ){
    console.log(eventData);
});
