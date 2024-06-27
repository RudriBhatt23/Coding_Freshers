const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
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

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Serve HTML editor form
app.get('/editor', (req, res) => {
    const htmlFilePath = path.join(__dirname, 'quiz_editor.html');
    res.sendFile(htmlFilePath);
});

// Route to handle saving quiz data
app.post('/save-quiz', async (req, res) => {
    const { quizData } = req.body;

    try {
        // Validate quizData here if needed

        const client = await pool.connect();
        // Begin a transaction
        await client.query('BEGIN');

        // Loop through quiz data and insert each question into the database
        for (let i = 0; i < quizData.length; i++) {
            const { questionText, options, correctAnswer } = quizData[i];
            const queryText = 'INSERT INTO quiz (id, question, option1, option2, option3, option4, correct_option) VALUES ($1, $2, $3, $4, $5, $6, $7)';
            const values = [i + 1, questionText, options[0], options[1], options[2], options[3], correctAnswer];
            await client.query(queryText, values);
        }

        // Commit the transaction
        await client.query('COMMIT');
        client.release();

        res.status(200).json({ message: 'Quiz data saved successfully' });
    } catch (error) {
        // If an error occurs, rollback the transaction and send an error response
        console.error('Error saving quiz data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to handle deleting quiz data
app.post('/delete-quiz', async (req, res) => {
    try {
        const client = await pool.connect();
        // Begin a transaction
        await client.query('BEGIN');

        // Truncate the table
        await client.query('TRUNCATE TABLE quiz');

        // Commit the transaction
        await client.query('COMMIT');
        client.release();

        res.status(200).json({ message: 'Quiz data deleted successfully' });
    } catch (error) {
        // If an error occurs, rollback the transaction and send an error response
        console.error('Error deleting quiz data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
