var A = 0;
var B = 0;
//#region ================================= FIREBASE ==========================================
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

const score = doc(db, "Batluc/862004");

export function WriteScore(_a, _b) {
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

export async function GetScore() {
    const snapshot = await getDoc(score);
    if (snapshot.exists()) {
        var docData = snapshot.data();
        var _A = docData.A;
        var _B = docData.B;
        console.log("My data is: " + _A + ", " + _B);
        SetA(_A);
        SetB(_B);
    }
}
GetScore();

//#endregion

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

//ANIMATION
const animCardA = document.getElementById("card-A");
const animCardB = document.getElementById("card-B");

function SetUpCardStyle() { //Set Position of Card
    var rect1 = getRect(btnB);
    animCardB.style.top = String(rect1.top + rect1.h / 2) + "px";
    animCardB.style.right = String(rect1.left + (rect1.w / 2)) + "px";

    var rect2 = getRect(btnB);
    animCardA.style.top = String(rect2.top + rect2.h / 2) + "px";
    animCardA.style.left = String(rect2.left + (rect2.w / 2)) + "px";
}
SetUpCardStyle();

//#region  ===================================FUNCTIONS==========================================

var timeOutDuration = 1000;
btnA.addEventListener("click", function() {
    GiveA();
    DisableAllBtn();
    animCardB.style.animation = "anim-card-B " + timeOutDuration / 1000 + "s linear 0s 1 normal none";
    setTimeout(function() {
        EnableAllBtn();
        animCardB.style.animation = "";
    }, timeOutDuration);
});

btnB.addEventListener("click", function() {
    GiveB();
    DisableAllBtn();
    animCardA.style.animation = "anim-card-A " + timeOutDuration / 1000 + "s linear 0s 1 normal none";
    //SetUpCardStyle();
    setTimeout(function() {
        EnableAllBtn();
        animCardA.style.animation = "";
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


function GiveA() {
    A++;
    SetA(A);
}

function GiveB() {
    B++;
    SetB(B);
}

function UndoA() {
    A--;
    SetA(A);
}

function UndoB() {
    B--;
    SetB(B);
}

function UpdateScore() {
    SetA(A);
    SetB(B);
    WriteScore(A, B);
}


function SetA(_a) {
    A = _a;
    document.getElementById("disp-A").innerHTML = A;
    WriteScore(A, B);
}

function SetB(_b) {
    B = _b;
    document.getElementById("disp-B").innerHTML = B;
    WriteScore(A, B);
}

document.getElementById("reset").addEventListener("click", function() {
    A = 0;
    B = 0;
    UpdateScore();
});
//#endregion

//#region ==============================OTHER======================================
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

//Detect Window resize
window.addEventListener('resize', WindowResized);

function WindowResized() {
    SetUpCardStyle();
}

//#endregion