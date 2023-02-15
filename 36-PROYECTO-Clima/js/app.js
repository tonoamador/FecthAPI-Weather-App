const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load',()=>{
    formulario.addEventListener('submit',buscarClima);
})

function buscarClima(e) {
    e.preventDefault();

    //Validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if(ciudad==='' || pais===''){
        //Hubo un error
        mostrarError('Ambos campos son obligatorios');
        return;
    }

    //Consultar la API

    consultarAPI(ciudad,pais);
}

function mostrarError(mensaje){
    const alerta = document.querySelector('.bg-red-100');

    if(!alerta){
        
        const alerta = document.createElement('div');
        alerta.classList.add('bg-red-100','border-red-400','text-red-700','px-4','py-3','rounded','max-w-md','mx-auto','mt-6','text-center');
    
        alerta.innerHTML = `
            <strong class='font-bold'>Error!</strong>
            <span class='block'>${mensaje}</span>
        `
    
        container.appendChild(alerta)

        setTimeout(() => {
            alerta.remove();
        }, 5000);
    }
}

const kelvinACentigrados = grados => parseInt(grados-273.15);

function consultarAPI(ciudad,pais) {
    const appId = "171b7e8c667a835d8a72930ce3ef51f0";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`


    spinner();
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {

            limpiarHTML();
            if(datos.cod==="404"){
                mostrarError("Ciudad no encontrada")       
                return;
            }

            //Imprime la respuesta en el HTML
            mostrarClima(datos);
            console.log(datos);
        })
}

function mostrarClima(datos) {
    const {name,main: {temp,temp_max,temp_min }} = datos;
    
    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add('font-bold','text-2xl')

    const actual = document.createElement('p');
    actual.innerHTML = `Temperatura Actual: ${centigrados} &#8451;`;
    actual.classList.add('font-bold','text-6xl');

    const tempMax = document.createElement('p');
    tempMax.innerHTML = `Temperatura Máxima: ${max} &#8451;`;
    tempMax.classList.add('font-bold','text-xl');

    const tempMin = document.createElement('p');
    tempMin.innerHTML = `Temperatura Mínima: ${min} &#8451;`;
    tempMin.classList.add('font-bold','text-xl');


    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center','text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMax);
    resultadoDiv.appendChild(tempMin);



    resultado.appendChild(resultadoDiv);
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

function spinner() {

    limpiarHTML();
    
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');
    divSpinner.innerHTML = `
    <div class="bounce1"></div>
  <div class="bounce2"></div>
  <div class="bounce3"></div>
    `;
    
    resultado.appendChild(divSpinner);
}