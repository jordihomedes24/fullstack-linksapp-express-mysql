const express = require('express')
const router = express.Router()
const passport = require('passport')
const { isLoggedIn, isNotLoggedIn } = require('./../lib/auth')

router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('./auth/signup')
})

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }), (req, res) => {
    res.send('received');
})

router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('./auth/signin')
})

router.post('/signin', isNotLoggedIn, (req, res) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res)
})

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile')
})

router.get('/logout', (req, res) => {
    req.logOut(() => (console.log('Cannot log out')))
    res.redirect('/signin')
})

module.exports = router