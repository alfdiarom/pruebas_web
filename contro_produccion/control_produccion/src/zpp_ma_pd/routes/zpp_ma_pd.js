
//archivo de carga de zpp_ma_pd

const fs = require('fs');
const trim = require('deep-trim-node');
const { Client } = require('pg');
const moment = require('moment');
const fsEx = require('fs.extra');

//Pasear .txt
//Pasear .txt
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

//Recorrer la ruta indicada cargando los ficheros en los que su nombre aparece NECESIDADES
exports.cargar = () => {
const client = new Client(connectionData)
client.connect()

//Recorrer directorio indicando buscando solo los ficheros ZPP_NECESIDADES Ubuntu
const testFolder = '/media/WEBDAV/SAP_INTERFACES/PRODUCCION/IN/PROCESADOS/prueba_alfonso/'; // carpeta RED
const testFolderOld = '/media/WEBDAV/SAP_INTERFACES/PRODUCCION/IN/PROCESADOS/prueba_alfonso/procesados/'; // carpeta RED

//
//const testFolder = 'C:/Users/alfonso.diaz/Desktop/LOCAL/WEB/nodejs/ZPP_NECESIDADES_IN/'; // carpeta RED
//const testFolderOld = 'C:/Users/alfonso.diaz/Desktop/LOCAL/WEB/nodejs/ZPP_NECESIDADES_PROCESADOS/'; // carpeta RED



console.log("Fichero encontrado")

client.query(`truncate zpp_ma_pd`)
client.query(`alter sequence zpp_ma_pd_id_seq restart with 1;`)

//Recorrer directorio indicando buscando solo los ficheros ZPP_NECESIDADES Windows
//const testFolder = '\\\\webdav.sev.alestis\\ftpes-externo\\SAP_INTERFACES\\PRODUCCION\\IN\\';


fs.readdirSync(testFolder, (err) => {console.log(err)}).filter(file =>  file.indexOf('ZPP_MA_PD')> -1).forEach(file => {
  let ruta = testFolder + file;

  //Fecha de extraccion de SAP
  var fechaFichero = moment(file.split("_").reverse()[1]).format("YYYY-MM-DD");


  let archivo = fs.readFileSync(ruta, 'utf-8').toString() ;

  var arreglo = archivo.split('\n').map((linea)=>{
  var numeros = trim(linea.split('|'));


    return {plan_nec: numeros[1],
      rcp: numeros[2],
      centro: numeros[3],
      est: numeros[4],
      mat_plan: numeros[5],
      material: numeros[6],
      avion: numeros[7],
      fecha: numeros[8],
      ctd: numeros[9],
      ctd_prep: numeros[10],
      ctd_ped: numeros[11],
      ctd_env: numeros[12],
      f_entrega: numeros[13],
      f_sm_real: numeros[14],
      lote: numeros[15],
      doc_comercial: numeros[16],
      posicion: numeros[17],
      entrega: numeros[18],
      posicion_2: numeros[19],
      f_ini_plan: numeros[20],
      f_fab: numeros[21],
      cl_aprov: numeros[22],
      cl_aprov_est: numeros[23]};
  });



//console.log("ahora los segundos" + "\n");
  // Quitar elementos que tenga undefined est o Ce igual a Est (quitamos cabecera y cosas raraas)
  arreglo = arreglo.filter(word => (word.centro != undefined)&(word.centro != 'Centro'));


  //Páginar array
  var perPage = 30000;
  var nPage = Math.ceil(arreglo.length / perPage);

  for (var i = 1; i < nPage+1; i++) {

console.log("Insertando pagina " + i + " de " + nPage)

    result = arreglo.slice((i-1)*perPage,i*perPage).map( element =>{
      var pr_avion = "";
      var concatenado = "";

      return "("+
      fillEmpty(element.plan_nec)+","+
      fillEmpty(element.rcp)+","+
      fillEmpty(element.centro)+","+
      fillEmpty(element.est)+","+
      fillEmpty(element.mat_plan)+","+
      fillEmpty(element.material)+","+
      fillEmpty(element.avion)+","+
      comillasFecha(dateFormat(element.fecha))+","+
      arregla_real(element.ctd)+","+
      arregla_real(element.ctd_prep)+","+
      arregla_real(element.ctd_ped)+","+
      arregla_real(element.ctd_env)+","+
      comillasFecha(dateFormat(element.f_entrega))+","+
      comillasFecha(dateFormat(element.f_sm_real))+","+
      fillEmpty(element.lote)+","+
      fillEmpty(element.doc_comercial)+","+
      fillEmpty(element.posicion)+","+
      fillEmpty(element.entrega)+","+
      fillEmpty(element.posicion_2)+","+
      comillasFecha(dateFormat(element.f_ini_plan))+","+
      comillasFecha(dateFormat(element.f_fab))+","+
      fillEmpty(element.cl_aprov)+","+
      fillEmpty(element.cl_aprov_est)+","+
      comillasFecha(fechaFichero)+")" // f_subida

    })


//for (var i = 0; i < result.length; i++) {
//  console.log(result[i])
//}

     //Insertar datos en DB
     client.query(`
     INSERT INTO zpp_ma_pd(plan_nec, rcp, centro, est, mat_plan, material, avion, fecha, ctd,ctd_prep,ctd_ped,ctd_env,f_entrega,f_sm_real,lote,doc_comercial,posicion,entrega,posicion_2,f_ini_plan,f_fab,cl_aprov,cl_aprov_est,f_subida)
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

client.query(`truncate a`, (err, res) => {console.log(err, res)});
client.query(`update zpp_ma_pd set concatenado = concat(centro,plan_nec,rcp)`, (err, res) => {console.log(err, res)});
client.query(`insert into log_subida(tabla,ultima_actualizacion) values ('zpp_ma_pd',current_timestamp)`, (err, res) => {console.log(err, res)
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
