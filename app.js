const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');


const app = express();



// Load Models
require('./models/User');
require('./models/Story');

// Passort configuration
require('./config/passport')(passport);

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Connect to MongoDB


//handlesbar middleware
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars');


// Add cookie parser
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
 
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Set global vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});


// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Use routes.
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');



// Load keys
const keys = require('./config/keys');


// map global promise resolution
mongoose.Promise = global.Promise;


// Connect to MongoDB
mongoose.connect(keys.mongoURI)
   .then(() => console.log('MongoDB Connected...'))
   .catch(err => console.log(err));


const port = process.env.PORT || 3000;


// Use Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});