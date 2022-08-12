// PWA
let standalone = false;

if (window.matchMedia('(display-mode: standalone)').matches) {
    standalone = true;
}

// theme
if (localStorage.getItem('customTheme') !== null) {
    var head = document.getElementsByTagName('HEAD')[0];
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = localStorage.getItem('customTheme');
    head.appendChild(link);
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
let dateChanged = false;
let dateChangedOnce = false;

let days = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
let months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

function prev() {
    rn.setDate(rn.getDate() - 1);
    updateTime();
    dateChanged = true;
    dateChangedOnce = true;
}

function next() {
    rn.setDate(rn.getDate() + 1);
    updateTime();
    dateChanged = true;
    dateChangedOnce = true;
}

function getRn(add) {
    workRn = new Date(rn);
    workRn.setDate(workRn.getDate() + add);

    let day = days[workRn.getDay()];
    let month = months[workRn.getMonth()];
    let date = workRn.getDate();
    let year = workRn.getFullYear();
    let rnText = `${day} ${date} ${month} ${year}`;
    return rnText;
}

function updateTime() {
    $("#currentDate").text(getRn(0));
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
        mixpanel.track('Erreur fatale', {
          'source': "PronotePlus",
        });
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

function loadPronoteData() {
    progressStart();
    $.get(`https://api.allorigins.win/get?url=${encodeURIComponent(`http://206.189.96.57:35500/user?token=${token}&rand=${uuidv4()}`)}`, function( data, success ) { 
      
            if(JSON.parse(data.contents).message !== undefined) {
                window.location.href = 'login/';
            }
            progressEnd();
        
            let resp = JSON.parse(data.contents).data.user;
    
            myNameStep = resp.name.split(" ");
            lastName = myNameStep.shift();
            firstName = myNameStep[0];
            myName = firstName + " " + lastName;
            
            if (localStorage.getItem('customName') !== null) {
                myName = localStorage.getItem('customName');
            }
    
            $('#userName').text(myName);
            $('#userClass').text(resp.studentClass.name + " – " + resp.establishmentsInfo[0].name);
            
            mixpanel.track('Données chargées', {
              'source': "PronotePlus",
              'etablissement': resp.establishmentsInfo[0].name
            });
            
            avatar = resp.avatar;
            if (localStorage.getItem('customPic') !== null) {
                avatar = localStorage.getItem('customPic');
            }
            $('#userAvatar').attr('src', avatar);
            $('#userModal').css('background-image', `url(${avatar})`);
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

// show edt first 
view('edt', 'Emploi du temps', true)

var latestVersion = localStorage.getItem('latestVersion')

const version = "3.2 pre-release";
const release = '3.2';

if(release !== latestVersion) {
    localStorage.setItem('latestVersion', release);
    view('update', 'Notes de mise à jour', true)
}