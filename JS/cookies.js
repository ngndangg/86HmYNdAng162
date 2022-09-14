import { db } from "../main.js";
import { getFirestore, doc, getDoc, getDocs, setDoc, collection } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

export var thisId = 0;

const deviceIds = doc(db, "Batluc/deviceIds");

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
 * @description Write an device id to DB by appending the id to a string
 * @param {number} _id id to write to DB 
 */
function WriteDeviceIds(_id) {
    var oldIds = savedString;
    var str = ""
        //Add id to string
    if (oldIds == "") {
        str = _id;
    } else {
        str = oldIds + ";" + _id;
    }

    var content = {
        ids: str
    };

    setDoc(deviceIds, content, { merge: true })
        .then(() => {
            console.log("New id written (" + _id + ")");
        })
        .catch((error) => {
            console.log('Got an ERROR!!! + ${error}');
        })
}

/**
 * @description Get cookie from the browser and break it up into a dictionary
 * @param {string} _name name of the cookie to look for
 */
function GetCookie(_name) {
    var dict = document.cookie.split(';')
        .map(cookie => cookie.split('='))
        .reduce((accumulator, [key, value]) => ({...accumulator, [key.trim()]: decodeURIComponent(value) }), {});
    return dict[_name]; // >> value of "_name:..."
}

function DeleteId() {
    document.cookie = "Id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"; //Put this in console to clear that device's id
}

//=================================== MAIN ====================================

var gotcookie = GetCookie("Id") //Check browser for Id cookie
if (gotcookie == undefined) { //Generate a new one if didn't exist
    var newid = Math.floor(Math.random() * 100000); //Worst Id generator ever
    document.cookie = "Id=" + newid.toString() + "; expires=Thu, 31 Dec 2030 12:00:00 UTC; path=/";
    gotcookie = newid;
} else {
    console.log("This device id: " + gotcookie);
}
thisId = gotcookie;

var savedIds = await GetDeviceIdsArray();
var savedString = await GetDeviceIdsString();
var saved = false
    //Search the database's ids string(splitted into array) for this device's id
savedIds.forEach(_id => {
    if (_id == thisId) {
        console.log("This device is already saved");
        saved = true;
        return;
    }
});
//If not saved write this id to database
if (!saved) {
    WriteDeviceIds(thisId);
}