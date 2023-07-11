const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const logger = require('morgan');
const bodyparser = require('body-parser');
const session = require('express-session');
const { v4:uuidv4 } = require('uuid');
const app = express();
const homeRouter = require('./routes/home');

dotenv.config({path:'config.env'})
const PORT = process.env.PORT || 8080;

//log requests
app.use(logger('tiny'));

//parse request to body-parser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

//set view engine
app.set("view engine", "hbs")
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/js", express.static(path.join(__dirname, "public/js")));

app.use(session({
    secret: uuidv4(), 
    cookie: {maxAge:600000},
    saveUninitialized: true
}))

app.use('/', homeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
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

app.listen(PORT,()=>{
    console.log(`Server started on http://localhost:${PORT}`);
})

module.exports = app;