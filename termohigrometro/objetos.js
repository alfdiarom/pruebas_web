   
        var contenido = document.querySelector('#contenido');
        var fecha = document.querySelector('#fecha');
        var parseo = "";
     
        


         function traer() {
            fetch('http://adn-iot-des.sev.alestis:8080/api/v1/lufts?filter[order]=TS_EXPORT%20DESC&filter[limit]=1')
            .then(res => res.json())
            .then(data => {
                console.log(data[0].CMVID_9_100_VAL);
                console.log(data[0].CMVID_9_200_VAL);
                
                //parseamos fecha y hora, viene en el formato ISO...
                var fechahora = data[0].CMVID_9_100_TS;
                mi_datetime = fechahora.split('T');
                
                f1 = mi_datetime[0];
                h1 = mi_datetime[1].slice(0,5);
                // fin parseo
                
       
                contenido.innerHTML = `
                <p>${data[0].CMVID_9_100_VAL} ºC</p>
                <p>${data[0].CMVID_9_200_VAL} %</p>
                `

                fecha.innerHTML = `
                <p>${f1}  ${h1}</p>
                `

            });

            
        } 

    