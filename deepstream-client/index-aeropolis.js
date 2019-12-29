const deepstream = require( 'deepstream.io-client-js' );

// Servidor en PRE

const ds = deepstream( '10.1.2.89:6020' );
ds.login();
ds.event.subscribe( 'aeropolis', function( eventData ){
    console.log(eventData)
    console.log('')
});