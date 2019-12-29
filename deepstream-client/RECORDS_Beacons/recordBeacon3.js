const deepstream = require( 'deepstream.io-client-js' );
const ds = deepstream('10.1.2.89:6020');
ds.login();


////////////////////// Beacons
var beacon1 = ds.record.getRecord( 'beacon3' )
//var beacon1 = ds.record.getRecord( process.argv[0].toString() )

beacon1.get()
beacon1.get('distance_m')

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
  console.log('new nearest gateway for Beacon3 is ',location)
  }