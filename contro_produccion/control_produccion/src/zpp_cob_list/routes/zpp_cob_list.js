
//archivo de carga de zpp_cob_list_diario

//eliminar caracteres especiales
const fs = require('fs');
const trim = require('deep-trim-node');
const { Client } = require('pg');
const moment = require('moment');
const fsEx = require('fs.extra');
var semanaDescarga = "";

function getCleanedString(cadena){
   // Definimos los caracteres que queremos eliminar
   var specialChars = "!@#$^&%*()+=-[]{}:'<>?";

   // Los eliminamos todos
   for (var i = 0; i < specialChars.length; i++) {
       cadena= cadena.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
   }



   // Quitamos acentos y "ñ". Fijate en que va sin comillas el primer parametro
   cadena = cadena.replace(/á/gi,"a");
   cadena = cadena.replace(/é/gi,"e");
   cadena = cadena.replace(/í/gi,"i");
   cadena = cadena.replace(/ó/gi,"o");
   cadena = cadena.replace(/ú/gi,"u");
   cadena = cadena.replace(/ñ/gi,"n");
   return cadena;
}


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
const testFolderOld = '/media/WEBDAV/SAP_INTERFACES/PRODUCCION/IN/PROCESADOS/ZPP_COB_LIST/'; // carpeta RED

 //const testFolder = 'C:/Users/alfonso.diaz/Desktop/LOCAL/WEB/nodejs/ZPP_NECESIDADES_IN/'; // carpeta RED
 //const testFolderOld = 'C:/Users/alfonso.diaz/Desktop/LOCAL/WEB/nodejs/ZPP_NECESIDADES_PROCESADOS/'; // carpeta RED



console.log("Fichero encontrado")

client.query(`truncate zpp_cob_list_diario`)
client.query(`alter sequence zpp_cob_list_diario_id_seq restart with 1;`)

//Recorrer directorio indicando buscando solo los ficheros ZPP_NECESIDADES Windows
//  const testFolder = '\\\\webdav.sev.alestis\\ftpes-externo\\SAP_INTERFACES\\PRODUCCION\\IN\\';

//  const testFolderOld = '\\\\webdav.sev.alestis\\ftpes-externo\\SAP_INTERFACES\\PRODUCCION\\IN\\PROCESADOS\\ZPP_COB_LIST\\';


