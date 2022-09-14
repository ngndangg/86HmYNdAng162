import { db } from "../main.js";
import { getFirestore, doc, getDoc, getDocs, setDoc, collection } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

export var thisId = 0;

const deviceIds = doc(db, "Batluc/deviceIds");

async function GetDeviceIdsArray() {
    const snapshot = await getDoc(deviceIds);
    if (snapshot.exists()) {
        var docData = snapshot.data();
        var _ids = docData.ids.toString();
        var array = _ids.split(";");
        return array;
    }
}

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

function WriteDeviceIds(_id) {
    var oldIds = savedString;
    var str = ""
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


function GetCookie(_name) {
    var dict = document.cookie.split(';')
        .map(cookie => cookie.split('='))
        .reduce((accumulator, [key, value]) => ({...accumulator, [key.trim()]: decodeURIComponent(value) }), {});
    return dict[_name];
}

function DeleteId() {
    document.cookie = "Id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}

var gotcookie = GetCookie("Id")
if (gotcookie == undefined) {
    var newid = Math.floor(Math.random() * 100000);
    document.cookie = "Id=" + newid.toString() + "; expires=Thu, 31 Dec 2030 12:00:00 UTC; path=/";
    gotcookie = newid;
} else {
    console.log("This device id: " + gotcookie);
}
thisId = gotcookie;

var savedIds = await GetDeviceIdsArray();
var savedString = await GetDeviceIdsString();
var saved = false
savedIds.forEach(_id => {
    if (_id == thisId) {
        console.log("This device is already saved");
        saved = true;
        return;
    }
});
if (!saved) {
    WriteDeviceIds(thisId);
}