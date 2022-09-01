function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}


function loginGo(auto) {
    if(auto == true) {
        Toastify({
            text: "Reconnexion à Pronote...",
            gravity: "top",
            position: "center",
            className: "toasty",
            style: {
                background: "#0066FF",
            }
        }).showToast();
    }

    document.getElementById("login").classList.add("autologin");
    document.getElementById("loginBtn").innerHTML = "Connexion...";

    let url = document.getElementById("login_url").value;
    if(url === "other") {
        url = document.getElementById("urlCustom").value;
    }

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let cas = document.getElementById("ent").value;

    $.get(`https://api.allorigins.win/get?url=${encodeURIComponent(`http://206.189.96.57:35500/auth?url=${url}&username=${username}&password=${password}&cas=${cas}&rand=${uuidv4()}`)}`, function( data ) {
        let resp = JSON.parse(data.contents);
        if(resp.code == 3) {
            document.getElementById("loginBtn").classList.add("incorrect");
            setTimeout(() => {
                document.getElementById("loginBtn").classList.remove("incorrect");
            }, 300);

            document.getElementById("login").classList.remove("autologin");
            document.getElementById("loginBtn").innerHTML = "Se connecter";
            localStorage.removeItem("token");
            localStorage.removeItem("authData");
        }
        else if(resp.message !== undefined) {
            document.getElementById("loginBtn").classList.add("incorrect");
            setTimeout(() => {
                document.getElementById("loginBtn").classList.remove("incorrect");
            }, 300);

            document.getElementById("login").classList.remove("autologin");
            document.getElementById("loginBtn").innerHTML = "Se connecter";

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

            if(resp.message == "Wrong user credentials") {
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

            if(resp.message == "Missing 'url', or 'username', or 'password', or header 'Content-Type: application/json'") {
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
        }
        else if(resp.token !== undefined) {           
            localStorage.setItem('authToken', resp.token);

            let authData = [url, username, btoa(password), cas];
            localStorage.setItem('authData', JSON.stringify(authData));

            window.location.href = "../index.html";
        }
    });
}

function checkURL() {
    if(document.getElementById("login_url").value == "other") {
        document.getElementById("urlCustom").style.display = "block";
    }
    else {
        document.getElementById("urlCustom").style.display = "none";
    }
}

setTimeout(() => {
    if(localStorage.getItem('authData') !== undefined) {
        let auth = JSON.parse(localStorage.getItem('authData'));
        document.getElementById("username").value = auth[1];
        document.getElementById("password").value = atob(auth[2]);
        document.getElementById("urlCustom").value = auth[0];
        document.getElementById("login_url").value = "other";
        document.getElementById("ent").value = auth[3];
        loginGo(true);
    }
}, 150);