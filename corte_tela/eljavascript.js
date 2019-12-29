var formulario = document.querySelector('#formulario');
var boton = document.querySelector('#boton');
var resultado = document.querySelector('#resultado');
var datos = misdatos;

//resultado.innerHTML = ``;
const filtrar = () =>{

    const texto = formulario.value;
    //console.log(texto);
  
    for (let i = 0; i < datos.length; i++) {
        var element = datos[i].id;
        
        
        // si encuentra nuestra cadena que indica el fin
        if (texto.indexOf("blanco") > -1) {
            formulario.value = ''
            break;
        }

        //para todo lo demas...
        if (element == texto) {
            resultado.innerHTML = `<p>${datos[i].balda}</p>`;
            break;
        } else {
            resultado.innerHTML = ``;
            //break;
        }
        
    };

};   

formulario.addEventListener('keyup',filtrar)

filtrar();