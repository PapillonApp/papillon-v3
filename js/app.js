// PWA
let standalone = false;

if (window.matchMedia('(display-mode: standalone)').matches) {
    standalone = true;
}

let deferredPrompt;window.addEventListener('beforeinstallprompt', (e) => {    e.preventDefault();   deferredPrompt = e;    showInstallPromotion();});

if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/js/sw.js');
};

// theme
if (localStorage.getItem('customFont') !== null) {
    $('body').css('--font', localStorage.getItem('customFont'));
}

let metaThemeColor = document.querySelector("meta[name=theme-color]");

function apply_theme_color() {
    let themeColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-color');
    metaThemeColor.setAttribute("content", themeColor);
}

apply_theme_color();

window
.matchMedia("(prefers-color-scheme: dark)")
.addEventListener("change", function (e) {
    apply_theme_color();
});

setInterval(function() {
        apply_theme_color();
}, 400)

// marks
let allMarks = [];

// progress
let progressInterval;

function progressStart(speed) {
    if(speed == undefined) {
        speed = 8;
    }
    
    clearInterval(progressInterval);
    $("#progressBarFill").css("opacity", "100%");
    $("#progressBarFill").css("width", "10%");

    current = 10;
    progressInterval = setInterval(() => {
        if(current < 80) {
            current += speed;
            $("#progressBarFill").css("width", current+"%");
        }
    }, 500);
}

function progressChange(value) {
    clearInterval(progressInterval);
    $("#progressBarFill").css("width", value+"%");
}

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

// date change
let rn = new Date();
let rn2 = new Date();

let dateChanged = false;
let dateChangedOnce = false;

let days = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
let months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

let rnPicker = document.getElementById("rn");

rnPicker.addEventListener("change", function(e) {
    rnPicker.value = event.target.value;
    console.log(event.target.valueAsDate);

    let rnE = event.target.valueAsDate;

    dateChanged = true;
    dateChangedOnce = true;

    updateRn(rnE);
});

function updateRn(rnE) {
    console.log(rnE);
    rn = rnE;
}

function pad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

function getRn(add, type) {
    workRn = rn;
    workRn.setDate(workRn.getDate() + add);

    let day = days[workRn.getDay()];
    let month = months[workRn.getMonth()];
    let date = workRn.getDate();
    let year = workRn.getFullYear();

    if(type == true) {
        return `${year}-${pad((workRn.getMonth() + 1), 2)}-${pad(date, 2)}`
    }
    else {
        return `${day} ${date} ${month} ${year}`;
    }
}

function updateTime() {
    rnPicker.value = getRn(0, true)
}

updateTime();

// login
let token;

if (localStorage.getItem('authData') === null) {
    window.location.href = 'login/';
}
else {
    token = localStorage.getItem('authToken');
    try{
        loadPronoteData();
    }
    catch(e) {
        alert("ERREUR [PronotePlusBetaError] : contactez @levraicnivtwelve sur insta si cette erreur persiste");
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'login/';
}

function refreshToken() {
    window.location.href = 'login/';
}

function update() {
    location.reload(true);
}

// load
let myName = "";
let avatar = "";

function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

let userEverything;

function loadPronoteData() {
    progressStart();
    $.get(`https://api.allorigins.win/get?url=${encodeURIComponent(`http://206.189.96.57:35500/user?token=${token}&rand=${uuidv4()}`)}`, function( data, success ) { 
      
            if(JSON.parse(data.contents).message !== undefined) {
                window.location.href = 'login/';
            }
            progressEnd();
        
            let resp = JSON.parse(data.contents).data.user;
            userEverything = resp;
    
            myNameStep = resp.name.split(" ");
            lastName = myNameStep.shift();
            firstName = myNameStep[0];
            myName = firstName + " " + lastName;
            
            if (localStorage.getItem('customName') !== null) {
                myName = localStorage.getItem('customName');
            }
    
            $('#userName').text(myName);
            $('#userClass').text(resp.studentClass.name + " – " + resp.establishmentsInfo[0].name);
            
            avatar = resp.avatar;
            if (localStorage.getItem('customPic') !== null) {
                avatar = localStorage.getItem('customPic');
            }
            $('#userAvatar').attr('src', avatar);
            $('#userModal').css('background-image', `url(${avatar})`);

            openApp();
        });
}

function changeName() {
    let newName = prompt("Entrez votre nouveau nom", myName);
    if(newName !== null) {
        localStorage.setItem('customName', newName);
        setTimeout(() => {
            update()
        }, 500);
    }
    mixpanel.track('Nom changé', {
      'source': "PronotePlus",
    });
}

function changePic() {
    var newPicInput = document.createElement('input');
    newPicInput.type = 'file';
    newPicInput.click();
    newPicInput.onchange = e => { 
        let file = e.target.files[0]; 

        let reader = new FileReader();
        let pic = reader.readAsDataURL(file);

        reader.addEventListener('load', (e) => {
            const data = e.target.result;
            alert(data);
            localStorage.setItem('customPic', data);
            setTimeout(() => {
                update()
            }, 500);
        })
    }
}

document.getElementById("userAvatar").onerror = function() {
    window.location.href = 'login/';
};

// text
function setMenuTabContent(text) {
    $('#menuTabContent').css('display', 'none');
    setTimeout(() => {
        $('#menuTabContent').css('display', 'block');
    }, 50);
    $('#menuTabContent').text(text);
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

let avr;
let avrClass;

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

function average() {
    document.getElementById("fanAverage").innerHTML = avr.toFixed(2);
    document.getElementById("fanAverageClass").innerHTML = avrClass.toFixed(1);
    document.getElementById("fanAverageEcart").innerHTML = (avr - avrClass).toFixed(1);
    
    animateValue(document.getElementById("fanAverage"), 0, avr, 3000);

    document.getElementById("average").style.display = "flex";
}

function averageClose() {
    document.getElementById("average").style.display = "none";
}

const ptr = PullToRefresh.init({
    mainElement: '#appContent',
    triggerElement : '#appContent',
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

// show edt first 
var latestVersion = localStorage.getItem('latestVersion')

const version = "3.4.2 beta";
const release = '3.4';

function openApp() {
    if(release !== latestVersion) {
        localStorage.setItem('latestVersion', release);
        view('update', 'Notes de mise à jour', true)
    }
    else {
        view('main', 'Accueil');
    }
}