const express = require('express');
const consola = require("consola");
const fs = require('fs');
const path = require('path');
require("dotenv").config();
const log4js = require('log4js');

log4js.configure('./config/log4js.json');
const log = log4js.getLogger('app');
const logAccess = log4js.getLogger('access');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Create Log directory
fs.mkdir(path.join(__dirname, 'test'), (err) => {
    if (err.code !== 'EEXIST') {
        return log.error('Could not create the log directory. Error: ', err)
    } else if (err) {
        return log.info('Log directory already exists.');
    }
    log.info('Log directory created successfully!');
});

// Start API
app.listen(process.env.API_PORT, process.env.API_HOST, (err) => {
    if (err) {
        log.error(`Could not start the Express server on http://${process.env.API_HOST}:${process.env.API_PORT}`);
    }
    log.info(`API server listening on http://${process.env.API_HOST}:${process.env.API_PORT} with pid ${process.pid}`);

    consola.ready({
        message: `API server listening on http://${process.env.API_HOST}:${process.env.API_PORT}`,
        badge: true
    });
});

const users = [
    { id: 1, name: 'John', password: '12345' },
    { id: 2, name: 'June', password: 'password' },
    { id: 3, name: 'James', password: 'qwerty' },
    { id: 4, name: 'Jarvik', password: 'hello' },
    { id: 5, name: 'June', password: 'hunter2' },
];

app.get('/users/:userId', (req, res) => {
    const userId = req.params.userId;
    
    logAccess.debug(`GET request for user Id ${userId}`);
    
    for (let i = 0; i < users.length; i++) {
        if (users[i].id === parseInt(userId)) {
            return res.send(users[i]);
        }
    }
    logAccess.error(`User with ID ${userId} not found.`);
    res.status(404).send({ success: false, msg: 'User not found' });
});

app.get('/error', (req, res) => {
    log.error(`An error has occured. Error code: ${ Math.floor(Math.random() * 100) }`);
    res.status(500).send({ success: false, msg: 'Server error!'});
});

app.post('/login', (req, res) => {
    const { userId, password } = req.body;

    for (let i = 0; i < users.length; i++) {
        if (users[i].id === parseInt(userId)) {
            if (users[i].password === password) {
                logAccess.info(`User with ID ${userId} has signed in.`);
                return res.send({ success: true, msg: 'Successfully logged in.' });
            } else {
                logAccess.info(`Login attempt with incorrect credentials for user ID ${userId}`);
                return res.status(403).send({ success: false, msg: 'Wrong userId/password' });
            }
        }
    }
    logAccess.error(`User with ID ${userId} not found.`);
    res.status(404).send({ success: false, msg: 'User not found!' });
})



