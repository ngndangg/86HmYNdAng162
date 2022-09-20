var D = 0;
var M = 0;
//#region ================================= FIREBASE ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, doc, getDoc, getDocs, setDoc, collection } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";



// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
export const firebaseConfig = {
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
export const db = getFirestore(app);

const score = doc(db, "Batluc/score");
//#endregion

//#region ==================== User Gender =========================
let gender = "";

//'gender' is set from device.js
export const SetGender = (val) => (gender = val);
//Timer is to wait for the gender to be set to apply changes based on gender
function TestGender(){
    console.log(gender);
    GenderChanges(gender);
    if (gender != ""){ //If 'gender' is changed then kill the timer
        clearInterval(timer);
    }
}
let timer = setInterval(TestGender, 500); //Loop checking the 'gender'

function GenderChanges(g){
    if (g == "D"){
        giveBtn.innerHTML = "Cho thẻ Hoài Minh"
    } else if (g == "M") {
        giveBtn.innerHTML = "Cho thẻ Đăng"
    }

    ChangeColor(g);
}

function ChangeColor(g){
    const r = document.querySelector(':root');
    if (g == "D"){
        r.style.setProperty('--var-color-1', '#83bae6');
        r.style.setProperty('--var-color-2', '#5e70ab');
        r.style.setProperty('--var-text-color-1', '#daecfb');
    } else if (g == "M") {
        r.style.setProperty('--var-color-2', '#A571A5');
        r.style.setProperty('--var-color-2', '#8B4E82');
        r.style.setProperty('--var-text-color-1', '#f5cdf2');
    }
}

//#endregion

//#region ==================== Score Funtions ========================
export function SaveScore(_d, _m) {
    var content = {
        D: _d,
        M: _m
    };

    setDoc(score, content, { merge: true })
        .then(() => {
            console.log("Score saved to firebase (", _d, ", ", _m, ")");
        })
        .catch((error) => {
            console.log('Got an ERROR!!! + ${error}');
        })
}

export async function GetScore() {
    const snapshot = await getDoc(score);
    if (snapshot.exists()) {
        let docData = snapshot.data();
        let _D = docData.D;
        let _M = docData.M;
        console.log("Retrieved score: D: " + _D + ", M: " + _M);
        UpdateScore(_D, _M);
    }
}
GetScore();
//#endregion

const giveBtn = document.getElementById("give-btn");
const undoBtn = document.getElementById("undo-btn");
const dispD = document.getElementById("disp-D");
const dispM = document.getElementById("disp-M");

function DisableAllBtn() {
    giveBtn.disabled = true;
    undoBtn.disabled = true;
}

function EnableAllBtn() {
    giveBtn.disabled = false;
    undoBtn.disabled = false;
}
/*
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
*/
//#region  ==========================FUNCTIONS=======================================

var timeOutDuration = 1000;
giveBtn.addEventListener("click", function() {
    GiveCard();
    DisableAllBtn();
    //animCardB.style.animation = "anim-card-B " + timeOutDuration / 1000 + "s linear 0s 1 normal none";
    setTimeout(function() {
        EnableAllBtn();
        //animCardB.style.animation = "";
    }, timeOutDuration);
});
undoBtn.addEventListener("click", function() {
    UndoCard();
    DisableAllBtn();
    setTimeout(function() { EnableAllBtn(); }, timeOutDuration);
});


function GiveCard() {
    if (gender == "D")
        D++;
    else if (gender == "M")
        M++;
    DisplayScore(D, M);
    SaveScore(D, M);
}

function UndoCard() {
    if (gender == "D")
        D--;
    else if (gender == "M")
        M--;
    DisplayScore(D, M);
    SaveScore(D, M);
}
/**
 * @description update current score
 * @param {*} _d Dang's score
 * @param {*} _m Minh's score
 */
function UpdateScore(_d, _m){
    D = _d;
    M = _m;
    DisplayScore(D, M);
    SaveScore(D, M);
}

function DisplayScore(_d, _m) {
    dispD.innerHTML = _d;
    dispM.innerHTML = _m;
}

document.getElementById("reset").addEventListener("click", function() {
    D = 0;
    M = 0;
    DisplayScore(D, M);
    SaveScore(D, M);
});
//#endregion

//#region ==============================OTHER======================================

//Toggle Button Cooldown
var initialDuration = timeOutDuration;
var timeoutcheckbox = document.getElementById("timeout");
timeoutcheckbox.addEventListener("change", function() { TimeOutToggle(); });

function TimeOutToggle() {
    if (timeoutcheckbox.checked) {
        timeOutDuration = initialDuration;
    } else {
        timeOutDuration = 0;
    }
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

