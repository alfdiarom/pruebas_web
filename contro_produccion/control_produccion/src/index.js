const cron = require ('node-cron') ;
const zpp_cob_list = require('./zpp_cob_list/routes/zpp_cob_list');
const zpp_ma_pa = require('./zpp_ma_pa/routes/zpp_ma_pa');
const zpp_ma_pd = require('./zpp_ma_pd/routes/zpp_ma_pd');
const zpp_necesidadesCargar = require('./zpp_necesidades/routes/parsearFichero');
const zpp_necesidadesBorrar = require('./zpp_necesidades/routes/borrarSemana');
const zva05_pventas = require('./zva05_pventas/routes/zva05_pventas');


//cron.schedule ( ' 24 4 * * * ' , ( ) => {
 //  zpp_cob_list.cargar();
//} ) ;

cron.schedule ( ' 16 07 * * * ' , ( ) => {
   zpp_ma_pa.cargar();

} ) ;

cron.schedule ( ' 18 07 * * * ' , ( ) => {
   zpp_ma_pd.cargar();
} ) ;


//cron.schedule ( ' 30 7 * * * ' , ( ) => {
//   zva05_pventas.cargar();
//} ) ;
