const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session);
const { database, frontend } = require('./keys')
const passport = require('passport')

console.log(database)

//Initializations
const app = express()
require('./lib/passport')

//Settings
app.set('port', frontend.port)
app.set('views', path.join(__dirname, 'views'))

app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs')

//Middlewares
app.use(session({
    secret: 'jordimysqlnode',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}))
app.use(flash())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false })) //we just accept strings, integer, etc from our forms, not images
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())

//Global variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success')
    app.locals.message = req.flash('message')
    app.locals.user = req.user
    next()
})

//Routes
app.use(require('./routes/index.js'))
app.use(require('./routes/authentication'))
app.use('/links', require('./routes/links'))

//Public
app.use(express.static(path.join(__dirname, 'public')))

//Starting the server
app.listen(app.get('port'), () => console.log('Server running on port', app.get('port')))
