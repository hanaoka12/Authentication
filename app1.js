// app.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./user'); // Create a user model
const Exam = require('./exam');
const path = require('path');
const session = require('express-session'); // Require express-session
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'your secret key',
    resave: false,
    saveUninitialized: false
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'login2/views1'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware to check if user is logged in
function checkLoggedIn(req, res, next) {
    if (req.session && req.session.userId) {
        next(); // user is logged in, proceed to route
    } else {
        res.redirect('/login'); // user is not logged in, redirect to login page
    }
}

// Routes
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find user by username and password
        const user = await User.findOne({ username, password });
        if (user) {
            // Store user ID in session
            req.session.userId = user._id;
            res.redirect('/dashboard');
        } else {
            res.json({
                status:'Failed',
                message:'Login failed'
            });
        }
    } catch (err) {
        res.status(500).send('Error logging in');
    }
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.json({
                status:'Failed',
                message:'User already exists'
            });
        } else {
            // Create a new user
            const user = new User({ username, password });
            await user.save();
            res.json({
                status:'success',
                message:'Registration successful'
            });
        }
    } catch (err) {
        res.status(500).send('Error registering user');
    }
});

app.get('/dashboard', checkLoggedIn, async (req, res) => {
    try {
        // Fetch all exams from MongoDB
        const exams = await Exam.find({}).lean();
        // Render the dashboard view and pass the exams
        console.log(exams); 
        res.render('dashboard', { exams });
    } catch (err) {
        console.error('Error fetching exams:', err);
        res.status(500).send('Error fetching exams');
    }
});
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/dashboard');
        }
        res.clearCookie('sid');
        res.redirect('/login');
    });
});

app.get('/exam/:id', checkLoggedIn, async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        res.render('exam', { exam });
    } catch (err) {
        console.error('Error fetching exam:', err);
        res.status(500).send('Error fetching exam');
    }
});

app.post('/exam/:id', checkLoggedIn, async (req, res) => {
    // Handle exam submission
    // This is a placeholder. You'll need to implement the logic to check answers and handle the submission.
    res.send('Exam submitted');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

