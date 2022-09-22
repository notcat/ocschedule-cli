import promptsync from 'prompt-sync';
import fetch from 'node-fetch'

import 'dotenv/config';

// import requests
import * as rdevice from './requests/registerDevice.js';
import * as logindevice from './requests/loginDevice.js';

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

    logindevice.LoginDevice(username, device.deviceID).then(async (cookie: logindevice.AuthCookie) => {
        //console.log(cookie);

        // TODO: make it so you can select the date you want to see
        let url = `https://webapps-5.okanagan.bc.ca/ok/OCMobile/api/Schedule/GetScheduleByDate?studentID=${username}&startDate=2022-09-21T01%3A06%3A24&endDate=2022-09-22T01%3A06%3A24&page=1&start=0&limit=25`

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "cookie": cookie.cookie
            },
        }).then((response) => {
            if (response.ok) {

                return response.json();
            }

            // Error'd and is not 200.
            return response.json().then((msg: any) => {
                // Error seems to do some fucky shit so we have to stringify it here
                throw new Error(`${response.status} ${response.statusText}`, { cause: msg },);
            });

        }).then((json: any) => {
            console.log(json);
        }).catch((myerr) => {
            console.log(myerr.message, myerr.cause);
        });
    });
}).catch((err) => {
    console.log(err);
});