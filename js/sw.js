self.addEventListener('install', (e) => {
    console.log('[Service Worker] Installation');
});

var cacheName = 'papillon';
var appShellFiles = [
    '/index.html',
    '/manifest.webmanifest',
    '/css/main.css',
    '/js/app.js',
    '/js/aihvahView.js',
    '/js/jquery.js',
    '/js/sw.js',
    '/views/edt.html',
    '/views/user.html',
    '/views/about.html',
];
