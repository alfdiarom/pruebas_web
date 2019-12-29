const { Client } = require('pg');

//Conexión a db
const connectionData = {
  user: 'spit_user',
  host: 'adn-bbdd.sev.alestis',
  database: 'pruebas',
  //database: 'pruebas_nieto',
  password: '3HHMix0bTgJs',
  port: 5435,
  }
  const client = new Client(connectionData)
  client.connect()



exports.borrar = () =>{
    //Mirar semana mas antigua.
    client.query(`select min(semana_descarga) from zpp_necesidades group by semana_descarga order by semana_descarga`, (err, res) => {
        if(res.rows.length>4){
            client.query(`delete from zpp_necesidades where semana_descarga = '` +res.rows[0].min+"'" , (err, res) => {
                console.log(err, res)
                
            });
        };
        client.end();
    });
};
