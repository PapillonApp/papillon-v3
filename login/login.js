function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

let currentENT = "";
let currentURL = "";

function loginGo(auto) {
    if(auto == true) {
        nextStep("#autologin");
    }

    document.getElementById("mainLoginBtn").innerHTML = "Connexion en cours...";

    let url = currentURL;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let cas = currentENT[0];

    $.get(`https://ams01.pronote.plus/auth?url=${url}&username=${username}&password=${password}&cas=${cas}&rand=${uuidv4()}`, function( data ) {
        let resp = JSON.parse(data);
        if(resp.code == 3) {
            localStorage.removeItem("token");
            localStorage.removeItem("authData");
        }

        else if(resp.message !== undefined) {
            document.getElementById("mainLoginBtn").innerHTML = "Se connecter";

            if(resp.message == "The instance is closed, try again later") {
                Toastify({
                    text: "Pronote n'est pas encore ouvert dans votre établissement, veuillez réessayer ultérieurement.",
                    gravity: "top",
                    position: "center",
                    className: "toasty",
                    style: {
                        background: "#FF0000",
                    }
                }).showToast();
            }
            else if(resp.message == "Your IP address is temporarily banned because of too many failed authentication attempts") {
                Toastify({
                    text: "Pronote+ est momentanément exclu de votre établissement à cause d'essais incorrects. Veuillez réessayer dans quelques minutes.",
                    gravity: "top",
                    position: "center",
                    className: "toasty",
                    style: {
                        background: "#FF0000",
                    }
                }).showToast();
            }
            else if(resp.message == "Wrong user credentials") {
                Toastify({
                    text: "Identifiant ou mot de passe incorrect.",
                    gravity: "top",
                    position: "center",
                    className: "toasty",
                    style: {
                        background: "#FF0000",
                    }
                }).showToast();
            }
            else if(resp.message == "Missing 'url', or 'username', or 'password', or header 'Content-Type: application/json'") {
                Toastify({
                    text: "Veuillez remplir tous les champs.",
                    gravity: "top",
                    position: "center",
                    className: "toasty",
                    style: {
                        background: "#FF0000",
                    }
                }).showToast();
            }
            else {
                Toastify({
                    text: resp.message,
                    gravity: "top",
                    position: "center",
                    className: "toasty",
                    style: {
                        background: "#FF0000",
                    }
                }).showToast();
            }
        }
        else if(resp.token !== undefined) {           
            localStorage.setItem('authToken', resp.token);

            let authData = [url, username, btoa(password), cas];
            localStorage.setItem('authData', JSON.stringify(authData));

            window.location.href = "../index.html";
        }
        else {
            document.getElementById("mainLoginBtn").innerHTML = "Se connecter";
            Toastify({
                text: "Une erreur s'est produite :/ (" + resp.message + ")",
                gravity: "top",
                position: "center",
                className: "toasty",
                style: {
                    background: "#FF0000",
                }
            }).showToast();
        }
    });
}

// update avec les étapes

let currentStep = "#mainStep";
function nextStep(newStep) {
    $(currentStep).fadeOut(150);
    setTimeout(() => {
        $(newStep).css("display", "flex").hide().fadeIn(150);
        currentStep = newStep;
    }, 150);
}

function step_stepQR() {
    nextStep("#stepQR");

    function onScanSuccess(decodedText, decodedResult) {
        console.log(JSON.parse(decodedText).url);
        if(JSON.parse(decodedText).url.endsWith("/pronote/mobile.eleve.html")) {
            setTimeout(() => {
                setTimeout(() => {
                    html5QrcodeScanner.clear();
                }, 150);
                step_checkQR(decodedText);
            }, 200);
        }
    }
      
    function onScanFailure(error) {
        
    }
      
    let html5QrcodeScanner = new Html5QrcodeScanner(
        "reader", { facingMode: "environment" },
        {
            fps: 10,
            qrbox: {
                width: 250,
                height: 250
            },
        },
        /* verbose= */ false);
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
}

function step_checkQR(text) {
    nextStep("#checkQR");

    let loginData = JSON.parse(text);
    $("#foundURL").text(loginData.url);
    currentURL = loginData.url;

    currentENT = detectENT(loginData.url);
    $("#foundENT").text(currentENT[1]);

    if(currentENT == null) {
        nextStep("#setENT");
    }
}

function step_checkURL(text) {
    nextStep("#checkQR");

    $("#foundURL").text(text);
    currentURL = text;

    currentENT = detectENT(text);
    $("#foundENT").text(currentENT[1]);

    if(currentENT == null) {
        nextStep("#setENT");
    }
}

function detectENT(url) {
    let entDomain = new URL(url).hostname;
    entDomain = entDomain.split(".")[entDomain.split(".").length - 2] + "." + entDomain.split(".")[entDomain.split(".").length - 1];
    
    switch(entDomain) {
        case "index-education.net":
            return ["none", "Pas d'ENT"];
            break;
        case "toutatice.fr":
            return ["toutatice", "Académie de Rennes"];
            break;
        default: 
            return ["none", "Pas d'ENT"];
            break;
    }
}

function reopenCheck() {
    nextStep("#checkQR");
    $("#foundURL").text(currentURL);
    $("#foundENT").text(currentENT[1]);
}

function changeENT(a, b) {
    currentENT = [a, b];

    reopenCheck();
}

function step_setENT() {
    nextStep("#setENT")
    $("#entList").html("");

    let allENT;
    $.get("ent_list.json", function( data ) {
        allENT = data;

        for(ent in allENT) {
            let entData = allENT[ent];

            $("#entList").append(`
                <div class="option" onclick="changeENT('${entData.cas}', '${entData.name}')">
                    <span class="material-symbols-outlined">
                        school
                    </span>
                    <div>
                        <h3>${entData.name}</h3>
                        <p>${entData.url}</p>
                    </div>
                </div>
            `);
        }
    });
}

function step_findEtab() {
    nextStep("#setEtab")
    $("#etabList").html("");

    let allENT;
    $.get("etab_list.json", function( data ) {
        allENT = data;

        for(ent in allENT) {
            let entData = allENT[ent];

            $("#etabList").append(`
                <div class="option" onclick="step_checkURL('${entData.url}')">
                    <span class="material-symbols-outlined">
                        school
                    </span>
                    <div>
                        <h3>${entData.name}</h3>
                        <p>${entData.city}</p>
                    </div>
                </div>
            `);
        }
    });
}

function step_setURL() {
    nextStep("#loginURL");
}

function setURLLogin() {
    step_checkURL(document.getElementById("url").value);
}

function step_login() {
    nextStep("#loginFull");
};

// autologin
if (localStorage.getItem("authData") !== null) {
    let authData = JSON.parse(localStorage.getItem('authData'));
    let url = authData[0];
    let username = authData[1];
    let password = atob(authData[2]);
    let cas = authData[3];

    setTimeout(() => {
        currentENT = [cas, "Précédente connexion"];
        currentURL = url;
        document.getElementById("username").value = username;
        document.getElementById("password").value = password;

        loginGo(true)
    }, 200);
}

// Change la couleur de la statusbar selon le darkmode
let metaThemeColor = document.querySelector("meta[name=theme-color]");

function apply_theme_color() {
    let themeColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-color');
    metaThemeColor.setAttribute("content", themeColor);
}

apply_theme_color();

// Vérifie toutes les 400ms si le darkmode est activé
window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", function(e) {
        apply_theme_color();
    });

setInterval(function() {
    apply_theme_color();
}, 400)