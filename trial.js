const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'images1')));
app.use(express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname, 'public')));

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'jhilu923',
    port: 5432,
});

app.get('/codingFreshers', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
});

app.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        const client = await pool.connect();

        let result;
        if (role === 'student') {
            result = await client.query('INSERT INTO student (username, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, password]);
        } else if (role === 'faculty') {
            result = await client.query('INSERT INTO faculty (username, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, password]);
        } else {
            res.status(400).send('Invalid role');
            return;
        }

        const user = result.rows[0];
        client.release();
        res.send(`User ${user.username} successfully registered as a ${role}!`);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error registering user');
    }
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.get('/quiz2', (req, res) => {
    res.sendFile(__dirname + '/quiz2.html');
});

app.post('/login', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const client = await pool.connect();

        let result;
        if (role === 'student') {
            result = await client.query('SELECT * FROM student WHERE username = $1 AND password = $2', [username, password]);
        } else if (role === 'faculty') {
            result = await client.query('SELECT * FROM faculty WHERE username = $1 AND password = $2', [username, password]);
        } else {
            res.status(400).send('Invalid role');
            return;
        }

        const user = result.rows[0];
        client.release();

        if (!user) {
            res.status(401).send('Invalid username or password');
            return;
        }

        if (role === 'student') {
            res.sendFile(__dirname + '/student_home.html');
        } else if (role === 'faculty') {
            res.sendFile(__dirname + '/faculty_home.html');
        }
    } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).send('Error logging in');
    }
});

app.post('/quiz2', async (req, res) => {
    const { userId, quizScore } = req.body;

    try {
        const client = await pool.connect();
        const query = {
            text: 'INSERT INTO quiz_results (user_id, marks) VALUES ($1, $2)',
            values: [userId, quizScore],
        };
        await client.query(query);
        
        client.release();
        res.json({ success: true, message: 'Quiz marks stored successfully' });
    } catch (error) {
        console.error('Error storing quiz marks:', error);
        res.status(500).json({ success: false, message: 'Failed to store quiz marks' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
