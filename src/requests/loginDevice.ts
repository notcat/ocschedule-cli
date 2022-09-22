import fetch from "node-fetch";

const registerURL = "https://webapps-5.okanagan.bc.ca/ok/OCMobile/api/Account/Login"

export class AuthCookie {
    cookie: string;
    expires: string;

    // TODO: do not use a string for the expiry date, use a proper date library for this.
    constructor(cookie: string = "", expires: string = "") {
        this.cookie = cookie;
        this.expires = expires;
    }
}

export async function LoginDevice(username: string, deviceID: string): Promise<AuthCookie> {
    let cookie = new AuthCookie();

    const response = await fetch(registerURL, {
        method: 'POST',
        body: JSON.stringify({
            username: username,
            deviceID: deviceID
        }),
        headers: {
            'Content-Type': 'application/json'
        },
    }).then((response) => {
        if (response.ok) {
            // TODO: this needs to be changed to something better lol
            cookie.cookie = "" + response.headers.get('set-cookie');

            // TODO: need to get date from cookie
            return response.json();
        }

        // Error'd and is not 200.
        return response.json().then((msg: any) => {
            // Error seems to do some fucky shit so we have to stringify it here
            throw new Error(`${response.status} ${response.statusText}`, { cause: msg },);
        });

    }).then((json: any) => {

    }).catch((myerr) => {
        console.log("Error logging in device.");
        console.log("This is usually because your credentials such as your password have changed. Please re-register your device.");
        console.log("Here is the response from the server:");
        console.log(myerr.message, myerr.cause);

        throw "Failed to log in device using existing token.";
    });

    return cookie;
}