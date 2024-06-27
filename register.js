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

        // Redirect to appropriate page based on role
        if (role === 'student') {
            res.sendFile(__dirname + '/home.html');
            app.get('/home', (req, res) => {
                res.sendFile(__dirname + '/home.html');
            });
            app.get('/courses', (req, res) => {
                res.sendFile(__dirname + '/courses.html');
            });
            app.get('/about', (req, res) => {
                res.sendFile(__dirname + '/about.html');
            });
            app.get('/quiz', (req, res) => {
                res.sendFile(__dirname + '/quiz2.html');
            });
            app.get('/contact', (req, res) => {
                res.sendFile(__dirname + '/contact.html');
            });
            app.get('/C', (req, res) => {
                res.sendFile(__dirname + '/C.html');
            });
            app.get('/Cpp', (req, res) => {
                res.sendFile(__dirname + '/C++.html');
            });
            app.get('/java', (req, res) => {
                res.sendFile(__dirname + '/java.html');
            });
        } else if (role === 'faculty') {
            res.sendFile(__dirname + '/homeFaculty.html');
            app.get('/homeFaculty', (req, res) => {
                res.sendFile(__dirname + '/homeFaculty.html');
            });
            app.get('/Cfaculty', (req, res) => {
                res.sendFile(__dirname + '/Cfaculty.html');
            });
            app.get('/quizUpload', (req, res) => {
                res.sendFile(__dirname + '/quizUpload.html');
            });
            app.get('/coursesFaculty', (req, res) => {
                res.sendFile(__dirname + '/coursesFaculty.html');
            });
            app.get('/about', (req, res) => {
                res.sendFile(__dirname + '/about.html');
            });
            app.get('/contact', (req, res) => {
                res.sendFile(__dirname + '/contact.html');
            });
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


// Route to fetch questions and options
// Route to fetch questions and options
app.get('/questions', async (req, res) => {
    try {
        // Fetch questions and options from the database
        const query = 'SELECT * FROM quiz ORDER BY id;';
        const result = await pool.query(query); // Use pool.query instead of client.query

        // Format the result as needed
        const questions = result.rows.map(row => {
            return {
                id: row.id,
                question: row.question,
                options: [row.option1, row.option2, row.option3, row.option4],
            };
        });

        // Send the formatted questions as JSON response
        res.json(questions);
    } catch (err) {
        console.error('Error fetching questions', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to fetch correct answer for a question
app.get('/correct_answer', async (req, res) => {
    try {
        const questionId = req.query.id; // Extract question ID from query parameters
        
        // Fetch the correct answer from the database using the question ID
        const query = 'SELECT correct_option FROM quiz WHERE id = $1;';
        const result = await pool.query(query, [questionId]); // Use pool.query instead of client.query

        if (result.rows.length === 0) {
            // If no matching question ID is found, respond with 404 Not Found
            res.status(404).json({ error: 'Question ID not found' });
        } else {
            // Send the correct answer as JSON response
            res.json({ correct_answer: result.rows[0].correct_option });
        }
    } catch (err) {
        console.error('Error fetching correct answer', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/quiz_results', async (req, res) => {
    try {
        const { userId, quizScore } = req.body; // Destructure userId and quizScore from request body

        // Insert quiz results into the database using the pool object
        const query = 'INSERT INTO quiz_results (user_id, marks) VALUES ($1, $2);';
        await pool.query(query, [userId, quizScore]); // Use pool.query instead of client.query

        res.status(200).json({ message: 'Quiz marks stored successfully' });
    } catch (err) {
        console.error('Error storing quiz marks', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Route to serve quiz HTML page
app.get('/quiz', (req, res) => {
    res.sendFile(__dirname + '/quiz_fetch.html');
});
app.use(express.static('public')); // Assuming your CSS file is in a 'public' directory

// Add a route to serve the CSS file
app.get('/quiz.css', (req, res) => {
    res.sendFile(__dirname + '/public/quiz2.css');
});





app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
