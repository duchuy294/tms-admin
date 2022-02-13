/* eslint-disable  */
importScripts('https://www.gstatic.com/firebasejs/4.1.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.1.2/firebase-messaging.js');
const config = {
  messagingSenderId: '525087879543',
};
firebase.initializeApp(config);
const messaging = firebase.messaging();
