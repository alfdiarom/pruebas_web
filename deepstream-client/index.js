const deepstream = require( 'deepstream.io-client-js' )
//const deepstream = require( '@deepstream/client' )

const ds_pro = deepstream( 'adn-deepstream.sev.alestis:6020' )
//const ds_pro = deepstream( 'adn-deepstream.sev.alestis:6020' )

const ds_test = deepstream( 'v500test01.sev.alestis:6020' )
//const ds_test = deepstream( '35.228.148.119:6020' ) // Google Cloud
//const ds_test = deepstream( 'deepstream.alestis.online:6020' ) // Amazon AWS

//const ds_dev = deepstream( 'adn-iot-pro.sev.alestis:6020' )
const DEV = 'false'

const TST = 'true'
const PRO = 'true'

//const TOPIC = 'PRE-Walls-LOC_1'
//const TOPIC = 'PRE-Walls-LOC_1-bis'
//const TOPIC = 'PRE_TVPi_Walls-LOC_2'
//const TOPIC = 'PRE_TVPi_BF_Pto_R-LOC_3'
//const TOPIC = 'PRE_TVPi_BF_FG-LOC_4'
//const TOPIC = 'PRE-U_HF-LOC_5'
//const TOPIC = 'PRE-U_HF-LOC_5-bis'

//const TOPIC = 'device2'
//const TOPIC = 'StratoPi'
//const TOPIC = 'PolarisEddystone2' //34'
const TOPIC = 'OOCC'

//const TOPIC = 'presencia'

//Beacon ID
//const UID = '2.43'
//const UID = '1.1302'

if (DEV == 'true') {
    ds_dev.login()
    ds_dev.event.subscribe( TOPIC, function( eventData ){
        let uid = new String(eventData.uid)
        let proximity = eventData.proximity.slice(0,3)
        let time = new Date()
        console.log(`DEV / ${eventData.GATEWAY.slice(-5)} -> ${TOPIC} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} ->`, `${uid} is ${proximity}`)
        // Log stream of devices
        /*if (eventData.hasOwnProperty('stats') || eventData.hasOwnProperty('balena')) {
            let time = new Date()
            console.log(`TST / ${TOPIC} ${eventData.stats.GATEWAY} -> ${eventData.stats.load[0]} at ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`)
        }

        // Log stream of beacons
            if (eventData.hasOwnProperty('rssi')) {
            //if (eventData.uid == UID) {
            //if (eventData.workspace == 'LOC_1') {
                let uid = new String(eventData.uid)
                let proximity = eventData.proximity.slice(0,3)
                let distance = eventData.distance_m
                let rssi = eventData.rssi
                // Current timestamp
                let time = new Date()
                let timeAfter = eventData.lastInterval/1000
                //console.log(uid, `${eventData.GATEWAY} ${distance} m ${rssi} dBm`)
                console.log(`DEV / ${eventData.GATEWAY.slice(-5)} -> ${TOPIC} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} ->`, `${uid} is ${proximity} after ${timeAfter.toFixed(1)}s`)
            }*/
    })
    ds_dev.on('error', ( error, event, topic ) => {
        console.log('+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*')
        console.log(error, event, topic)
        console.log('+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*')
    })
}

if (TST == 'true') {
    ds_test.login()
    ds_test.event.subscribe( TOPIC, function( eventData ){
        //console.log('\n', eventData)
        let uid = new String(eventData.uid)
        let proximity = eventData.proximity.slice(0,3)
        let time = new Date()
        console.log(`TST / ${eventData.GATEWAY.slice(-5)} -> ${TOPIC} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} ->`, `${uid} is ${proximity}`)
        
        // Log stream of devices
        /*if (eventData.hasOwnProperty('stats') || eventData.hasOwnProperty('balena')) {
            let time = new Date()
            console.log(`TST / ${TOPIC} ${eventData.stats.GATEWAY} -> ${eventData.stats.load[0]} at ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`)
        }

        // Log stream of beacons
            if (eventData.hasOwnProperty('rssi')) {
            //if (eventData.uid == UID) {
            //if (eventData.workspace == 'LOC_1') {
                let uid = new String(eventData.uid)
                let proximity = eventData.proximity.slice(0,3)
                let distance = eventData.distance_m
                let rssi = eventData.rssi
                // Current timestamp
                let time = new Date()
                let timeAfter = eventData.lastInterval/1000
                //console.log(uid, `${eventData.GATEWAY} ${distance} m ${rssi} dBm`)
                console.log(`TST / ${eventData.GATEWAY.slice(-5)} -> ${TOPIC} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} ->`, `${uid} is ${proximity} after ${timeAfter.toFixed(1)}s`)
            }*/
    })
    ds_test.on('error', ( error, event, topic ) => {
        console.log('+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*')
        console.log(error, event, topic)
        console.log('+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*')
    })
}

if (PRO == 'true') {
    ds_pro.login()
    ds_pro.event.subscribe( TOPIC, function( eventData ){
        let uid = new String(eventData.uid)
        let proximity = eventData.proximity.slice(0,3)
        let time = new Date()
        console.log(`PRO / ${eventData.GATEWAY.slice(-5)} -> ${TOPIC} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} ->`, `${uid} is ${proximity}`)
        // Log stream of devices
        /*if (eventData.hasOwnProperty('stats') || eventData.hasOwnProperty('balena')) {
            let time = new Date()
            console.log(`PRO / ${TOPIC} ${eventData.stats.GATEWAY} -> ${eventData.stats.load[0]} at ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`)
        }

        // Log stream of beacons
            if (eventData.hasOwnProperty('rssi')) {
            //if (eventData.uid == UID) {
            //if (eventData.workspace == 'LOC_1') {
                let uid = new String(eventData.uid)
                let proximity = eventData.proximity.slice(0,3)
                let distance = eventData.distance_m
                let rssi = eventData.rssi
                // Current timestamp
                let time = new Date()
                let timeAfter = eventData.lastInterval/1000
                //console.log(uid, `${eventData.GATEWAY} ${distance} m ${rssi} dBm`)
                console.log(`PRO / ${eventData.GATEWAY.slice(-5)} -> ${TOPIC} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} ->`, `${uid} is ${proximity} after ${timeAfter.toFixed(1)}s`)
            }*/
    })
    ds_pro.on('error', ( error, event, topic ) => {
        console.log('+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*')
        console.log(error, event, topic)
        console.log('+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*')
    })
}

/*if (PRO == 'true') {
    ds_pro.login()
    ds_pro.event.subscribe( TOPIC, function( eventData ){
        const time = new Date()
        let uid = new String(eventData.uid)
        proximity = eventData.proximity.slice(0,3)
        const timeAfter = eventData.lastInterval/1000
        console.log(`PRO / ${eventData.GATEWAY.slice(-5)} -> ${TOPIC} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} ->`, `${uid} is ${proximity} after ${timeAfter.toFixed(1)}s`)
        })
    ds_pro.on('error', ( error, event, topic ) => {
        console.log('+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*')
        console.log(error, event, topic)
        console.log('+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*')
    })
}*/