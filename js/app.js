let estadoHorno = 'apagado', videoHornoActual, puertaHorno, puertaBloqueada = false;

window.onload = () => {
    videoHornoActual = document.getElementById('video-horno');
    puertaHorno = document.getElementById('puerta-horno');

    puertaHorno.onclick = () => {
        if (!puertaBloqueada) {

           if (estadoHorno == 'tarta-lista') {
                estadoHorno = 'retirar-lista'; //al tocar la puerta, la tarta saldra lista.
           }    else if (estadoHorno == 'tarta-quemada') {
                estadoHorno = 'retirar-quemada';
           }

            avanzarAnimacion(); //cada vez que se pinche la puerta, lo que hara es que arranque la animacion.
        }
        
    }

    function avanzarAnimacion() { //evalua cada estado en el que se encuentre el horno y ejecuta ciertas acciones en base a esto.
        switch (estadoHorno) { //IF O ELSE GIGANTE, en base al valor que tenga el parametro 'KEY' que se le entregue hara diferentes cosas.
            case 'apagado':
                bloquearPuerta(true); //bloquear la puerta para evitar interacciones equivocadas
                reproducirSonido('puerta', false); //reproducir el sonido de la puerta abriendose, sin loopear.
                mostrarVideo(); //mostrar la etiqueta video.
                reproducirVideo('horno-abriendo-puerta'); //reproducir el video inicial.
                cuandoTerminaAvanzarA('cocinando'); //cambiar el estado a cocinando.
                break;
            
             case 'cocinando':
                reproducirVideo('horno-cocinando'); //reproduce video de tarta cocinandose
                reproducirSonido('timer', true); //reproduce sonido del timer
                cuandoTerminaAvanzarA('tarta-lista'); //cambia el estado a tarte-lista
                break;

            case 'tarta-lista' :
                detenerSonido(); //detiene el sonido del timer.
                bloquearPuerta(false); //desbloquear la puerta
                reproducirVideo('horno-tarta-lista'); //reproduce video de tarta lista
                reproducirSonido('campanita', false); //reproduce sonido de campanita.
                loopear(10000); //repite el video por cierto tiempo.
                cuandoTerminaAvanzarA('tarta-quemandose'); //cambia el estado a quemada
                break

            case 'tarta-quemandose':
                detenerSonido();
                bloquearPuerta(true); //bloquea la puerta
                reproducirVideo('horno-tarta-quemandose'); //reproduce el video de la tarta quemandose.
                cuandoTerminaAvanzarA('tarta-quemada'); //Avanza al sgte estado.
                break;

            case 'tarta-quemada' :
                bloquearPuerta(false);
                reproducirVideo('horno-tarta-quemada');
                loopear();
                break;

            case 'retirar-lista' :
                reproducirSonido('puerta-con-tarta', false);
                bloquearPuerta(true);
                reproducirVideo('horno-retirar-lista'); //reproducir video sacando tarta.
                reiniciar();
                break;

            case 'retirar-quemada' :
                reproducirSonido('puerta-con-tarta', false);
                bloquearPuerta(true);
                reproducirVideo('horno-retirar-quemada');
                reiniciar();
                break;
        }
    }

    let sonido;

    function reproducirSonido(nombreSonido, loopearSonido) {
        sonido = new Audio (`sound/${nombreSonido}.mp3`); //crea un nuevo objeto sonido con el nombre que le pasemos al parametro
        sonido.play();
        sonido.loop = loopearSonido; //true o false
    }

    function mostrarVideo() {
        videoHornoActual.classList.remove('hidden');
    }

    function ocultarVideo() {
        videoHornoActual.classList.add('hidden');
    }

    function reproducirVideo(nombreVideo) {
        videoHornoActual.src = `video/${nombreVideo}.webm`; //cambia el src por el video que se le pase
        videoHornoActual.play();
    }

    function actualizarEstadoA(estadoNuevo) {
        estadoHorno = estadoNuevo;
    }

    function cuandoTerminaAvanzarA(estadoNuevo) {
        videoHornoActual.onended = () => { //cuando el video ejecuta lo sgte
             actualizarEstadoA(estadoNuevo);
             avanzarAnimacion();
        }
    }

    function bloquearPuerta(traba) {
        puertaBloqueada = traba;
    }

    function detenerSonido() {
        sonido.pause();
    }

    function loopear(tiempo) {
       
        videoHornoActual.loop = true;

        if (tiempo !=undefined) { //si el tiempo ya esta definido.
            setTimeout(() => {
                desloopear(); //crea un timer para deloopear.
            }, tiempo); //que espere el tiempo que te pasaron.
        }
    }

    function desloopear() {
        videoHornoActual.loop = false;
    }

    function reiniciar() {
        desloopear();
        videoHornoActual.onended = () => {
            actualizarEstadoA('apagado');
            ocultarVideo();
            bloquearPuerta(false);
            rotarPerilla(0);
        }
    }

    const MAX_PLAYBACK_RATE = 16, MIN_PLAYBACK_RATE = 1;
    let perillaHorno = document.getElementById('perilla-horno'), rotacionPerilla = 0;
    perillaHorno.onmousewheel = (data) => {
        console.log(data.deltaY);
        if (estadoHorno == 'cocinando' || estadoHorno == 'tarta-lista') {
            cambiarTemperatura(data);
        }
    }

    function cambiarTemperatura(dataRecibida) {
        console.log('entro a funcion cambiar temperatura');
        if(dataRecibida.deltaY < 0 && videoHornoActual.playbackRate < MAX_PLAYBACK_RATE ) {
            console.log('rotacion a la derecha');
            rotarPerilla('derecha');
            videoHornoActual.playbackRate = videoHornoActual.playbackRate + 0.5; //acelera o desacelera el video dentro del rango posible.
        } else if(dataRecibida.deltaY < 0 && videoHornoActual.playbackRate > MIN_PLAYBACK_RATE) {
            rotarPerilla('izquierda');
            console.log('rotacion a la izquierda');
            videoHornoActual.playbackRate = videoHornoActual.playbackRate - 0.5;
        }
    }

    function rotarPerilla(direccion) {
        if (direccion == 'derecha') {
            rotacionPerilla = rotacionPerilla + 2.5;
        } else if (direccion == 'izquierda') {
            rotacionPerilla = rotacionPerilla - 2.5;
        } else
            rotacionPerilla = direccion; //se gira la cantidad que uno coloque.
    }
    perillaHorno.style.transform = `rotate(${rotacionPerilla}deg)`; //deg = grados.
}