const deepstream = require( 'deepstream.io-client-js' )
const ds = deepstream( 'v500test01.sev.alestis:6020' )
ds.login()

let employeePath= `employee/002544`
let employeeDSrecord = ds.record.getRecord(employeePath)
const register = employeeDSrecord.get('state')


// Callback
employeeDSrecord.whenReady(register => {
    register = employeeDSrecord.get()
    console.log(`\n *=> record `, employeePath, `=`,register)
  })
employeeDSrecord.whenReady()