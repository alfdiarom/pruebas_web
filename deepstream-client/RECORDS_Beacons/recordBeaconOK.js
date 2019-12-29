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

// beacon1.get()

// Subscribe to changes in distance estimation
/*
var uid1 = beacon1.get().distance_m; // Also valid: beacon1.get('distance_m')
console.log(uid1)
beacon1.subscribe( 'distance_m', distanceChanged.bind({'uid':uid1}), true)
function distanceChanged( distance_m ) {
    if (distance_m !== 0) {
      console.log('new distance for Beacon', this.uid ,' is ',distance_m)
    }
  }
*/

// Subscribe to any change of the record
var change1 = 'NO'; // Detects if a nearest gateway has changed
var change2 = 'NO'
var change3 = 'NO'
var change4 = 'NO'
var change5 = 'NO'
var change6 = 'NO'

function locationChanged1( location ) {
  console.log('change1=',change1,' >>> new nearest gateway for Beacon1 is ',location)
  change1 = 'YES'  }
function locationChanged2( location ) {
  console.log('change2=',change2,' >>> new nearest gateway for Beacon2 is ',location)
  change2 = 'YES'  }
function locationChanged3( location ) {
  console.log('change3=',change3,' >>> new nearest gateway for Beacon3 is ',location)
  change3 = 'YES'  }
function locationChanged4( location ) {
  console.log(change4,' >>> new nearest gateway for Beacon4 is ',location)
  change4 = 'YES'  }

function locationChanged5( location ) {
  console.log(change5,' >>> new nearest gateway for Beacon5 is ',location)
  change5 = 'YES'  }

function locationChanged6( location ) {
  console.log(change6,' >>> new nearest gateway for Beacon6 is ',location)
  change6 = 'YES'   }

beacon1.subscribe( 'location', locationChanged1, true)
beacon2.subscribe( 'location', locationChanged2, true)
beacon3.subscribe( 'location', locationChanged3, true)
//beacon4.subscribe( 'location', locationChanged4, true)
//beacon5.subscribe( 'location', locationChanged5, true)
//beacon6.subscribe( 'location', locationChanged6, true)

beacon1.subscribe(beaconDataChanged)
beacon2.subscribe(beaconDataChanged)
beacon3.subscribe(beaconDataChanged)
//beacon4.subscribe(beaconDataChanged)
//beacon5.subscribe(beaconDataChanged)
//beacon6.subscribe(beaconDataChanged)

function beaconDataChanged(data) {
  if (change1 == 'YES' ) {
    console.log('change1=',change1,'----------------------- new NEAREST GATEWAY for Beacon', data.uid ,' is ', data.location)
    change1 = 'NO'
  }
  if (change2 == 'YES') {
    console.log('change2=',change2,'----------------------- new NEAREST GATEWAY for Beacon', data.uid ,' is ', data.location)
    change2 = 'NO'
  }
  if (change3 == 'YES') {
    console.log('change3=',change3,'----------------------- new NEAREST GATEWAY for Beacon', data.uid ,' is ', data.location)
    change3 = 'NO'
  }

  /*if (change4 == 'YES' ) {console.log('----------------------- new NEAREST GATEWAY for Beacon', data.uid ,' is ', data.location)}
  else {change4 = 'NO'}

  if (change5 == 'YES' ) {console.log('----------------------- new NEAREST GATEWAY for Beacon', data.uid ,' is ', data.location)}
  else {change5 = 'NO'}

  if (change6 == 'YES' ) {console.log('----------------------- new NEAREST GATEWAY for Beacon', data.uid ,' is ', data.location)}
  else {change6 = 'NO'}*/
  }

/* THIS SHORTER CODE DOES NOT IDENTIFY BEACONS AS IT SHOULD
// DEEPSTREAM IT THROWS UID AS 'UNDEFINED' ?????
// Subscribe to changes in nearest gateway

beacon1.subscribe( 'location', locationChanged.bind({'uid':uid1}), true)
beacon2.subscribe( 'location', locationChanged.bind({'uid':uid2}), true)
beacon3.subscribe( 'location', locationChanged.bind({'uid':uid3}), true)
beacon4.subscribe( 'location', locationChanged.bind({'uid':uid4}), true)
beacon5.subscribe( 'location', locationChanged.bind({'uid':uid5}), true)
beacon6.subscribe( 'location', locationChanged.bind({'uid':uid6}), true)
beacon7.subscribe( 'location', locationChanged.bind({'uid':uid7}), true)
beacon8.subscribe( 'location', locationChanged.bind({'uid':uid8}), true)
beacon9.subscribe( 'location', locationChanged.bind({'uid':uid9}), true)
beacon10.subscribe( 'location', locationChanged.bind({'uid':uid10}), true)

var uid1 = beacon1.get().uid; // or beacon1.get('uid')
var uid2 = beacon1.get('uid')
var uid3 = beacon1.get('uid')
var uid4 = beacon1.get('uid')
var uid5 = beacon1.get('uid')
var uid6 = beacon1.get('uid')
var uid7 = beacon1.get('uid')
var uid8 = beacon1.get('uid')
var uid9 = beacon1.get('uid')

function locationChanged( location , uid ) {
  console.log('new nearest gateway for Beacon', this.uid ,' is ',location)
  }

*/