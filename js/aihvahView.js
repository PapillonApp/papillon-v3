let backTitle = "";
let backHref = "";

let currentTitle = "";
let currentHref = "";

let q = "";

// changer de page
function view(href, title, prog) {
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

    $('#menuTabContent').text(``);

    $('#back').addClass("hideBack");
    setTimeout(() => {
        $('#back').css("display", "none");
    }, 200);

    currentHref = href;
    currentTitle = title;

    dateChanged = false;

    if(!prog) {
        closeMenu()
    }
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