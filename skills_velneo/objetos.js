        
        
        //var nombre = 'api/';
        var genero_traduccion = '';
        var id_empleado = '';

        var contenido = document.querySelector('#contenido');


   
        function traer() {
            fetch('http://vmodapache.sev.alestis:81/polaris/vERP_2_dat_dat/v1/_process/skill_api_rev2?param[cod_emp]=' + id_empleado + '&api_key=Sixphere_18&')
            .then(res => res.json())
            .then(data => {
                console.log(data.Usuarios['0']);
             
     
                //aplicamos bucle de traduccion
                // if (data.results['0'].gender == 'male') {
                //     console.log(data.results['0'].gender);
                //     genero_traduccion = 'varon';
                // } else {
                //     console.log(data.results['0'].gender);
                //     genero_traduccion = 'hembra';
                // }
                contenido.innerHTML = `
                <img src="${data.Usuarios['0'].foto}" width="100px" class="img-fluid rounded-circle"> 
                <p>${data.Usuarios['0'].empleado}</p>
                <p>${data.Usuarios['0'].mo_tipo}</p>
                <p>${data.Usuarios['0'].puesto}</p>
                <p>${data.Usuarios['0'].skills}</p>
                `
            });
        } 
