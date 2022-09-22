import fetch from "node-fetch";
import { exit } from "process";

const registerURL = "https://webapps-5.okanagan.bc.ca/ok/OCMobile/api/Account/Register"

export class RegisteredDevice {
    deviceID: string;
    firstName: string;
    lastName: string;
    email: string;

    constructor(deviceID: string = "", firstName: string = "", lastName: string = "", email: string = "") {
        this.deviceID = deviceID;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }
}

export async function RegisterDevice(username: string, password: string, deviceName: string): Promise<RegisteredDevice> {
    let newDevice = new RegisteredDevice();

    const response = await fetch(registerURL, {
        method: 'POST',
        body: JSON.stringify({
            username: username,
            password: password,
            deviceName: deviceName
        }),
        headers: {
            'Content-Type': 'application/json'
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
        newDevice.deviceID = json[0].DeviceID;
        newDevice.firstName = json[0].FirstName;
        newDevice.lastName = json[0].LastName;
        newDevice.email = json[0].Email;
    }).catch((myerr) => {
        console.log("Error registering device.");
        console.log("This is usually because your credentials are incorrect. Please check them and try again.");
        console.log("Here is the response from the server:");
        console.log(myerr.message, myerr.cause);

        throw "Failed to register device.";
    });

    return newDevice;
}