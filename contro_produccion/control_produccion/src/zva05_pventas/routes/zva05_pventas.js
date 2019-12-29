
//archivo de carga de zva05_pventas

const fs = require('fs');
const trim = require('deep-trim-node');
const { Client } = require('pg');
const moment = require('moment');
const fsEx = require('fs.extra');

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


function getCleanedString(cadena){
   // Definimos los caracteres que queremos eliminar
   //var specialChars = "!@#$^&%*()+=-[]{}:'<>?";
   var specialChars = "'";
   // Los eliminamos todos
   for (var i = 0; i < specialChars.length; i++) {
       cadena= cadena.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
   }

   // Quitamos acentos y "ñ". Fijate en que va sin comillas el primer parametro
   //cadena = cadena.replace(/á/gi,"a");
   //cadena = cadena.replace(/é/gi,"e");
   //cadena = cadena.replace(/í/gi,"i");
   //cadena = cadena.replace(/ó/gi,"o");
   //cadena = cadena.replace(/ú/gi,"u");
   //cadena = cadena.replace(/ñ/gi,"n");
   return cadena;
}

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

function numero_real_2(txt) {
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

function arregla_real_2(txt) {
  if(!txt){
    txt = 'null'
  } else {
    txt = "'"+nOString(numero_real_2(simbNeg(txt.trim())))+"'"
  }
  return txt;
};

//Rellena vacío.
function fillEmpty(txt) {
  if(!txt){
    txt = 'null'
  } else {

    txt = getCleanedString(txt);
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
    //database: 'pruebas',
    database: 'control_produccion', // base de datos productiva
    password: '3HHMix0bTgJs',
    port: 5435,
  }

//Recorrer la ruta indicada cargando los ficheros en los que su nombre aparece NECESIDADES
exports.cargar = () => {
const client = new Client(connectionData)
client.connect()

//Recorrer directorio indicando buscando solo los ficheros ZPP_NECESIDADES Ubuntu
 const testFolder = '/media/WEBDAV/SAP_INTERFACES/PRODUCCION/IN/'; // carpeta RED
 const testFolderOld = '/media/WEBDAV/SAP_INTERFACES/PRODUCCION/IN/PROCESADOS/ZVA05_PVENTAS/'; // carpeta RED
//
//const testFolder = 'C:/Users/alfonso.diaz/Desktop/LOCAL/WEB/nodejs/ZPP_NECESIDADES_IN/'; // carpeta RED
//const testFolderOld = 'C:/Users/alfonso.diaz/Desktop/LOCAL/WEB/nodejs/ZPP_NECESIDADES_PROCESADOS/'; // carpeta RED



console.log("Fichero encontrado")

client.query(`truncate zva05_pventas`)
client.query(`alter sequence zva05_pventas_id_seq restart with 1;`)

//Recorrer directorio indicando buscando solo los ficheros ZPP_NECESIDADES Windows
//const testFolder = '\\\\webdav.sev.alestis\\ftpes-externo\\SAP_INTERFACES\\PRODUCCION\\IN\\';

//const testFolder = 'C:/Users/alfonso.diaz/Desktop/LOCAL/WEB/nodejs/ZPP_NECESIDADES_IN/'; // carpeta RED


fs.readdirSync(testFolder, (err) => {console.log(err)}).filter(file =>  file.indexOf('ZVA05_Plan_ventas')> -1).forEach(file => {
  let ruta = testFolder + file;

  //Fecha de extraccion de SAP
  var fechaFichero = moment(file.split("_").reverse()[1]).format("YYYY-MM-DD");
console.log("Actualizado a " + fechaFichero)

  let archivo = fs.readFileSync(ruta, 'utf-8').toString() ;

  var arreglo = archivo.split('\n').map((linea)=>{
  var numeros = trim(linea.split('|'));


    return {programa: numeros[1],
      paquete: numeros[2],
      doc_ventas: numeros[3],
      pos_doc: numeros[4],
      doc_ref: numeros[5],
      pos_doc_r: numeros[6],
      fecha_pedido: numeros[7],
      fecha_cab: numeros[8],
      fecha_creacion: numeros[9],
      material: numeros[10],
      desc_material: numeros[11],
      ctd_pedido: numeros[12],
      n_avion: numeros[13],
      sec_cliente: numeros[14],
      fecha_req: numeros[15],
      fecha_contab: numeros[16],
      ctd_fact_air: numeros[17]};
  });



//console.log("ahora los segundos" + "\n");
  // Quitar elementos que tenga undefined est o Ce igual a Est (quitamos cabecera y cosas raraas)
  arreglo = arreglo.filter(word => (word.programa != undefined)&(word.programa != 'Programa'));


  //Páginar array
  var perPage = 30000;
  var nPage = Math.ceil(arreglo.length / perPage);

  for (var i = 1; i < nPage+1; i++) {

console.log("Insertando pagina " + i + " de " + nPage)

    result = arreglo.slice((i-1)*perPage,i*perPage).map( element =>{
      var pr_avion = "";
      var concatenado = "";


      return "("+
      fillEmpty(element.programa)+","+
      fillEmpty(element.paquete)+","+
      fillEmpty(element.doc_ventas)+","+
      fillEmpty(element.pos_doc)+","+
      fillEmpty(element.doc_ref)+","+
      fillEmpty(element.pos_doc_r)+","+
      comillasFecha(dateFormat(element.fecha_pedido))+","+
      comillasFecha(dateFormat(element.fecha_cab))+","+
      comillasFecha(dateFormat(element.fecha_creacion))+","+
      fillEmpty(element.material)+","+
      fillEmpty(element.desc_material)+","+
      arregla_real_2(element.ctd_pedido)+","+
      fillEmpty(element.n_avion)+","+
      fillEmpty(element.sec_cliente)+","+
      comillasFecha(dateFormat(element.fecha_req))+","+
      comillasFecha(dateFormat(element.fecha_contab))+","+
      arregla_real_2(element.ctd_fact_air)+","+
      comillasFecha(fechaFichero)+")"
    })


//for (var i = 0; i < result.length; i++) {
//  console.log(result[i])
//}

     //Insertar datos en DB
     client.query(`
     INSERT INTO zva05_pventas(programa,paquete,doc_ventas,pos_doc,doc_ref,pos_doc_r,fecha_pedido,fecha_cab,fecha_creacion,material,desc_material,ctd_pedido,n_avion,sec_cliente,fecha_req,fecha_contab,ctd_fact_air,f_subida)
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

  client.query(`delete from zva05_pventas where programa like '-------------%'`, (err, res) => {console.log(err, res)});

  client.query(`insert into log_subida(tabla,ultima_actualizacion) values ('zva05_pventas',current_timestamp)`, (err, res) => {console.log(err, res)
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
