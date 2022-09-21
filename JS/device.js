import { db, SetGender } from "./scoring.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

export var thisId = "";

var deviceIds = doc(db, "Batluc/deviceIds");

export var deviceGender = "";
var deviceOS = "";

//#region //*========== Communicating with FIREBASE ==================

/**
 * @description Get Ids from database and split into array
 * @return {Promise} Needs "await" to return the value
 */
async function GetDeviceIdsArray() {
    const snapshot = await getDoc(deviceIds);
    if (snapshot.exists()) {
        var docData = snapshot.data();
        var _ids = docData.ids.toString();
        var array = _ids.split(";");
        return array;
    }
}

/**
 * @description Get Ids from database as a single string
 * @return {Promise} Needs "await" to return the value
 */
async function GetDeviceIdsString() {
    const snapshot = await getDoc(deviceIds);
    if (snapshot.exists()) {
        var docData = snapshot.data();
        var _ids = docData.ids;
        return _ids;
    } else {
        return "";
    }
}


/**
 * @description Save an device id to DB by appending the id to a string
 * @param {number} _id id to write to DB 
 */
function SaveDeviceIds(_id) {
    let oldIds = savedString;
    let str = ""
        //Add id to string
    if (oldIds == "") {
        str = _id;
    } else {
        str = oldIds + ";" + _id;
    }

    let content = {
        ids: str
    };

    setDoc(deviceIds, content, { merge: true })
        .then(() => {
            console.log("New id saved (" + _id + ")");
        })
        .catch((error) => {
            console.log('Got an ERROR!!! + ${error}');
        })
}


/**
 * @description Replace current saved string of ids with new string
 * @param {number} str string to overwrite DB
 */
 function UpdateDeviceIds(str) {

    let content = {
        ids: str
    };

    setDoc(deviceIds, content, { merge: true })
        .then(() => {
            console.log("ID string written: "+ str);
        })
        .catch((error) => {
            console.log('Got an ERROR!!! + ${error}');
        })
}
//#endregion


/**
 * @description Get device's Operating System
 */
function GetOS() {
    var userAgent = window.navigator.userAgent,
        platform = window.navigator?.userAgentData?.platform || window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;
    
    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'm';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'i';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'w';
    } else if (/Android/.test(userAgent)) {
      os = 'a';
    } else if (/Linux/.test(platform)) {
      os = 'l';
    }
  
    return os;
}

/**
 * @description Get cookie from the browser and break it up into a dictionary
 * @param {string} _name name of the cookie to look for
 */
function GetCookie(_name) {
    let dict = document.cookie.split(';')
        .map(cookie => cookie.split('='))
        .reduce((accumulator, [key, value]) => ({...accumulator, [key.trim()]: decodeURIComponent(value) }), {});
    return dict[_name]; // >> value of "_name:..."
}



//#region //*============== Registering new Device ====================================

function RandomIdGen(){
    var r = 0; 
    do {
        r = Math.floor(Math.random() * 100000);
    } while (r < 10000 || r >= 100000);
    return r;
}

/**
 * @description Call to start registering a new device. Popup to ask for gender (Step 1/3)
 */
 function NewDevice() {
    popup.style.display = "flex"; //Display the popup

    gender_hm.addEventListener("click", function() {
        deviceGender = "M";
        CheckOs(deviceGender);
    });

    gender_hd.addEventListener("click", function() {
        deviceGender = "D";
        CheckOs(deviceGender);
    });
}

/**
 * @description Check OS and compared to gender. (Step 2/3)
 * @param {string} gender Gender of device's user
 */
 function CheckOs(gender){
    const os = GetOS();
    var osname = "";
    switch (os) {
        case "w": osname = "Windows"; break;
        case "a": osname = "Android"; break;
        case "i": osname = "Iphone"; break;
        case "m": osname = "MacOs"; break;
        case "l": osname = "Linux"; break;
        default: osname = "hệ điều hành này"; break;
    }
    const hmUses = ["w", "i", "m"];
    const hdUses = ["w", "a", "l"];
    if (gender == "M"){
        if (!hmUses.includes(os)) { 
            alert("Hoài Minh không dùng "+ osname + "!"); 
            return;
        }
    } else if (gender == "D") {
        if (!hdUses.includes(os)) { 
            alert("Hải Đăng không dùng "+ osname + "!"); 
            return;
        }
    }
    popup.style.display = "none";
    RegNewDevice(gender, os);
}

/**
 * @description Register new device. Make new id for device and save to DB (Step 3/3)
 * @param {string} _gender Gender of device's user to put in id
 * @param {string} _os Operating system of device tp uut in id
 * @return {string} String of new id
 */
function RegNewDevice(_gender, _os){
    let newid = _gender + _os + RandomIdGen().toString(); //Worst Id generator ever
    document.cookie = "Id=" + newid + "; expires=Thu, 31 Dec 2030 12:00:00 UTC; path=/";
    thisId = newid;
    SaveDeviceIds(newid);
    SetGender(GetGender());
    return newid;
}

//#endregion


//*======================= MAIN ===========================

const popup = document.getElementById("gender-popup");
const gender_hm = document.getElementById("gender-hm");
const gender_hd = document.getElementById("gender-hd");

let savedIds = await GetDeviceIdsArray();
let savedString = await GetDeviceIdsString();

var saved = true;

//Search the database's ids string(splitted into array) for this device's id
savedIds.forEach(_id => {
    if (_id == thisId) {
        console.log("This device is SAVED");
        saved = true;
    }
});

thisId = GetCookie("Id"); //Check browser's cookie for Id
if (thisId == undefined) { //Generate a new one if didn't exist
    popup.style.display = "flex";
    NewDevice();
} else if (!saved) {
    console.log("This device has ID but NOT saved to DB");
    document.cookie = "Id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    NewDevice();
} else {
    popup.style.display = "none";
    console.log("This device id is " + thisId);
}

function GetGender(){
    let g = thisId.charAt(0);
    return g;
}

function GetDevice(){
    let v = thisId.charAt(1);
    return v;
}

deviceGender = GetGender();

SetGender(GetGender()); //send gender to main.js


savedIds = await GetDeviceIdsArray();
savedString = await GetDeviceIdsString();

/**
 * @description Remove current device's ID from cookie and DB. Exposed to console for debug
 */
function DeleteThisId() {
    console.log(savedIds);

    var _ids = savedIds.map(e => { 
        if (e == thisId){
            e = null; //Remove current ID from the array
        }
        return e;
    });
    console.log(_ids);

    var newIdString = ""; //Make array into new string
    for (let i = 0; i < _ids.length; i++) {
        const id = _ids[i];
        if (id != null){
            if ( i == _ids.length - 1){
                newIdString += id.toString();
            } else {
                newIdString += id.toString() + ';';
            }
        }
    }
    console.log(newIdString);
    UpdateDeviceIds(newIdString); //Write whole string to DB
    document.cookie = "Id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"; //Remove Id from cookie
    location.reload();
}


window.DeleteId = DeleteThisId; //Expose function to console
