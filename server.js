const express = require('express');
const { Client } = require('pg');
const path = require('path'); // Import the 'path' module

// Rest of your code...
const app = express();
const port = 3000;
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
// PostgreSQL connection
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'jhilu923',
    port: 5432,
});
client.connect();
app.use(express.static(path.join(__dirname, 'public')));
// API endpoint to store quiz marks

app.get('/quizmarks', (req, res) => {
    res.sendFile(__dirname + '/quiz2.html');
});


app.post('/api/quizmarks', async (req, res) => {
    const { userId, quizScore } = req.body;

    try {
        // Insert quiz marks into the database
        const query = {
            text: 'INSERT INTO quiz_results (user_id, marks) VALUES ($1, $2)',
            values: [userId, quizScore],
        };
        await client.query(query);

        res.json({ success: true, message: 'Quiz marks stored successfully' });
    } catch (error) {
        console.error('Error storing quiz marks:', error);
        res.status(500).json({ success: false, message: 'Failed to store quiz marks' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
