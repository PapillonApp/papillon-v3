let backTitle = "";
let backHref = "";

let currentTitle = "";
let currentHref = "";
let currentMenuItem;

let q = "";

// changer de page
function view(href, title, prog) {
    $('#appContent').fadeOut(200);
    setTimeout(() => {
        $('#appContent').load("./views/" + href + ".html");
    $('#appContent').fadeIn(200);
    }, 200);

    $('#menuTabName').text(title);

    $('#menuTabContent').text(``);

    $('#back').css("display", "none");
    $('#menu-btn').css("display", "block");

    currentHref = href;
    currentTitle = title;

    dateChanged = false;

    if(href == "edt" || href == "hw") {
        $('.changeInMenu').fadeIn(200);
    }
    else {
        $('.changeInMenu').fadeOut(200);
    }

    if(!prog) {
        setTimeout(() => {
            closeMenu()
        }, 50);

        if(currentMenuItem) {
            currentMenuItem.classList.remove('active');
        }

        currentMenuItem = document.getElementById("menu_" + href);
        currentMenuItem.classList.add('active');
    }
}

// refresh
function allRefresh() {
    view(currentHref, currentTitle);
}

function back() {
    view(backLink);
}

function viewQuery(href, title, query, b1, b2, prog) {
    $('#appContent').load("./views/" + href + ".html");
    
    $('#menuTabName').addClass('aboutto');
    setTimeout(() => {
        $('#menuTabName').removeClass('aboutto');
        $('#menuTabName').css('display', 'none');
        $('#menuTabName').text(title);
        setTimeout(() => {
            $('#menuTabName').css('display', 'block');
        }, 50);
    }, 200);

    if(href == "edt" || href == "hw") {
        $('.changeInMenu').fadeIn(200);
    }
    else {
        $('.changeInMenu').fadeOut(200);
    }

    $('#menu-btn').css("display", "none");
    
    $('#menuTabContent').text(``);
    $('#back').css("display", "block");
    $('#back').removeClass("hideBack");

    q = query;

    backTitle = b1;
    backHref = b2;

    if(!prog) {
        closeMenu()
    }
}

function back() {
    view(backTitle, backHref);
}

function openMenu() {
    $('#menu').css("display", "flex");
}

function closeMenu() {
    $('#menu').addClass("close");
    setTimeout(() => {
        $('#menu').css("display", "none");
        $('#menu').removeClass("close");
    }, 200);
}

function closeMenuPanel() {
    if(dateChanged) {
        view(currentHref, currentTitle);
    }

    $('#menu').addClass("close");
    setTimeout(() => {
        $('#menu').css("display", "none");
        $('#menu').removeClass("close");
    }, 200);
}