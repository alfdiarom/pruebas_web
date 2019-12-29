const deepstream = require( 'deepstream.io-client-js' );
const ds = deepstream('10.1.2.89:6020');
ds.login();


////////////////////// Beacons
//var beacon1 = ds.record.getRecord( 'beacon1' )
var beacon1 = ds.record.getRecord( process.argv[2])
// Note that the first arg is usually the path to nodejs, and the second arg is the location of the script you're executing.
// Then, the third (index 2) item is the record to subscribe to
// https://stackoverflow.com/questions/4351521/how-do-i-pass-command-line-arguments-to-a-node-js-program
console.log(process.argv[2])

// Subscribe to any change of the record
beacon1.subscribe(beaconDataChanged)
function beaconDataChanged(data) {
    console.log('new beacon state is ',data)
  }

// Subscribe to changes in distance estimation
beacon1.subscribe( 'distance_m', distanceChanged, true)
function distanceChanged( distance_m ) {
    if (distance_m !== 0) {
      console.log('new distance value is ',distance_m)
    }
  }

  // Subscribe to changes in nearest gateway
beacon1.subscribe( 'location', locationChanged1, true)
function locationChanged1( location ) {
  console.log('new nearest gateway for Beacon1 is ',location)
  }