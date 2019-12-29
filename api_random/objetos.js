        
        
        var nombre = 'api/';
        var genero_traduccion = '';
        var contenido = document.querySelector('#contenido');
        function traer() {
            fetch('https://randomuser.me/' + nombre)
            .then(res => res.json())
            .then(data => {
                console.log(data.results['0']);

                //aplicamos bucle de traduccion
                if (data.results['0'].gender == 'male') {
                    console.log(data.results['0'].gender);
                    genero_traduccion = 'varon';
                } else {
                    console.log(data.results['0'].gender);
                    genero_traduccion = 'hembra';
                }
                contenido.innerHTML = `
                <img src="${data.results['0'].picture.large}" width="100px" class="img-fluid rounded-circle"> 
                <p>Nombre: ${data.results['0'].name.last}</p>
                <p>Genero: ${genero_traduccion}</p>
                `
            });
        } 
