const deepstream = require( 'deepstream.io-client-js' )
//const deepstream = require( '@deepstream/client' )

const ds_pro = deepstream( '10.1.2.32:6020' )
//const ds_pro = deepstream( 'adn-deepstream.sev.alestis:6020' )
const ds_test = deepstream( 'v500test01.sev.alestis:6020' )
const ds_dev = deepstream( 'adn-iot-pro.sev.alestis:6020' )

const DEV = 'true'
const TST = 'false'
const PRO = 'false'

const TOPIC = 'device'

//Beacon ID
const hostname = 'bf4398a' // Fin at OOCC

if (DEV == 'true') {
    ds_dev.login()
    ds_dev.event.subscribe( TOPIC, function( eventData ){
        const time = new Date()
        console.log(`TST / ${TOPIC} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} -> hostname= ${eventData.hostname} trafficNodeRED= ${eventData.trafficNodeRED}`)
    })
}

if (TST == 'true') {
    ds_test.login()
    ds_test.event.subscribe( TOPIC, function( eventData ){
            if (eventData.hostname == hostname) {
                // Current timestamp
                const time = new Date()
                console.log(`TST / ${TOPIC} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} -> ${eventData}`)
            }
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
        const time = new Date()
        console.log(`TST / ${TOPIC} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} -> ${eventData}`)
    })
    ds_pro.on('error', ( error, event, topic ) => {
        console.log('+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*')
        console.log(error, event, topic)
        console.log('+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*')
    })
}