let x = document.getElementById("stanza").offsetWidth; // salvo in variabile x larghezza area di gioco
let y = document.getElementById("stanza").offsetHeight; // salvo in variabile y altezza area di gioco

let key = [document.getElementById("nord"), document.getElementById("sud"), document.getElementById("est"), document.getElementById("ovest")]; // array con i quattro button

let sinistraGuard = Number(document.getElementById("guardia").style.left.replace("px", "")); // variabile che uso per ricalcolare left di guardia
let sopraGuard = Number(document.getElementById("guardia").style.top.replace("px", "")); // variabile che uso per ricalcolare top di guardia
let sinistraThief; // variabile che uso per ricalcolare left di ladro (la inizializzo più tardi)
let sopraThief; // variabile che uso per ricalcolare top di ladro (la inizializzo più tardi)

// array che contengono le posizioni originali di guardia e ladro
let posizioneOriginaleGuard = [document.getElementById("guardia").style.left, document.getElementById("guardia").style.top];
let posizioneOriginaleThief = [document.getElementById("ladro").style.left, document.getElementById("ladro").style.top];

let thiefMoved; // booleano per controllare che il ladro si sia mosso (lo inizializzo più tardi)
let contatoreMosse = 20; // per contare le mosse (conto alla rovescia)
let n_livello = 0; // per tenere conto di che livello stai giocando

window.addEventListener("load", nLevelUpdate); // aggiorna il display del numero del livello al caricamento della pagina

// aggiungo a ogni button un evento che richiama la funzione keyboard(), che si occupa degli input di movimento
key.forEach(function(clicked_key) {
    clicked_key.addEventListener("click", keyboard);
})
// la funzione viene chiamata anche dalla pressione dei tasti della tastiera dell'utente
document.addEventListener("keydown", keyboard);


