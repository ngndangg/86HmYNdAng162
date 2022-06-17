/*
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
*/

var A = 0;
var B = 0;

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, doc, getDoc, getDocs, setDoc, collection } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyBGiNMXAnydUJe0nTIKdc9EpH9tXsvcoAU",
    authDomain: "batluc-ebf20.firebaseapp.com",
    // The value of `databaseURL` depends on the location of the database
    databaseURL: "https://DATABASE_NAME.firebaseio.com",
    projectId: "batluc-ebf20",
    storageBucket: "batluc-ebf20.appspot.com",
    //messagingSenderId: "SENDER_ID",
    //appId: "APP_ID",
    // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
    //measurementId: "G-MEASUREMENT_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

/*
//Read data
const querySnapshot = await getDocs(collection(db, "Main"));
querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
});
*/
const score = doc(db, "Batluc/862004");

function writeScore(_a, _b) {
    var content = {
        A: _a,
        B: _b
    };

    setDoc(score, content, { merge: true })
        .then(() => {
            console.log("Data written to firebase (", _a, ", ", _b, ")");
        })
        .catch((error) => {
            console.log('Got an ERROR!!! + ${error}');
        })
}

async function getScore() {
    const snapshot = await getDoc(score);
    if (snapshot.exists()) {
        var docData = snapshot.data();
        A = docData.A;
        B = docData.B;
        console.log("My data is: " + A + ", " + B);
        UpdateScore();
    }
}
getScore();

const btnA = document.getElementById("give-A");
const btnB = document.getElementById("give-B");
const btnC = document.getElementById("undo-A");
const btnD = document.getElementById("undo-B");

function DisableAllBtn() {
    btnA.disabled = true;
    btnB.disabled = true;
    btnC.disabled = true;
    btnD.disabled = true;
}

function EnableAllBtn() {
    btnA.disabled = false;
    btnB.disabled = false;
    btnC.disabled = false;
    btnD.disabled = false;
}

const anim1 = document.getElementById("box-1");
const anim2 = document.getElementById("box-2");

var timeOutDuration = 1000;
btnA.addEventListener("click", function() {
    GiveA();
    DisableAllBtn();
    anim2.style.animation = "anim-box-2 1s linear 0s 1 normal none";
    var rectTarget = getRect(btnB);
    anim2.style.top = String(rectTarget.top + rectTarget.h / 2) + "px";
    anim2.style.right = String(rectTarget.left + (rectTarget.w / 2)) + "px";
    setTimeout(function() {
        EnableAllBtn();
        anim2.style.animation = "";
    }, timeOutDuration);
});

btnB.addEventListener("click", function() {
    GiveB();
    DisableAllBtn();
    anim1.style.animation = "anim-box-1 1s linear 0s 1 normal none";
    var rectTarget = getRect(btnB);
    anim1.style.top = String(rectTarget.top + rectTarget.h / 2) + "px";
    anim1.style.left = String(rectTarget.left + (rectTarget.w / 2)) + "px";
    setTimeout(function() {
        EnableAllBtn();
        anim1.style.animation = "";
    }, timeOutDuration);
});
btnC.addEventListener("click", function() {
    UndoA();
    DisableAllBtn();
    setTimeout(function() { EnableAllBtn();; }, timeOutDuration);
});
btnD.addEventListener("click", function() {
    UndoB();
    DisableAllBtn();
    setTimeout(function() { EnableAllBtn(); }, timeOutDuration);
});

//ANIMATION
function AnimateCardBy(obj, target, alignLeft) {
    var rectObj = getRect(obj);
    var rectTarget = getRect(target);
    anim1.style.top = String(rectTarget.top + rectTarget.h / 2) + "px";
    if (alignLeft) {
        anim1.style.left = String(rectTarget.left + rectTarget.w / 2) + "px";
    } else {
        anim2.style.right = String(rectTarget.left + (rectTarget.w / 2)) + "px";
    }
}

//Functionalities

function GiveA() {
    A++;
    SetA();
}

function GiveB() {
    B++;
    SetB();
}

function UndoA() {
    A--;
    SetA();
}

function UndoB() {
    B--;
    SetB();
}

function UpdateScore() {
    SetA(A);
    SetB(B);
}

function SetA() {
    document.getElementById("disp-A").innerHTML = A;
    writeScore(A, B);
}

function SetB() {
    document.getElementById("disp-B").innerHTML = B;
    writeScore(A, B);
}

document.getElementById("reset").addEventListener("click", function() {
    A = 0;
    B = 0;
    UpdateScore();
});

//Toggle Button Cooldown
var initialDuration = timeOutDuration;
var timeoutcheckbox = document.getElementById("timeout");
timeoutcheckbox.addEventListener("change", function() { TimeOutToggle(); });

function TimeOutToggle() {
    if (timeoutcheckbox.checked == true) {
        timeOutDuration = initialDuration;
    } else {
        timeOutDuration = 0;
    }
    console.log(timeOutDuration);
}


//Get Absolute postion of element
function getRect(el) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        w: rect.width,
        h: rect.height,
    };
}