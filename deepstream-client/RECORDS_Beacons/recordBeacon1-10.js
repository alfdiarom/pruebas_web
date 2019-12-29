const deepstream = require( 'deepstream.io-client-js' );
const ds = deepstream('10.1.2.89:6020');
ds.login();


////////////////////// Beacons
var beacon1 = ds.record.getRecord( 'beacon1' )
var beacon2 = ds.record.getRecord( 'beacon2' )
var beacon3 = ds.record.getRecord( 'beacon3' )
var beacon4 = ds.record.getRecord( 'beacon4' )
var beacon5 = ds.record.getRecord( 'beacon5' )
var beacon6 = ds.record.getRecord( 'beacon6' )
var beacon7 = ds.record.getRecord( 'beacon7' )
var beacon8 = ds.record.getRecord( 'beacon8' )
var beacon9 = ds.record.getRecord( 'beacon9' )
var beacon10 = ds.record.getRecord( 'beacon10' )

beacon1.get()
beacon1.get('distance_m')

// Subscribe to any change of the record
/*
beacon1.subscribe(beaconDataChanged)
function beaconDataChanged(data) {
    console.log('new beacon state is ',data)
  }
*/

// Subscribe to changes in distance estimation
/*
beacon1.subscribe( 'distance_m', distanceChanged, true)
function distanceChanged( distance_m ) {
    if (distance_m !== 0) {
      console.log('new distance value is ',distance_m)
    }
  }
*/
  // Subscribe to changes in nearest gateway
beacon1.subscribe( 'location', locationChanged1, true)
function locationChanged1( location ) {
  console.log('new nearest gateway for Beacon1 is ',location)
  }
beacon2.subscribe( 'location', locationChanged2, true)
function locationChanged2( location ) {
  console.log('new nearest gateway for Beacon2 is ',location)
  }
beacon3.subscribe( 'location', locationChanged3, true)
function locationChanged3( location ) {
  console.log('new nearest gateway for Beacon3 is ',location)
  }
beacon4.subscribe( 'location', locationChanged4, true)
function locationChanged4( location ) {
  console.log('new nearest gateway for Beacon4 is ',location)
  }
beacon5.subscribe( 'location', locationChanged5, true)
function locationChanged5( location ) {
  console.log('new nearest gateway for Beacon5 is ',location)
  }
beacon6.subscribe( 'location', locationChanged6, true)
function locationChanged6( location ) {
  console.log('new nearest gateway for Beacon6 is ',location)
  }
beacon7.subscribe( 'location', locationChanged7, true)
function locationChanged7( location ) {
  console.log('new nearest gateway for Beacon7 is ',location)
  }
beacon8.subscribe( 'location', locationChanged8, true)
function locationChanged8( location ) {
  console.log('new nearest gateway for Beacon8 is ',location)
  }
beacon9.subscribe( 'location', locationChanged9, true)
function locationChanged9( location ) {
  console.log('new nearest gateway for Beacon9 is ',location)
  }
beacon10.subscribe( 'location', locationChanged10, true)
function locationChanged10( location ) {
  console.log('new nearest gateway for Beacon10 is ',location)
  }