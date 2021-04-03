const axios = require('axios');
require('dotenv').config();

const NUM_LOOPS = parseInt(process.env.NUM_LOOPS);
const API_URI = `http://${process.env.API_HOST}:${process.env.API_PORT}`;
console.log(API_URI);

const passwords = ['12345', 'password', 'qwerty', 'hello', 'hunter2'];

let count = 0;

async function makeMockRequests() {

    const userId = Math.floor(Math.random() * 11);
    const password = passwords[Math.floor(Math.random() * 6)];
   
    await axios.get(`/users/${userId}`)
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err.response && err.response.data));

    await axios.get(`http://${process.env.API_HOST}:${process.env.API_PORT}/errors`)
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err.response && err.response.data));

    await axios.post(`http://${process.env.API_HOST}:${process.env.API_PORT}/login`, { userId, password })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err.response && err.response.data));

    // eslint-disable-next-line no-unused-vars
    count++;

    if (count < NUM_LOOPS) {
        makeMockRequests();
    } else {
        return;
    }
}

makeMockRequests();

