import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase';

firebase.initializeApp({
    apiKey: "AIzaSyB0CvjPKzVET6u15NkDo7gd-H6xmKcbFAs",
    authDomain: "valdeztips.firebaseapp.com",
    databaseURL: "https://valdeztips.firebaseio.com",
    projectId: "valdeztips",
    storageBucket: "valdeztips.appspot.com",
    messagingSenderId: "191769276688",
    appId: "1:191769276688:web:86d38fd3ab6d3271d03595",
    measurementId: "G-WFVBN99M1Z"
  });
ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
