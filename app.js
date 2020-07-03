const express = require('express');
const dotenv  = require ('dotenv');
const  connectDB  = require('./config/db')
const morgan  =  require('morgan');
const exphbs = require('express-handlebars');
const path = require('path')

// loan config 

dotenv.config({path:'./config/config.env'});

connectDB();

const app = express();

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// handlebars

app.engine('.hbs', exphbs({
    defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// static folder
app.use(express.static(path.join (__dirname, 'public'))) 

// routes 
app.use('/', require('./routes/index'));




const PORT  = process.env.port || 3000;

app.listen(PORT,console.log(`server running in ${process.env.NODE_ENV} mode on ${PORT}`));
