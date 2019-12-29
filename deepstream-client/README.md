Sample NodeJS client to subscribe to Deepstream events
======================================================

https://deepstreamhub.com/tutorials/getting-started/node/

The NodeJS API function for subscribing to events is this simple:
```javacript
ds.event.subscribe( 'PolarisEddystone2', function( eventData ){
    console.log(eventData);
});
```
How to execute the code in this repository:
```bash
$ npm install
$ npm start
```
Once started you will see real-time events flowing in your console log (as delivered by Eddystone beacons from `Accent Systems`):
```bash
{ id: 'de2d9d18d1e7',
  address: 'de:2d:9d:18:d1:e7',
  localName: 'iBKS Card Beacon',
  txPowerLevel: null,
  rssi: -70,
  beaconType: 'eddystoneUid',
  lastSeen: '2019-03-28T11:26:46.519Z',
  txPower: -67,
  timestamp: '2019-03-28T11:26:46.519Z',
  uid: 1.6,
  b_namespace: 1,
  b_instance: 6,
  distance_m: 17.78279410038923 }
  ```

# EVENTS: Environmental conditions from iBeacon
Temperature and humidity for development purposed are being broadcasted also using a beacon (in this case, the beacon uses the Apple protocol iBeacon).
A specific script allows to see the console log for these events:
```bash
$ npm run environment
```

```bash
  { id: 'fd8b19fa824a',
  address: 'fd:8b:19:fa:82:4a',
  localName: null,
  txPowerLevel: null,
  rssi: -49,
  beaconType: 'iBeacon',
  lastSeen: '2019-04-01T07:20:00.451Z',
  uuid: 'EBEFD083-70A2-47C8-9837-E7B5634DF524',
  major: 33636,
  minor: 49153,
  txPower: 203,
  environment:
   { humidity: 57.96484375,
     temperature: 22.305429687500002,
     timestamp: '2019-04-01T07:20:00.452Z' } }
```

# EVENTS: Device stats
A specific script allows to see the console log for these events, that include:
 - Balena supervisor stats
 - Ping test
 - CPU and RAM load

```bash
$ npm run device
```

# RECORDS: Beacon1
https://deepstreamhub.com/docs/client-js/datasync-record/
Sample code to learn is in folder `RECORDS`
```bash
$ node recordBeacon1.js
```
It reports the record `beacon1` (JSON object)
And so on for all beacons 1..10

# RECORDS: Environment
```bash
$ node recordEnvironment.js
```
It reports the record `pre/environment` (JSON object)