function keyboard(freccia) { // funzione principale
    if ((freccia.keyCode == "37" || freccia.keyCode == "38" || freccia.keyCode == "39" || freccia.keyCode == "40") || (this.id == "nord" || this.id == "sud" || this.id == "est" || this.id == "ovest")) { // necessario inserire tutto in questo grosso if perché altrimenti il contenuto della funzione si avvia alla pressione di qualunque tasto della tastiera


////////// MOVIMENTI

        // faccio muovere guardia in base agli input dell'utente e ai limiti di movimento. ogni if controlla per l'input (che sia uno dei button o una delle frecce della tastiera) e per la lontananza dal bordo del div stanza, poi cambia top o left di guardia come necessario
        if ((this.id == "nord" || freccia.keyCode == "38") && sopraGuard !== 0) {
            document.getElementById("guardia").style.top = sopraGuard - 50 + "px";
            document.getElementById("guardia").style.backgroundImage = "url(img/back.gif)"; // in giro per il codice aggiorno la grafica di guardia e di ladro a seconda delle circostanze; guardia e ladro sono div vuoti e trasparenti che però hanno in HTML come attributo style="background-image: xxx" per settare la grafica. tutti i file grafici sono nella cartella img
        } else if ((this.id == "sud" || freccia.keyCode == "40") && sopraGuard !== (y - 64)) {
            document.getElementById("guardia").style.top = sopraGuard + 50 + "px";
            document.getElementById("guardia").style.backgroundImage = "url(img/front.gif)";
        } else if ((this.id == "est" || freccia.keyCode == "39") && sinistraGuard !== (x - 64)) {
            document.getElementById("guardia").style.left = sinistraGuard + 50 + "px";
            document.getElementById("guardia").style.backgroundImage = "url(img/right.gif)";
        } else if ((this.id == "ovest" || freccia.keyCode == "37") && sinistraGuard !== 0) {
            document.getElementById("guardia").style.left = sinistraGuard - 50 + "px";
            document.getElementById("guardia").style.backgroundImage = "url(img/left.gif)";
        }

        thiefMoved = false; // perché ladro deve ancora muoversi
        while(thiefMoved !== true) { // ciclo che continua finché la variabile thiefMoved non è true (ovvero finché il ladro non si è mosso)
            thiefMovement(); // funzione che si occupa del movimento del ladro; in realtà il codice che riguarda il movimento del ladro poteva anche essere direttamente inserito qua, ma così è un po' più ordinato
        }

        // sostanzialmente registro le attuali posizioni di guardia e ladro, dopo che si sono mossi (serve per verificare dopo se si sovrappongono o meno)
        sinistraGuard = Number(document.getElementById("guardia").style.left.replace("px", ""));
        sopraGuard = Number(document.getElementById("guardia").style.top.replace("px", ""));
        sinistraThief = Number(document.getElementById("ladro").style.left.replace("px", ""));
        sopraThief = Number(document.getElementById("ladro").style.top.replace("px", ""));

        contatoreMosse-- // mando avanti il conto alla rovescia delle mosse disponibili


////////// RISULTATI

        if (sinistraGuard == sinistraThief && sopraGuard == sopraThief) { // caso vittoria: le posizioni di guardia e ladro si sovrappongono
            
            // rimuovo gli eventi che chiamano keyboard(), per disabilitare il movimento.
            document.removeEventListener("keydown", keyboard);
            key.forEach(function(clicked_key) {
                clicked_key.removeEventListener("click", keyboard);
            })
            // subito dopo, aggiungo ai button la funzione levelChange, che ne gestisce un loro nuovo utilizzo
            key.forEach(function(clicked_key) {
                clicked_key.addEventListener("click", levelChange);
            })

            document.getElementById("sud").style.visibility = "hidden"; // nascondo il tasto "sud", in quanto le nuove funzionalità che voglio dai button sono solo 3 (nord: andare al prossimo livello; ovest: riavviare il livello corrente; est: riavviare il gioco)

            if (n_livello > 3) { // se l'utente ha vinto l'ultimo livello (quello con solo 12 mosse disponibili)...
                document.getElementById("esito").innerHTML = "<p>Moves: " + contatoreMosse + "</p><p style='color:lightgreen; font-weight:bold'>You won!<br /><br />GAME COMPLETED</strong></p>"; // nel corso del livello e alla fine di ogni livello bisogna aggiornare il contenuto del div esito con il numero delle mosse e l'eventuale messaggio di vittoria / sconfitta

                // nascondo tutti i button, perché il gioco è finito
                document.getElementById("sud").style.visibility = "visible";
                document.getElementById("nord").disabled = "true";
                document.getElementById("sud").disabled = "true";
                document.getElementById("est").disabled = "true";
                document.getElementById("ovest").disabled = "true";

                document.getElementById("guardia").style.backgroundImage = "url(img/win.png)";
                document.getElementById("ladro").style.backgroundImage = "url(img/thief_lose.png)";

            } else { // altrimenti, ovvero se non è la vittoria definitiva...
                document.getElementById("esito").innerHTML = "<p>Moves: " + contatoreMosse + "</p><p style='color:lightgreen; font-weight:bold'>You won!</strong></p>";

                // cambio i button visibili per renderli più consoni alla loro nuova funzionalità.
                document.getElementById("nord").innerText = "NEXT";
                document.getElementById("ovest").innerText = "RETRY";
                document.getElementById("est").innerText = "RESET";

                // in questo caso dato che l'utente ha vinto voglio che sia abilitato solo il tasto per andare al prossimo livello
                document.getElementById("ovest").disabled = true;
                document.getElementById("est").disabled = true;

                document.getElementById("guardia").style.backgroundImage = "url(img/win.png)";
                document.getElementById("ladro").style.backgroundImage = "url(img/thief_lose.png)";
                document.getElementById("nord").focus(); // metto il focus su "next"

            }

        } else if (contatoreMosse !== 0) { // caso in cui dopo i movimenti non c'è stata né vittoria né sconfitta, e dunque semplicemente aggiorno il contatore nel div esito
            document.getElementById("esito").innerHTML = "<p>Moves: " + contatoreMosse + "</p>";

        } else if (contatoreMosse == 0 || (contatoreMosse == 0 && (sinistraGuard !== sinistraThief && sopraGuard !== sopraThief))) { // caso sconfitta: l'utente ha finito le mosse e non c'è sovrapposizione tra guardia e ladro
            document.getElementById("esito").innerHTML = "<p>Moves: " + contatoreMosse + "</p><p style='color:red; font-weight:bold'>You lost!</strong></p>";

            // modifica degli eventi che chiamano le funzioni, come sopra
            document.removeEventListener("keydown", keyboard);
            key.forEach(function(clicked_key) {
                clicked_key.removeEventListener("click", keyboard);
            })
            key.forEach(function(clicked_key) {
                clicked_key.addEventListener("click", levelChange);
            })

            // modifica dei button
            document.getElementById("sud").style.visibility = "hidden";
            document.getElementById("nord").innerText = "NEXT";
            document.getElementById("ovest").innerText = "RETRY";
            document.getElementById("est").innerText = "RESET";
            // in questo caso dato che l'utente ha perso voglio che siano abilitati solo i tasti per riavviare il livello o riavviare il gioco
            document.getElementById("nord").disabled = true;

            document.getElementById("guardia").style.backgroundImage = "url(img/lose.png)";
            document.getElementById("ladro").style.backgroundImage = "url(img/thief_win.gif)";
            document.getElementById("ovest").focus(); // metto il focus su "retry"

        }

    }
    
}


////////// MOVIMENTO LADRO

function thiefMovement() { // funzione del movimento del ladro

    sinistraThief = Number(document.getElementById("ladro").style.left.replace("px", ""));
    sopraThief = Number(document.getElementById("ladro").style.top.replace("px", ""));

    let n_random = Math.floor(Math.random()*4); // estrazione casuale di un numero da 0 a 3, per la decisione della direzione da prendere

    if (n_random == 0 && sopraThief !== 0) { // ogni if controlla per il numero estratto e per la lontananza dal bordo del div stanza, poi cambia top o left di ladro come necessario
        document.getElementById("ladro").style.top = sopraThief - 50 + "px";
        thiefMoved = true; // per registrare che il ladro si è mosso con successo
    } else if (n_random == 1 && sopraThief !== (y - 64)) {
        document.getElementById("ladro").style.top = sopraThief + 50 + "px";
        thiefMoved = true;
    } else if (n_random == 2 && sinistraThief !== (x - 64)) {
        document.getElementById("ladro").style.left = sinistraThief + 50 + "px";
        thiefMoved = true;
    } else if (n_random == 3 && sinistraThief !== 0) {
        document.getElementById("ladro").style.left = sinistraThief - 50 + "px";
        thiefMoved = true;
    }
}


