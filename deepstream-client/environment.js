const deepstream = require( 'deepstream.io-client-js' );
const ds = deepstream( '10.1.2.89:6020' );
ds.login();

ds.event.subscribe( 'environment2', function( eventData ){
    console.log(eventData);
});
