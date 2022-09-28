import { GetThinh } from "./thinh.js";
//#region ================================= FIREBASE ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, doc, getDoc, getDocs, setDoc, collection } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

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
const timeGiven = doc(db, "Batluc/lastTimeGiven");
//#endregion

var D = 0;
var M = 0;

var Dtime = 0;
var Mtime = 0;

//#region //*=============== User Gender =========================
let gender = "";

//'gender' is set from device.js
export const SetGender = (val) => (gender = val);
//Timer is to wait for the gender to be set to apply changes based on gender
function TestGender(){
    GenderChanges(gender);
    if (gender != ""){ //If 'gender' is changed then kill the timer
        console.log("Device user is: " + gender);
        clearInterval(timer);
    }
}
let timer = setInterval(TestGender, 500); //Loop checking the 'gender'

function GenderChanges(g){
    if (g == "D"){
        giveBtn.innerHTML = "Cho thẻ Hoài Minh"
        document.getElementById("dev-ctn").style.display = "flex";
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
        r.style.setProperty('--var-color-1', '#dabcde');
        r.style.setProperty('--var-color-2', '#c293c7');
        r.style.setProperty('--var-text-color-1', '#ffffff');
    }
}

//#endregion

//#region //*=============== Score Funtions ========================
export function SaveScore(_d, _m) {
    //Score
    var s = {
        D: _d,
        M: _m
    };

    setDoc(score, s, { merge: true })
        .then(() => {
            console.log("Score saved to firebase (", _d, ", ", _m, ")");
        })
        .catch((error) => {
            console.log('Got an ERROR!!! + ${error}');
        })

}

export async function GetScore() {
    const _score = await getDoc(score);
    if (_score.exists()) {
        let s = _score.data();
        let _D = s.D;
        let _M = s.M;
        console.log("Retrieved score: D: " + _D + ", M: " + _M);
        D = _D;
        M = _M;
        DisplayScore(_D, _M);
    }
}
GetScore();

async function SaveTime(){
    //Time given
    var t = null;
    const date = new Date();
    if (gender == 'D'){
        Dtime = date.getTime();
        t = { D: Dtime};
    } else if (gender == 'M'){
        Mtime = date.getTime();
        t = { M: Mtime};
    }
    setDoc(timeGiven, t, { merge: true })
        .then(() => {
            console.log("Time saved to firebase (", Dtime, ", ", Mtime, ")");
        })
        .catch((error) => {
            console.log('Got an ERROR!!! + ${error}');
        })
}

async function GetTime() {
    const _timeGiven = await getDoc(timeGiven);
    if (_timeGiven.exists()) {
        let t = _timeGiven.data();
        let _Dtime = t.D;
        let _Mtime = t.M;
        console.log("Last time given is: D: " + _Dtime + ", M: " + _Mtime);
        Dtime = _Dtime;
        Mtime = _Mtime;
    }
}
GetTime();
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
//#region //*================== FUNCTIONS ==================================

var timeOutDuration = 1000;
giveBtn.addEventListener("click", function() {
    RecordTimeGiven();
    DisableAllBtn();
    //animCardB.style.animation = "anim-card-B " + timeOutDuration / 1000 + "s linear 0s 1 normal none";
    setTimeout(function() {
        EnableAllBtn();
        //animCardB.style.animation = "";
    }, timeOutDuration);
});
undoBtn.addEventListener("click", function() {
    UndoCard(gender);
    DisableAllBtn();
    setTimeout(function() { EnableAllBtn(); }, timeOutDuration);
});

window.GiveCard = GiveCard; //Expose to console
function GiveCard(g) {
    if (g == 'D')
        D++;
    else if (g == 'M')
        M++;
    DisplayScore(D, M);
    SaveScore(D, M);
    SaveTime();
}

window.UndoCard = UndoCard; //Expose to console
function UndoCard(g) {
    if (g == 'D')
        D--;
    else if (g == 'M')
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
    ResetScore();
});
window.ResetScore = ResetScore; //Expose to console
function ResetScore(){
    D = 0;
    M = 0;
    DisplayScore(D, M);
    SaveScore(D, M);
}
//!==================Time=================
var contClickCount = 0;
function RecordTimeGiven(){
    contClickCount++;
    const d = new Date();
    let curTime = d.getTime();
    let diff = 0; //Difference in milliseconds
    if (gender == 'D'){
        diff = curTime - Dtime;
    } else if (gender =='M'){
        diff = curTime - Mtime;
    }
    diff = diff / timeDigit.minute; //Difference in minutes

    if (diff < 1) {
        switch (contClickCount) {
            case 1:
                alert("Ô gì mà bất lực liên tục thế");
                break;
            case 2:
                alert("Bình tĩnh nào, có gì thì nói với nhau chứ");
                break;
            case 3:
                alert("Này nghiêm túc đấy à?");
                break;
            case 4:
                alert("Ok đành vậy :( (Đã đưa thẻ bất lực)");
                GiveCard(gender);
                break;
            case 5:
                alert("Ơ thôi mà, nhiều lắm rồi đấy");
            case 6:
                alert("Bất lực là không đủ sức làm, không làm gì được, “cậu nhỏ” bất lực tức là tình trạng dương vật không thể cư.... Ơ chết rồi copy nhầm định nghĩa ở trên mạng, kệ đi nhé");
            default:
                alert("Đây là 1 câu thính random để hạ hoả :\">: \n" + GetThinh());
                break;
        }
    } else {
        GiveCard(gender);
        contClickCount = 0;
    }
}

const timeDigit = {
    minute: 1000 * 60,
    hour: 1000 * 60 * 60,
    day: 1000 * 60 * 60 * 24,
    year: 1000 * 60 * 60 * 24 * 365
};
//#endregion

//#region //* ==============================OTHER======================================

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

