const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "API_KEY",
    authDomain: "batluc-ebf20.firebaseapp.com",
    // The value of `databaseURL` depends on the location of the database
    databaseURL: "https://DATABASE_NAME.firebaseio.com",
    projectId: "batluc-ebf20",
    storageBucket: "batluc-ebf20.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID",
    // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
    measurementId: "G-MEASUREMENT_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

//import { collection, addDoc } from "firebase/firestore"; 
import { collection, getDocs } from "firebase/firestore";

//Read data
const querySnapshot = await getDocs(collection(db, "Main"));
querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
});


A = 0;
B = 0;

filePath = "./score.txt"

url = "https://discord.com/api/webhooks/986318767728500736/mrYkTEh-OnAKfAgH9tXtHxFHqMzCeuivL_1Dt9A5zJogpl2WlBWNTxhbt1xP8hlmqzA6";

function GiveA() {
    A++;
    SetA(A);
}

function GiveB() {
    B++;
    SetB(B);
}

function SaveScore() {
    const request = new XMLHttpRequest();

    request.open("POST", url);

    request.setRequestHeader('Content-Type', 'application/json');

    const params = {
        avatar: " ",
        username: " ",
        //avatar_url: " ",
        content: ""
    }

    var textsend = A + "-" + B;
    params.content = "Current Score: A: " + A + " - B: " + B + " !";
    params.avatar = textsend;

    request.send(JSON.stringify(params));
    console.log("Sent: " + textsend);

}

function ReadScore() {
    const request = new XMLHttpRequest();
    request.open("GET", url, true);

    request.onload = function() {
        console.log(request.responseText);
        var raw = request.responseText.username;
        var AB = raw.split("-");
        A = AB[0];
        B = AB[1];
        UpdateScore();
    };

    request.send();
}

function UpdateScore() {
    SetA(A);
    SetB(B);
}

function SetA(amount) {
    document.getElementById("disp-A").innerHTML = amount;
}

function SetB(amount) {
    document.getElementById("disp-B").innerHTML = amount;
}