fs.readdirSync(testFolder, (err) => {console.log(err)}).filter(file =>  file.indexOf('ZPP_COB_LIST')> -1).forEach(file => {
  let ruta = testFolder + file;

  //Fecha de extraccion de SAP
  var fechaFichero = moment(file.split("_").reverse()[1]).format("YYYY-MM-DD");

  //Fecha carga del fichero. En formato año-semana
  //semanaDescarga = moment(fechaFichero).format("YYYY") + moment(fechaFichero).format("ww");
  semanaDescarga = moment(fechaFichero).weekYear() + moment(fechaFichero).format("ww");

  let archivo = fs.readFileSync(ruta).toString() ;


  var arreglo = archivo.split('\n').map((linea)=>{
  var numeros = trim(linea.split('|'));



    return {pl_nec: numeros[1],
      centro: numeros[2],
      rcp: numeros[3],
      componente: numeros[4],
      material: numeros[5],
      desc_comp: numeros[6],
      libre: numeros[7],
      calidad: numeros[8],
      bloqueado: numeros[9],
      wip: numeros[10],
      transito: numeros[11],
      libref: numeros[12],
      calidadf: numeros[13],
      proveedor: numeros[14],
      centro_interno: numeros[15],
      prim_sec_falta: numeros[16],
      prim_msn_falta: numeros[17],
      f_1: numeros[18],
      pn_venta: numeros[19],
      secuencial_cob_aviones: numeros[20],
      msn: numeros[21],
      nec: numeros[22],
      cons: numeros[23],
      est: numeros[24],
      f_2: numeros[25],
      est_desc: numeros[26],
      f_impacto: numeros[27],
      f_logistica: numeros[28]};
  });



console.log("ahora los segundos" + "\n");
  // Quitar elementos que tenga undefined est o Ce igual a Est (quitamos cabecera y cosas raraas)

  arreglo = arreglo.filter(word => (word.desc_comp != undefined)&(word.centro != 'Centro'));

  //Páginar array
  //var perPage = 30000;
  var perPage = 30000;
  var nPage = Math.ceil(arreglo.length / perPage);

  for (var i = 1; i < nPage+1; i++) {

console.log("Insertando pagina " + i + " de " + nPage)

    result = arreglo.slice((i-1)*perPage,i*perPage).map( element =>{
      var f_impacto = "";
      var f_logistica = "";
      var w_impacto ="";
      var w_logistica="";

      //w_impacto
      if (element.f_impacto) {
        semana = dateFormat(element.f_impacto)
        //w_impacto = moment(semana).format("YYYY") + moment(semana).format("ww"); // esto esta mal para el ultimo dia del año
        w_impacto = moment(semana).weekYear() + moment(semana).format("ww"); // se corrigen las fechas
      } else {
        w_impacto = "";
      };

      //w_logistica
      if (element.f_logistica) {
        semana = dateFormat(element.f_logistica)
        //w_logistica = moment(semana).format("YYYY") + moment(semana).format("ww"); //esto esta mal para el ultimo dia del año
        w_logistica = moment(semana).weekYear() + moment(semana).format("ww"); // se corrigen las fechas
      } else {
        w_logistica = "";
      };

      //concatenado
    //concatenado = centro & "_" & pl_nec & "_" & componente & "_" & msn
    //concatenado_3 = centro & pl_nec & componente '
    //concatenado_2 = centro & pl_nec & rcp & componente & msn 'centro,pl_nec,rcp,componente,msn
    //concatenado_4 = centro & pl_nec & rcp & msn ' 'centro,pl_nec,rcp,componente




//w_impacto = moment(f_impacto).format("YYYY") + moment(f_impacto).format("ww");
//w_logistica = moment(f_logistica).format("YYYY") + moment(f_logistica).format("ww");

      return "("+
      fillEmpty(element.pl_nec)+","+
      fillEmpty(element.centro)+","+
      fillEmpty(element.rcp)+","+
      fillEmpty(element.componente)+","+
      fillEmpty(element.material)+","+
      fillEmpty(getCleanedString(element.desc_comp))+","+ // hay que parsearla bien
      arregla_real(element.libre)+","+
      arregla_real(element.calidad)+","+
      arregla_real(element.bloqueado)+","+
      arregla_real(element.wip)+","+
      arregla_real(element.transito)+","+
      arregla_real(element.libref)+","+
      arregla_real(element.calidadf)+","+
      fillEmpty(element.proveedor)+","+ //hay que parsearla bien
      fillEmpty(element.centro_interno)+","+
      fillEmpty(element.prim_sec_falta)+","+
      fillEmpty(element.prim_msn_falta)+","+
      comillasFecha(dateFormat(element.f_1))+","+
      fillEmpty(element.pn_venta)+","+
      fillEmpty(element.secuencial_cob_aviones)+","+
      fillEmpty(element.msn)+","+
      arregla_real(element.nec)+","+
      arregla_real(element.cons)+","+
      fillEmpty(element.est)+","+
      comillasFecha(dateFormat(element.f_2))+","+
      fillEmpty(element.est_desc)+","+
      comillasFecha(dateFormat(element.f_impacto))+","+
      comillasFecha(dateFormat(element.f_logistica))+","+
      fillEmpty(w_impacto)+","+
      fillEmpty(w_logistica)+","+
      fillEmpty(fechaFichero)+","+
      fillEmpty(semanaDescarga)+")"
      // hasta aqui los datos que te vienen, ahora tenemos que construir los que falten
      //comillasFecha(fechaFichero)+")" // f_subida
    })


//for (var i = 0; i < result.length; i++) {
//  console.log(result[i])
//}

     //Insertar datos en DB
     client.query(`
     INSERT INTO zpp_cob_list_diario(pl_nec,centro,rcp,componente,material,desc_comp,libre,calidad,bloqueado,wip,transito,libref,calidadf,proveedor,centro_interno, prim_sec_falta, prim_msn_falta,f_1,pn_venta,secuencial_cob_aviones,msn,nec,cons,est,f_2,est_desc,f_impacto,f_logistica,w_impacto,w_logistica,f_subida,w_subida)
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

 // para hacer join con programa
 client.query(`update zpp_cob_list_diario set centro_plnec = concat(centro,pl_nec)`, (err, res) => {console.log(err, res)});
 client.query(`update zpp_cob_list_diario set programa = relacion_pl_nec_programa.programa
  from relacion_pl_nec_programa where zpp_cob_list_diario.centro_plnec = relacion_pl_nec_programa.concatenado`, (err, res) => {console.log(err, res)});


  //concatenado = centro & "_" & pl_nec & "_" & componente & "_" & msn
 client.query(`update zpp_cob_list_diario set concatenado = concat(centro,'_',pl_nec,'_',componente,'_',msn)`, (err, res) => {console.log(err, res)});
  //concatenado_3 = centro & pl_nec & componente '
  client.query(`update zpp_cob_list_diario set concatenado_3 = concat(centro,pl_nec,componente)`, (err, res) => {console.log(err, res)});

  //concatenado_2 = centro & pl_nec & rcp & componente & msn 'centro,pl_nec,rcp,componente,msn
  client.query(`update zpp_cob_list_diario set concatenado_2 = concat(centro,pl_nec,rcp,componente,msn)`, (err, res) => {console.log(err, res)});

  //concatenado_4 = centro & pl_nec & rcp & msn ' 'centro,pl_nec,rcp,componente
   client.query(`update zpp_cob_list_diario set concatenado_4 = concat(centro,pl_nec,rcp,msn)`, (err, res) => {console.log(err, res)});

 // insertamos concatenado

 //actualizamos proveedor de piezas internas
 client.query(`update zpp_cob_list_diario set proveedor = 'AIRBUS DS' where componente like '%:AIM%'`, (err, res) => {console.log(err, res)});
 client.query(`update zpp_cob_list_diario set proveedor = 'AIRBUS OPERATIONS' where componente like '%:AIO%'`, (err, res) => {console.log(err, res)});

 //A�ADIMOS ciertos PN manualmente
 client.query(`update zpp_cob_list_diario set proveedor = 'GALVATEC, S.L.' where componente = '316Z1601-505' and centro = '2002'`, (err, res) => {console.log(err, res)});
 client.query(`update zpp_cob_list_diario set proveedor = 'GALVATEC, S.L.' where componente = '316Z1601-506' and centro = '2002'`, (err, res) => {console.log(err, res)});
 client.query(`update zpp_cob_list_diario set proveedor = 'TRELLEBORG SEALING SOLUTIONS F' where componente = '319Z6301-501' and centro = '2002'`, (err, res) => {console.log(err, res)});
 client.query(`update zpp_cob_list_diario set proveedor = 'TRELLEBORG SEALING SOLUTIONS F' where componente = '319Z6301-502' and centro = '2002'`, (err, res) => {console.log(err, res)});
 client.query(`update zpp_cob_list_diario set proveedor = 'TRELLEBORG SEALING SOLUTIONS F' where componente = '319Z6401-501' and centro = '2002'`, (err, res) => {console.log(err, res)});
 client.query(`update zpp_cob_list_diario set proveedor = 'TRELLEBORG SEALING SOLUTIONS F' where componente = '319Z6401-502' and centro = '2002'`, (err, res) => {console.log(err, res)});
 client.query(`update zpp_cob_list_diario set proveedor = 'AIRBUS DEFENCE AND SPACE S.A.' where componente = '319Z7501-501' and centro = '2002'`, (err, res) => {console.log(err, res)});
 client.query(`update zpp_cob_list_diario set proveedor = 'AIRBUS DEFENCE AND SPACE S.A.' where componente = '319Z7501-502' and centro = '2002'`, (err, res) => {console.log(err, res)});

 //añadidos manuales
 client.query(`Update zpp_cob_list_diario
  Set añadido_manual = 'x'
  FROM cobertura_añadido
  WHERE zpp_cob_list_diario.concatenado = cobertura_añadido.concatenado`, (err, res) => {console.log(err, res)});


 //medimos la profucidad del atraso
 client.query(`Update zpp_cob_list_diario set dias_atraso = (f_subida - f_impacto)`, (err, res) => {console.log(err, res)});
 // actualizamos tipos de impacto
 client.query(`Update zpp_cob_list_diario
  set tipo_impacto = CASE
  WHEN f_subida >= zpp_cob_list_diario.f_logistica and f_subida < zpp_cob_list_diario.f_impacto THEN 'MISSING PART'
  WHEN f_subida >= zpp_cob_list_diario.f_impacto THEN 'BLACK PART'
  ELSE null
  End`, (err, res) => {console.log(err, res)});

 //' ahora actualizamos las fechas de confirmacion interna...
 client.query(`Update zpp_cob_list_diario
  Set f_confirmacion_schain = contestacion_zpp_cob_list.fecha,
  comentario_schain = contestacion_zpp_cob_list.comentario,
  confirmacion_interna = 'x',
  comentario_cp = contestacion_zpp_cob_list.comentario_cp
  FROM contestacion_zpp_cob_list
  WHERE zpp_cob_list_diario.concatenado_2 = contestacion_zpp_cob_list.concatenado`, (err, res) => {console.log(err, res)});


 //' loose items para 5BE -> 2007
 client.query(`Update zpp_cob_list_diario
  Set loose_item = '5BE'
  where centro = '2007' and pl_nec = '5BE' and rcp = 'B01'`, (err, res) => {console.log(err, res)});
 client.query(`Update zpp_cob_list_diario
  Set loose_item = '5BE'
  where centro = '2007' and pl_nec = '5BE' and rcp = 'B02'`, (err, res) => {console.log(err, res)});
 client.query(`Update zpp_cob_list_diario
  Set loose_item = '5BE'
  where centro = '2007' and pl_nec = '5BE' and rcp = 'B05'`, (err, res) => {console.log(err, res)});
 client.query(`Update zpp_cob_list_diario
  Set loose_item = '5BE'
  where centro = '2007' and pl_nec = '5BE' and rcp = 'B06'`, (err, res) => {console.log(err, res)});
 client.query(`Update zpp_cob_list_diario
  Set loose_item = '5BE'
  where centro = '2007' and pl_nec = '5BE' and rcp = 'BLF'`, (err, res) => {console.log(err, res)});

 // ahora insertamos la fecha de la supply supply_chain

 client.query(`update zpp_cob_list_diario
  set fecha_pedido = contestacion_schain.f_pedido,
  f_confirmacion_schain = contestacion_schain.f_confirmacion,
  comentario_schain = contestacion_schain.comentario_schain,
  pedido_posicion_cobertura = contestacion_schain.pedido_posicion,
  adherencia_cartera = contestacion_schain.adherencia_cartera
  from contestacion_schain
  where zpp_cob_list_diario.concatenado_2 = contestacion_schain.concatenado
  and zpp_cob_list_diario.centro_interno is null`, (err, res) => {console.log(err, res)});




 client.query(`insert into log_subida(tabla,ultima_actualizacion) values ('zpp_cob_list_diario',current_timestamp)`, (err, res) => {console.log(err, res)
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

};
