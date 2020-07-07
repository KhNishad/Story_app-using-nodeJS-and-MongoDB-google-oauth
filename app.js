const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')


// loan config 

dotenv.config({path:'./config/config.env'});

// passport config
require('./config/passport')(passport)


connectDB();

const app = express();

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// handlebars

app.engine('.hbs', exphbs({
    defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');
// session middleware
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
)


// passport middleware 
app.use(passport.initialize())
app.use(passport.session())

// static folder
app.use(express.static(path.join (__dirname, 'public'))) 

// routes 
app.use('/', require('./routes/index'));




const PORT  = process.env.port || 3000;

app.listen(PORT,console.log(`server running in ${process.env.NODE_ENV} mode on ${PORT}`));
