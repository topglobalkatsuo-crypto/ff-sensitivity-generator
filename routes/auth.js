const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const usersFile = path.join(__dirname, '../database/users.json');

function readUsers() {
    if (!fs.existsSync(usersFile)) {
        fs.writeFileSync(usersFile, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
}

function writeUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function generateKey() {
    return 'FF-' + uuidv4().split('-').join('').substring(0, 16).toUpperCase();
}

router.post('/register', (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ error: 'Username required' });
    }
    let users = readUsers();
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ error: 'User already exists' });
    }
    const newUser = { id: uuidv4(), username, key: generateKey(), createdAt: new Date().toISOString() };
    users.push(newUser);
    writeUsers(users);
    res.json({ message: 'User registered successfully', user: newUser });
});

router.post('/login', (req, res) => {
    const { key } = req.body;
    if (!key) {
        return res.status(400).json({ error: 'Key required' });
    }
    const users = readUsers();
    const user = users.find(u => u.key === key);
    if (!user) {
        return res.status(401).json({ error: 'Invalid key' });
    }
    res.json({ message: 'Login successful', user: { id: user.id, username: user.username, key: user.key } });
});

module.exports = router;