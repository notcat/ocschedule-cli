import promptsync from 'prompt-sync';

import 'dotenv/config';

// import requests
import * as rdevice from './requests/registerDevice.js';

const prompt = promptsync({ sigint: true });

let username: string = "";
let password: string = "";
const deviceName: string = `CLI:${process.platform}`

// Perhaps there is a cleaner way to do this? Maybe make it into a function?
if (!process.env.USERNAME) {
    while (username == "") {
        username = prompt("What is the username? (300xxxxxx): ")
    }
} else {
    console.log("Username supplied from env variables.")
    username = process.env.USERNAME;
}

if (!process.env.PASSWORD) {
    while (password == "") {
        password = prompt("What is the password?: ")
    }
} else {
    console.log("Password supplied from env variables.")
    password = process.env.PASSWORD;
}

console.log(`Logging in with student number ${username}`);

rdevice.RegisterDevice(username, password, deviceName).then((device: rdevice.RegisteredDevice) => {
    console.log(device);
}).catch((err) => {
    console.log(err);
});