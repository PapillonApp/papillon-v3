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
        $('body').removeClass("useless");
    }
    else {
        $('body').addClass("useless");
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

// open extension tab
function viewExt(href, title, prog) {
    $('#appContent').fadeOut(200);
    setTimeout(() => {
        $('#appContent').load(href);
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
        $('body').removeClass("useless");
    }
    else {
        $('body').addClass("useless");
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
    view(currentHref, currentTitle, true);
}

function back() {
    view(backLink);
}

function viewQuery(href, title, query, b1, b2, prog) {
    $('#appContent').fadeOut(200);
    setTimeout(() => {
        $('#appContent').load("./views/" + href + ".html");
    $('#appContent').fadeIn(200);
    }, 200);

    setTimeout(() => {
        $('#pronoteApp').removeClass("openLayer");
    }, 200);
    
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
        $('body').removeClass("useless");
    }
    else {
        $('body').addClass("useless");
    }

    $('#menu-btn').fadeOut(100);
    
    $('#menuTabContent').text(``);
    
    setTimeout(() => {
        $('#back').fadeIn(100);
        $('#back').removeClass("hideBack");
    }, 100);

    q = query;

    backTitle = currentTitle;
    backHref = currentHref;

    currentTitle = title;
    currentHref = href;

    if(!prog) {
        closeMenu()
    }
}

function back() {
    view(backHref, backTitle);
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