////////// TASTI DI FINE LIVELLO

function levelChange() { // funzione dei button modificati (nord: andare al prossimo livello; ovest: riavviare il livello corrente; est: riavviare il gioco)

    // ripristino gli eventi originali che chiamano keyboard() (per ripristinare il movimento), e disabilito l'evento che chiama questa funzione (per rimuovere questa nuova funzionalità dei button)
    key.forEach(function(clicked_key) {
        clicked_key.removeEventListener("click", levelChange);
    })
    key.forEach(function(clicked_key) {
        clicked_key.addEventListener("click", keyboard);
    })
    document.addEventListener("keydown", keyboard);

    // ripristino i button così com'erano all'inizio e li riabilito
    document.getElementById("nord").innerText = "↑";
    document.getElementById("ovest").innerText = "<-";
    document.getElementById("est").innerText = "->";
    document.getElementById("sud").style.visibility = "visible";
    document.getElementById("nord").disabled = false;
    document.getElementById("ovest").disabled = false;
    document.getElementById("est").disabled = false;
    
    // switch che controlla quale button è stato premuto
    switch(this.id) {
        case "nord": // "NEXT"
            alert("Next level."); // avviso per l'utente
            n_livello++; // aumenta il contatore dei livelli
            contatoreMosse = 20 - n_livello*2; // ripristina il contatore delle mosse (scala in base al numero del livello corrente)
            riposiziona(); // avvio la funzione che si occupa di riposizionare guardia e ladro
            break;
        case "ovest": // "RETRY"
            alert("Restarting level.");
            contatoreMosse = 20 - n_livello*2;
            riposiziona();
            break;
        case "est": // "RESET"
            alert("Resetting the game.");
            riposiziona();
            n_livello = 0; // l'utente ha riavviato tutto il gioco, quindi si riparte dal primo livello (livello 0)
            contatoreMosse = 20; // si riporta il contatore delle mosse al valore originale (20)
            break;
        default: // caso a regola impossibile, perché il button sud è stato nascosto
            alert("ERROR: Something went wrong!");
            break;
    }
    document.getElementById("esito").innerHTML = "<p>Moves: " + contatoreMosse + "</p>"; // riaggiorna il contatore delle mosse nel div esito

    document.getElementById("guardia").style.backgroundImage = "url(img/front.gif)";
    document.getElementById("ladro").style.backgroundImage = "url(img/thief.gif)";

    nLevelUpdate(); // aggiorno il display del numero di livello
    document.activeElement.blur(); // tolgo il focus dai tasti

}


////////// RIPOSIZIONAMENTO DI GUARDIA & LADRO

function riposiziona() { // funzione che riposiziona guardia e ladro nella loro posizione originale

    // ripristino i valori originali di left e top, che ho salvato all'inizio
    document.getElementById("guardia").style.left = posizioneOriginaleGuard[0];
    document.getElementById("guardia").style.top = posizioneOriginaleGuard[1];
    document.getElementById("ladro").style.left = posizioneOriginaleThief[0];
    document.getElementById("ladro").style.top = posizioneOriginaleThief[1];

    // sostanzialmente registro le attuali posizione di guardia e ladro, per i calcoli legati agli spostamenti
    sinistraGuard = Number(posizioneOriginaleGuard[0].replace("px", ""));
    sopraGuard = Number(posizioneOriginaleGuard[1].replace("px", ""));
    sinistraThief = Number(posizioneOriginaleThief[0].replace("px", ""));
    sopraThief = Number(posizioneOriginaleThief[1].replace("px", ""));
}


////////// DISPLAY NUMERO DI LIVELLO

function nLevelUpdate() {
    document.getElementById("stanza_caption").innerHTML = "GAME LEVEL " + (n_livello + 1); // modifico <figcaption> dell'HTML
}


////////// MUSICA

window.onload = setInterval(audioLoop, 500); // setto un intervallo al caricamento della pagina in modo che ogni tot ci sia un controllo della musica (NOTA: per come sono i browser moderni, la musica non partirà finché l'utente non interagisce con la pagina)

let backgroundAudio = new Audio("background-music.mp3"); // ho cercato online come fare per gestire musica via HTML & JS e questa mi sembrava la soluzione migliore

function audioLoop() { // funzione per la musica di sfondo
    if (backgroundAudio.paused == true) { // essenzialmente se vede che l'audio è fermo, lo riavvia
        backgroundAudio.play(); // avvia l'audio
    }
}