const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { query } = require('./../database')
const { encryptPassword, matchPassword } = require('./helpers')


passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    console.log(req.body)
    const rows = await query('SELECT * FROM users WHERE username=?', [username])

     //Check if user exists
    if (rows.length > 0) {
        const user = rows[0]
        const validPassword = await matchPassword(password, user.password)
        if (validPassword) {
            done(null, user, req.flash('success', 'Welcome ' + user.username))
        } else {
            done(null, false, req.flash('message', 'Incorrect Password'))
        }
    } else {
        return done(null, false, req.flash('message', 'The username does not exist'))
    }
}))


passport.use('local.signup', new LocalStrategy({
    usernameField: 'username', 
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { fullname } = req.body
    const newUser = {
        username,
        password,
        fullname
    }
    //Check if the username is already picked
    const usernameExists = await query('SELECT * FROM users WHERE username=?', username)
    if (usernameExists.length > 0) {
        done(null, false, req.flash('message', 'This username already exists'))
    }

    newUser.password = await encryptPassword(password)
    const result = await query('INSERT INTO users SET ?', [newUser])
    newUser.id = result.insertId
    return done(null, newUser)
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    const rows = await query('SELECT * FROM users WHERE id=?', [id])
    done(null, rows[0])
})  

module.exports = passport

 