const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const logger = require('morgan');
const bodyparser = require('body-parser');
const nocache = require("nocache");
const session = require('express-session');
const hbs = require('express-handlebars');
const { v4:uuidv4 } = require('uuid');
const Handlebars = require('handlebars');

const connectDB = require('./server/database/connection')

const app = express();

const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');

dotenv.config({path:'config.env'})
const PORT = process.env.PORT || 8080;

//log requests
app.use(logger('tiny'));

//monogodb connection
connectDB();

//nocache
app.use(nocache());                 //---->enable this 

//parse request to body-parser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

//set view engine
app.set("view engine", "hbs")
app.set("views", path.join(__dirname, "views"));
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutDir: __dirname + '/views/layouts',
    partialDir: __dirname + '/views/partials'
  }));

app.use(express.static(path.join(__dirname, "public")));
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use("/img", express.static(path.join(__dirname, "public/img")));

app.use(session({
    secret: uuidv4(), 
    cookie: {maxAge:600000},
    saveUninitialized: true
}))

app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

Handlebars.registerHelper("inc", function(value, options){
    return parseInt(value) + 1; 
});
Handlebars.registerHelper('ifEqual', function(arg1, arg2, options) {
    return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
});

app.listen(PORT,()=>{
    console.log(`Server started on http://localhost:${PORT}`);
})

module.exports = app;