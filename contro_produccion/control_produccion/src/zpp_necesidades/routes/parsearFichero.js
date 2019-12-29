const fs = require('fs');
const trim = require('deep-trim-node');
const { Client } = require('pg');
const moment = require('moment');
const fsEx = require('fs.extra');
var semanaDescarga = "";
//Pasear .txt
//Formatear semana.
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
    //database: 'pruebas_nieto',
    password: '3HHMix0bTgJs',
    port: 5435,
  }


exports.cargar = () => {

const client = new Client(connectionData)
client.connect()

//Recorrer directorio indicando buscando solo los ficheros ZPP_NECESIDADES Ubuntu
 const testFolder = '/media/WEBDAV/SAP_INTERFACES/PRODUCCION/IN/'; // carpeta RED
 const testFolderOld = '/media/WEBDAV/SAP_INTERFACES/PRODUCCION/IN/PROCESADOS/ZPP_NECESIDADES/'; // carpeta RED

//const testFolder = 'C:/Users/alfonso.diaz/Desktop/LOCAL/WEB/nodejs/ZPP_NECESIDADES_IN/'; // carpeta RED
//const testFolderOld = 'C:/Users/alfonso.diaz/Desktop/LOCAL/WEB/nodejs/ZPP_NECESIDADES_PROCESADOS/'; // carpeta RED



console.log("Fichero encontrado")

//client.query(`truncate zpp_necesidades`)
//Recorrer directorio indicando buscando solo los ficheros ZPP_NECESIDADES Windows
//  const testFolder = '\\\\webdav.sev.alestis\\ftpes-externo\\SAP_INTERFACES\\PRODUCCION\\IN\\';

//  const testFolderOld = '\\\\webdav.sev.alestis\\ftpes-externo\\SAP_INTERFACES\\PRODUCCION\\IN\\PROCESADOS\\ZPP_NECESIDADES\\';

//Recorrer la ruta indicada cargando los ficheros en los que su nombre aparece NECESIDADES



fs.readdirSync(testFolder, (err) => {console.log(err)}).filter(file =>  file.indexOf('NECESIDADES')> -1).forEach(file => {
  let ruta = testFolder + file;

  //Fecha del fichero
  var fechaFichero = moment(file.split("_").reverse()[1]).format("YYYY-MM-DD");

  //Fecha carga del fichero. En formato año-semana
  semanaDescarga = moment(fechaFichero).format("YYYY") + moment(fechaFichero).format("ww")

// borramos la semana que vamos a introducir por si la intoducimos dos veces
  client.query(`delete from zpp_necesidades where semana_descarga = '` +semanaDescarga+"'" , (err, res) => {
      console.log(err, res)
  });

  let archivo = fs.readFileSync(ruta, 'utf-8').toString() ;

  var arreglo = archivo.split('\n').map((linea)=>{
  var numeros = trim(linea.split('|'));


    return {Material: numeros[1],
      Grupo_art: numeros[2],
      Ce: numeros[3],
      Pln: numeros[4],
      RCtrP: numeros[5],
      GCp: numeros[6],
      ClAprov: numeros[7],
      ApE: numeros[8],
      CaP: numeros[9],
      Clv: numeros[10],
      Exc: numeros[11],
      GrpSe: numeros[12],
      CrearLP: numeros[13],
      Prio: numeros[14],
      Inact: numeros[15],
      Mensaje_de_excepcion: numeros[16],
      Fecha: numeros[17],
      ElemPlanif: numeros[18],
      FechaIn_Lz: numeros[19],
      Datos_del_ElemPlNec: numeros[20],
      Clv_: numeros[21],
      Ctd_disp_: numeros[22],
      Alm_: numeros[23],
      FeReprogr: numeros[24],
      CePl: numeros[25],
      Acreedor: numeros[26],
      Cliente: numeros[27],
      Avion: numeros[28],
      Entr_Neces: numeros[29],
      Nec_Sec : numeros[30],
      PzE : numeros[31],
      Entr_Fin : numeros[32],
      VerF : numeros[33] };



  });

  // Quitar elementos que tenga undefined Ce o Ce igual a Ce.
  arreglo = arreglo.filter(word => (word.Ce != undefined)&(word.Ce != 'Ce.'));

  //Páginar array
  var perPage = 30000;
  var nPage = Math.ceil(arreglo.length / perPage);

  for (var i = 1; i < nPage+1; i++) {

console.log("Insertando pagina " + i + " de " + nPage)

    result = arreglo.slice((i-1)*perPage,i*perPage).map( element =>{
      var semana = "";
      var fNec = "";
      var semana_nec = "";
      var fNecReprog = "";
      var semana_nec_reprog = "";


      //#Semana. Se compone de año y nº semana del campo Fecha.
      if (element.Fecha) {
        semana = dateFormat(element.Fecha)

      } else {
        semana = fechaFichero;
      };
      semana = moment(semana).format("YYYY") + moment(semana).format("ww");



      //#f_nec: fecha necesidad corregida a hoy
      if (dateFormat(element.Fecha) < fechaFichero) {
         fNec = fechaFichero;
      } else {
         fNec = dateFormat(element.Fecha);
      };

       //#semana_nec: Es el año_semana de f_nec.
       semana_nec = moment(fNec).format("YYYY") + moment(fNec).format("ww");


      //#f_nec_reprog. Si existe f_reprog se coje esa, si no la fecha
      if (element.FeReprogr) {
        fNecReprog = dateFormat(element.FeReprogr);
      } else {
        fNecReprog = dateFormat(element.Fecha);
      };

      //console.log(dateFormat(fNecReprog) + "   f_fichero"+ fechaFichero);
      // se corrige para la semana a dia de hoy
      if (fNecReprog < fechaFichero) {
        semana_nec_reprog = fechaFichero;
      }else{
        semana_nec_reprog = fNecReprog;
      }

      //semana_nec_reprog: Es el año_semana de f_nec_reprog
      semana_nec_reprog = moment(semana_nec_reprog).format("YYYY") + moment(semana_nec_reprog).format("ww");



      return "("+
      fillEmpty(element.Material)+","+
      fillEmpty(element.Grupo_art)+","+
      fillEmpty(element.Ce)+","+
      fillEmpty(element.Pln)+","+
      fillEmpty(element.RCtrP)+","+
      fillEmpty(element.GCp)+","+
      fillEmpty(element.ClAprov)+","+
      fillEmpty(element.ApE)+","+
      fillEmpty(element.CaP)+","+
      fillEmpty(element.Clv)+","+
      fillEmpty(element.Exc)+","+
      fillEmpty(element.GrpSe)+","+
      fillEmpty(element.CrearLP)+","+
      fillEmpty(element.Prio)+","+
      fillEmpty(element.Inact)+","+
      fillEmpty(element.Mensaje_de_excepcion)+","+
      comillasFecha(dateFormat(element.Fecha))+","+
      fillEmpty(element.ElemPlanif)+","+
      comillasFecha(dateFormat(element.FechaIn_Lz))+","+
      fillEmpty(element.Datos_del_ElemPlNec)+","+
      fillEmpty(element.Clv_)+","+
      arregla_real(element.Ctd_disp_)+","+
      fillEmpty(element.Alm_)+","+
      comillasFecha(dateFormat(element.FeReprogr))+","+
      fillEmpty(element.CePl)+","+
      fillEmpty(element.Acreedor)+","+
      fillEmpty(element.Cliente)+","+
      fillEmpty(element.Avion)+","+
      arregla_real(element.Entr_Neces)+","+
      fillEmpty(element.Nec_Sec)+","+
      fillEmpty(element.PzE)+","+
      comillasFecha(dateFormat(element.Entr_Fin))+","+
      fillEmpty(element.VerF)+","+
      fillEmpty(semana)+","+
      fillEmpty(fNec)+","+
      fillEmpty(semana_nec)+","+
      comillasFecha(fNecReprog)+","+ //f_nec_reprog
      fillEmpty(semana_nec_reprog)+","+
      fillEmpty(semanaDescarga)+","+
      comillasFecha(fechaFichero)+")"


     })

     //Insertar datos en DB
     client.query(`
     INSERT INTO zpp_necesidades (material, grupo_art, centro, pl_nec, rctrp, gcp, cl_aprov, ape, cap, clv, exc, grpse, crear_lp, prio, inact, m_excp, fecha, elemplanif, fecha_lanz, datos_ep, clv2, ctdisp, alm, fe_reprog, cen_pl, acreedor, cliente, avion, entr_nec, nec_sec, pze, entr_fin, verf, semana, f_nec, semana_nec, f_nec_reprog, semana_nec_reprog, semana_descarga, f_subida)
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

 //Mover ficheros a carpeta históricos
        fsEx.move(ruta, testFolderOld + file, function (err) {
          if (err) {
            throw err;
          }
          console.log("Moved " + ruta + " to " + testFolderOld + file);
        });

});

//insertamos las solped y repped en pedidos_compras
client.query(`truncate pedidos_compras`, (err, res) => {console.log(err, res)});
client.query(`alter sequence pedidos_compras_id_seq restart with 1;`, (err, res) => {console.log(err, res)});
client.query(`insert into pedidos_compras select * from zpp_necesidades where elemplanif = 'SolPed' or elemplanif = 'RepPed'`, (err, res) => {console.log(err, res)});

client.query(`truncate a`, (err, res) => {console.log(err, res)
  client.end();
  });

}; //viene del export cargar
