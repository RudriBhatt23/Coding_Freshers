const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
// const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const port = 3000;

// Set up body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'jhilu923',
    port: 5432,
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve HTML login form
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Handle login form submission
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM student WHERE username = $1', [username]);
        const user = result.rows[0];
        
        if (!user) {
            res.status(401).send('Invalid username or password');
            return;
        }

        // Compare hashed password with the submitted password
        // const passwordMatch = await bcrypt.compare(password, user.password);
        // if (!passwordMatch) {
        //     res.status(401).send('Invalid username or password');
        //     return;
        // }

        // Password is correct, redirect to home page
        res.sendFile(path.join(__dirname, 'home.html'));
    } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).send('Error logging in');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
