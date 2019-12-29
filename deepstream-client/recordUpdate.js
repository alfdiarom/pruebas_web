const deepstream = require( 'deepstream.io-client-js' );
const ds = deepstream('10.1.2.89:6020');
ds.login();

console.log(process.argv)

////////////////////// Beacon1
//var environment = ds.record.getRecord( 'pre/environment' )
var environment = ds.record.getRecord( process.argv[0] )

environment.get()
//environment.get('environment.temperature')
environment.get(process.argv[1])

// Subscribe to any change of the record
environment.subscribe(temperatureChanged)
function temperatureChanged(data) {
    console.log('new enviromental conditions are ',data)
  }
// Only subscribe to changes in distance estimation
environment.subscribe( 'environment.temperature', temperatureChanged, true)
function temperatureChanged( temperature ) {
    if (temperature !== 0) {
      console.log('new temperature value is ',temperature)
    }
  }