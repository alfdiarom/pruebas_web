
//archivo de carga de zpp_ma_pa

const fs = require('fs');
const trim = require('deep-trim-node');
const { Client } = require('pg');
const moment = require('moment');
const fsEx = require('fs.extra');

//Pasear .txt
///Pasear .txt
function dateFormat(txt) {
  if(!txt){
    txt = 'null'
  } else {
    txt = moment(txt.split(".").reverse()[0] + txt.split(".").reverse()[1] + txt.split(".").reverse()[2]).format("YYYY-MM-DD")
  }
  return txt;
};

//Comprobar si el txt es número o texto.
function nOString(txt) {
  if (isNaN(txt) == true) {
    txt = txt;
  }
  return txt;
};

//Comprobar si el txt tiene el negativo a la derecha y corregirlo.
function simbNeg(txt) {
  if (txt.charAt(txt.length - 1) == '-') {
    txt = '-' + txt.substring(0, txt.length - 1);
  }
  return txt;
};

//Cambiar las comas por puntos.
function numero_real(txt) {
  txt = txt.replace(/\./g, '');
  txt = txt.replace(/,/g, '.');
  return txt;
};

function arregla_real(txt) {
  if(!txt){
    txt = 'null'
  } else {
    txt = "'"+nOString(numero_real(simbNeg(txt.trim())))+"'"
  }
  return txt;
};

//Rellena vacío.
function fillEmpty(txt) {
  if(!txt){
    txt = 'null'
  } else {
    txt = "'"+nOString((txt.trim()))+"'"
  }
  return txt;
};


//Poner entre comillas la fecha.
function comillasFecha(txt) {
  if(txt != 'null'){
    txt = "'"+txt+"'"}
  return txt;
};


//Conexión a db
const connectionData = {
    user: 'spit_user',
    host: 'adn-bbdd.sev.alestis',
    database: 'pruebas',
    //database: 'control_produccion', // base de datos productiva
    password: '3HHMix0bTgJs',
    port: 5435,
  }


const client = new Client(connectionData)
client.connect()

//Recorrer directorio indicando buscando solo los ficheros ZPP_NECESIDADES Ubuntu
const testFolder = '/media/WEBDAV/SAP_INTERFACES/PRODUCCION/IN/PROCESADOS/prueba_alfonso/'; // carpeta RED
const testFolderOld = '/media/WEBDAV/SAP_INTERFACES/PRODUCCION/IN/PROCESADOS/prueba_alfonso/procesados/'; // carpeta RED

//const testFolder = 'C:/Users/alfonso.diaz/Desktop/LOCAL/WEB/nodejs/ZPP_NECESIDADES_IN/'; // carpeta RED
//const testFolderOld = 'C:/Users/alfonso.diaz/Desktop/LOCAL/WEB/nodejs/ZPP_NECESIDADES_PROCESADOS/'; // carpeta RED


//Recorrer directorio indicando buscando solo los ficheros ZPP_NECESIDADES Windows
//  const testFolder = '\\\\webdav.sev.alestis\\ftpes-externo\\SAP_INTERFACES\\PRODUCCION\\';

//  const testFolderOld = '\\\\webdav.sev.alestis\\ftpes-externo\\SAP_INTERFACES\\PRODUCCION\\IN\\PROCESADOS\\ZPP_NECESIDADES\\';
//Recorrer la ruta indicada cargando los ficheros en los que su nombre aparece NECESIDADES
exports.cargar = () => {
  const client = new Client(connectionData)
  client.connect()


fs.readdirSync(testFolder, (err) => {console.log(err)}).filter(file =>  file.indexOf('ZPP_MA_PA')> -1).forEach(file => {
  let ruta = testFolder + file;


  console.log("Fichero encontrado")

  client.query(`truncate zpp_ma_pa`)
  client.query(`alter sequence zpp_ma_pa_id_seq restart with 1;`)

  //Fecha de extraccion de SAP
  var fechaFichero = moment(file.split("_").reverse()[1]).format("YYYY-MM-DD");


  let archivo = fs.readFileSync(ruta, 'utf-8').toString() ;

  var arreglo = archivo.split('\n').map((linea)=>{
  var numeros = trim(linea.split('|'));


    return {pl_nec: numeros[1],
      centro: numeros[2],
      est: numeros[3],
      mat_plan: numeros[4],
      avion: numeros[5],
      f_fin: numeros[6],
      ctd: numeros[7],
      f_ini_plan: numeros[8],
      rcp: numeros[9] };

  });



console.log("ahora los segundos" + "\n");
  // Quitar elementos que tenga undefined est o Ce igual a Est (quitamos cabecera y cosas raraas)
  arreglo = arreglo.filter(word => (word.est != undefined)&(word.est != 'Est'));



  //Páginar array
  var perPage = 30000;
  var nPage = Math.ceil(arreglo.length / perPage);

  for (var i = 1; i < nPage+1; i++) {

console.log("Insertando pagina " + i + " de " + nPage)

    result = arreglo.slice((i-1)*perPage,i*perPage).map( element =>{
      var pr_avion = "";
      var concatenado = "";
      var semana_inicio = "";
      var semana_fin = "";

      if (element.f_fin) {
        semana = dateFormat(element.f_fin)
        //w_impacto = moment(semana).format("YYYY") + moment(semana).format("ww");
        semana_fin = moment(semana).weekYear() + moment(semana).format("ww");
      } else {
        semana_fin = "";
      };

      if (element.f_ini_plan) {
        semana = dateFormat(element.f_ini_plan)
        //w_impacto = moment(semana).format("YYYY") + moment(semana).format("ww");
        semana_inicio = moment(semana).weekYear() + moment(semana).format("ww");
      } else {
        semana_inicio = "";
      };

      return "("+
      fillEmpty(element.pl_nec)+","+
      fillEmpty(element.centro)+","+
      fillEmpty(element.est)+","+
      fillEmpty(element.mat_plan)+","+
      fillEmpty(element.avion)+","+
      comillasFecha(dateFormat(element.f_fin))+","+ // para las fechas
      arregla_real(element.ctd)+","+
      comillasFecha(dateFormat(element.f_ini_plan))+","+
      fillEmpty(element.rcp)+","+
      comillasFecha(fechaFichero)+","+ // f_subida
      fillEmpty(semana_inicio)+","+
      fillEmpty(semana_fin)+")"

    })




     //Insertar datos en DB
     client.query(`
     INSERT INTO zpp_ma_pa(pl_nec, centro, est, mat_plan, avion, f_fin, ctd, f_ini_plan, rcp,f_subida, semana_inicio, semana_fin)
     VALUES` + result.toString(), (err, res) => {
       console.log(res, err);
       if (err) {
         fs.writeFile("./err.txt", file, function (err) {
           if (err) {
             return console.log(err);
           }
         });
       }
     })

 }

// insertamos concatenado
client.query(`update zpp_ma_pa set concatenado = concat(centro,pl_nec,rcp,avion)`, (err, res) => {console.log(err, res)});
client.query(`insert into log_subida(tabla,ultima_actualizacion) values ('zpp_ma_pa',current_timestamp)`, (err, res) => {console.log(err, res)
    client.end();

    });


 //Mover ficheros a carpeta históricos
        fsEx.move(ruta, testFolderOld + file, function (err) {
          if (err) {
            throw err;
          }
          console.log("Moved " + ruta + " to " + testFolderOld + file);
        });

});

}; //-> viene del export cargar
