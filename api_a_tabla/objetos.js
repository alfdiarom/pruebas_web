var contenido = document.querySelector('#contenido');
var datos = misdatos;


        function traer() {
            // fetch(misdatos)
            //     .then(res => res.json())
            //     .then(datos => {
                    //console.log(datos)
                    tabla(datos);
                }
        

        function tabla(datos) {
            // console.log(datos)
            contenido.innerHTML = ''
            for(let valor of datos){
                // console.log(valor.nombre)
                contenido.innerHTML += `
                
                <tr>
                    <th scope="row">${ valor.OPEA }</th>
                    <td>${ valor.nombre }</td>
                    <td>${ valor.email }</td>
                    <td>${ valor.estado ? "Activo" : "Eliminado" }</td>
                </tr>
                
                `
            }
        };