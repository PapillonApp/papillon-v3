// Vérifie qu'on tourne en tant que PWA
let standalone = false;

if (window.matchMedia('(display-mode: standalone)').matches) {
    standalone = true;
}

// Paramètres nécéssaires pour Chrome sur Android (jsp ce que c'est tbh)
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallPromotion();
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/js/sw.js');
};

// Vérifie qu'une font custom n'est pas appliquée
if (localStorage.getItem('customFont') !== null) {
    $('body').css('--font', localStorage.getItem('customFont'));
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

// Déclaration de la variable des notes
let allMarks = [];

// Barre de progression
let progressInterval;

// Démarre le chargement de la page
function progressStart(speed) {
    if (speed == undefined) {
        speed = 8;
    }

    clearInterval(progressInterval);
    $("#progressBarFill").css("opacity", "100%");
    $("#progressBarFill").css("width", "10%");

    current = 10;
    progressInterval = setInterval(() => {
        if (current < 80) {
            current += speed;
            $("#progressBarFill").css("width", current + "%");
        }
    }, 500);
}

// Change la valeur de la barre de progression
function progressChange(value) {
    clearInterval(progressInterval);
    $("#progressBarFill").css("width", value + "%");
}

// Termine + cache la barre de progression
function progressEnd() {
    clearInterval(progressInterval);
    $("#progressBarFill").css("width", "100%");
    setTimeout(() => {
        $("#progressBarFill").css("opacity", "0%");
    }, 400);
    setTimeout(() => {
        $("#progressBarFill").css("width", "0%");
    }, 600);
}

// Manipulation de la date et du temps
// Déclaration des timestamps
let rn = new Date();
let rn2 = new Date();

// Variables qui définissent si la date à été changée
let dateChanged = false;
let dateChangedOnce = false;

// Dictionnaire des noms de jours et de mois
let days = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
let months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

// #rn ou rnpicker est la référence du calendrier dans le menu
let rnPicker = document.getElementById("rn");

// Changer la date de la variable rn quand elle change dans le menu
rnPicker.addEventListener("change", function(e) {
    rnPicker.value = event.target.value;

    let rnE = event.target.valueAsDate;

    dateChanged = true;
    dateChangedOnce = true;

    updateRn(rnE);
    document.getElementById("dateString").innerText = getRn(0, false);
});

// Bouton suivant (pour la date)
function rnNext(a) {
    rn.setDate(rn.getDate() + 1);
    updateRn(rn);
    updateTime();
    dateChanged = true;
    dateChangedOnce = true;
    allRefresh();
}

// Bouton précédent (pour la date)
function rnPrev(a) {
    rn.setDate(rn.getDate() - 1);
    updateRn(rn);
    updateTime();
    dateChanged = true;
    dateChangedOnce = true;
    allRefresh();
}

// ça, je sais plus mais c'est utile
function updateRn(rnE) {
    rn = rnE;
}

// Fonction pour ajouter les 0 devant les nombres
function pad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

// Fonction qui retourne la date en une phrase
function getRn(add, type) {
    workRn = rn;
    workRn.setDate(workRn.getDate() + add);

    let day = days[workRn.getDay()];
    let month = months[workRn.getMonth()];
    let date = workRn.getDate();
    let year = workRn.getFullYear();

    if (type == true) {
        return `${year}-${pad((workRn.getMonth() + 1), 2)}-${pad(date, 2)}`
    } else {
        return `${day} ${date} ${month} ${year}`;
    }
}

// Fonction qui affiche la date dans l'interface
function updateTime() {
    rnPicker.value = getRn(0, true)
    document.getElementById("dateString").innerText = getRn(0, false);
}

// Affiche la date actuelle dans l'interface
updateTime();

// login
let token;

// Vérifie si on est connecté
if (localStorage.getItem('authData') === null) {
    // Si non, se connecter
    window.location.href = 'login/';
} else {
    token = localStorage.getItem('authToken');
    try {
        // Charge les données de l'utilisateur
        loadPronoteData();
    } catch (e) {
        alert("ERREUR [PronotePlusBetaError] : contactez @levraicnivtwelve sur insta si cette erreur persiste");
    }
}

// Déconnexion
function logout() {
    localStorage.clear();
    window.location.href = 'login/';
}

// Fonction qui recharge les données de l'utilisateur
function refreshToken() {
    tokenRefreshBkg();
}

// Vide le cache
function update() {
    location.reload(true);
}

// Charge les données de l'utilisateur
let myName = "";
let avatar = "";

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

let userEverything;

function loadPronoteData() {
    progressStart();
    $.get(`https://ams01.pronote.plus/user?token=${token}&rand=${uuidv4()}`, function(data, success) {

        // Si la requête fail, rafrachir le token
        if (JSON.parse(data).message !== undefined) {
            tokenRefreshBkg()
        }
        progressEnd();

        // Décode le JSON depuis l'API
        let resp = JSON.parse(data).data.user;
        userEverything = resp;

        // Récupère le prénom à partir des données de l'utilisateur
        myNameStep = resp.name.split(" ");
        lastName = myNameStep.shift();
        firstName = myNameStep[0];
        myName = firstName + " " + lastName;

        // Si l'utilisateur à changé de nom, on le met à jour
        if (localStorage.getItem('customName') !== null) {
            myName = localStorage.getItem('customName');
        }

        // Remplis l'interface
        $('#userName').text(myName);
        $('#userClass').text(resp.studentClass.name + " – " + resp.establishmentsInfo[0].name);

        // Si il n'y a pas d'avatar, mettre un placeholder
        if(userEverything.avatar == null) {
            avatar = "/assets/default.png";
        }

        avatar = resp.avatar;

        // appliquer la pdp de l'utilisateur
        if (localStorage.getItem('customPic') !== null) {
            avatar = localStorage.getItem('customPic');
        }

        $('#userAvatar').attr('src', avatar);
        $('#userModal').css('background-image', `url(${avatar})`);
    });
}

// pour passer dans le storage
function compressImage(src, newX) {
    return new Promise((res, rej) => {
        const img = new Image();

        img.src = src;
        img.onload = () => {
            let oriWidth = img.naturalWidth;
            let oriHeight = img.naturalHeight;

            let ratio = oriWidth / oriHeight;

            let newWidth = newX;
            let newHeight = newWidth / ratio;

            const elem = document.createElement('canvas');
            elem.width = newWidth;
            elem.height = newHeight;
            const ctx = elem.getContext('2d');
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            const data = ctx.canvas.toDataURL();
            res(data);
      }
      img.onerror = error => rej(error);
    })
  }

// Change le nom de l'utilisateur
function changeName() {
    let newName = prompt("Entrez votre nouveau nom", myName);
    if (newName !== null) {
        localStorage.setItem('customName', newName);
        setTimeout(() => {
            update()
        }, 500);
    }
    mixpanel.track('Nom changé', {
        'source': "PronotePlus",
    });
}

// Changer l'avatar de l'utilisateur
function changePic() {
    var newPicInput = document.createElement('input');
    newPicInput.type = 'file';
    newPicInput.click();
    newPicInput.onchange = e => {
        let file = e.target.files[0];

        let reader = new FileReader();
        let pic = reader.readAsDataURL(file);

        reader.addEventListener('load', async (e) => {
            const data = e.target.result;
            let downscaled = await compressImage(data, 200); 

            localStorage.setItem('customPic', downscaled);

            setTimeout(() => {
                update()
            }, 500);
        })
    }
}

// Changer le sous-titre de la page
function setMenuTabContent(text) {
    $('#menuTabContent').css('display', 'none');
    setTimeout(() => {
        $('#menuTabContent').css('display', 'block');
    }, 50);
    $('#menuTabContent').text(text);
}

// Formatte le texte pour l'HTML
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Déclaration moyenne et moyenne de classe
let avr;
let avrClass;

// Anime un nombre
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = (progress * (end - start) + start).toFixed(2);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Affiche l'UI de la moyene (non utilisé)
function average() {
    if (!isNaN(avr)) {
        document.getElementById("fanAverage").innerHTML = avr.toFixed(2);
        document.getElementById("fanAverageClass").innerHTML = avrClass.toFixed(1);
        document.getElementById("fanAverageEcart").innerHTML = (avr - avrClass).toFixed(1);

        animateValue(document.getElementById("fanAverage"), 0, avr, 3000);

        document.getElementById("average").style.display = "flex";
    } else {
        Toastify({
            text: "Vous n'avez pas de moyenne générale.",
            gravity: "top",
            position: "center",
            className: "toasty",
            style: {
                background: "#FF0000",
            }
        }).showToast();
    }
}

// Ferme cette même UI
function averageClose() {
    document.getElementById("average").style.display = "none";
}



// Tirer pour actualiser
const ptr = PullToRefresh.init({
    mainElement: '#appContent',
    triggerElement: '#appContent',
    instructionsPullToRefresh: 'Glissez pour actualiser',
    instructionsReleaseToRefresh: 'Relâchez pour actualiser',
    instructionsRefreshing: 'Obtention des données...',
    iconArrow: '<span class="material-symbols-outlined">autorenew</span>',
    iconRefreshing: '<span class="material-symbols-outlined">more_horiz</span>',
    onRefresh() {
        allRefresh();
    },
    shouldPullToRefresh() {
        return document.getElementById("appContent").scrollTop === 0;
    }
});

// Détecte les swipe pour ouvrir le menu
let touchstartX = 0
let touchendX = 0

function checkDirection() {
    // ->
    if (touchendX > touchstartX) {
        if (touchendX - touchstartX > 100) {
            openMenu();
        }
    }

    // <-
    if (touchendX < touchstartX) {
        if (touchstartX - touchendX > 100) {
            closeMenuPanel();
        }
    }
}

// enregistre les swipes dans les vues
document.getElementById('appContent').addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX
})

