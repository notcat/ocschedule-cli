import 'dotenv/config';

const username = process.env.USERNAME;
if (!username) throw new Error('"USERNAME" env var is required!');
const password = process.env.PASSWORD;
if (!username) throw new Error('"PASSWORD" env var is required!');

console.log(username, password);