document.getElementById('appContent').addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX
    checkDirection()
})

// enregistre les swipes dans le menu
document.getElementById('menu').addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX
})

document.getElementById('menu').addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX
    checkDirection()
})

// background token refresh
function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

// Limite de 3 essais de connexion pour éviter de se faire ratelimit
tries = 0;
let triesReset;

function tokenRefreshBkg() {
    clearInterval(triesReset);

    let toastText = "Reconnexion à Pronote en arrière-plan...";

    if (tries > 0) {
        toastText = "Reconnexion à Pronote en arrière-plan... (essai " + (tries + 1) + "/3)";
    }

    // Récupère les données de login
    let auth = JSON.parse(localStorage.getItem('authData'));
    let authUsername = auth[1];
    let authPasswordUnsecure = atob(auth[2]);
    let authURL = auth[0];
    let authENT = auth[3];

    $.get(`https://ams01.pronote.plus/auth?url=${authURL}&username=${authUsername}&password=${authPasswordUnsecure}&cas=${authENT}&rand=${uuidv4()}`, function(data) {
        let resp = JSON.parse(data);

        tries++;

        if (resp.message !== undefined) {
            // Et là on a réussi à quand même se faire ratelimit, yay !
            if (resp.message == "Your IP address is temporarily banned because of too many failed authentication attempts") {
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
        } else if (resp.token !== undefined) {
            localStorage.setItem('authToken', resp.token);
            token = resp.token;
            allRefresh();
        }

        if (tries > 2) {
            // Login normal si trop d'essais
            window.location.href = "/login";
        }

        // Reset des essais après 1 minute
        triesReset = setInterval(function() {
            tries = 0;
        }, 60000);
    });
}

// Récupère la dernière version ouverte
var latestVersion = localStorage.getItem('latestVersion')

// Version de l'app
const version = "3.5.2 stable";
const release = '3.5';

// if (release !== latestVersion) {

// Fonction d'ouverture de l'app
function openApp() {
    if (release !== latestVersion) {
        // Changelog (pas utilisé pour le moment)
        localStorage.setItem('latestVersion', release);
        view('update', 'Notes de mise à jour', true)
    } else {
        // Ouvre l'emploi du temps
        view('edt', 'Emploi du temps');
    }
    dateString = document.getElementById("dateString").innerText
    buttonNext = document.getElementById("rnNext")
    if (dateString.includes("dimanche")) {
        // avance de 1 jour
        buttonNext.click()
    } else if (dateString.includes("samedi")) {
        // requête pour checker si y'a cours le samedi
        $.get(`https://ams01.pronote.plus/edt?token=${token}&from=${from}&rand=${uuidv4()}`, function( data ) {
            if(JSON.parse(data).data.timetable === null) {
                // avance de 2 jours
                buttonNext.click()
                buttonNext.click()
            }
        });
    }
}

// test
/* setTimeout(() => {
    document.getElementById("rn").value = "2021-09-02";
    document.getElementById("rn").dispatchEvent(new Event('change'));
    allRefresh()
}, 1500); */

// Lance cette fonction au chargement de la page
openApp();