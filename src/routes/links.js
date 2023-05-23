const express = require('express')
const router = express.Router()

const { query } = require('./../database')
const { isLoggedIn } = require('./../lib/auth')

router.get('/add', isLoggedIn, async (req, res) => {
    res.render('./links/add')
})

router.post('/add', isLoggedIn, async (req,res) => {
    const { title, url, description } = req.body
    const newLink = {
        title: title,
        url: url,
        description: description,
        user_id: req.user.id
    }
    await query('INSERT INTO links set ?', [newLink])
    req.flash('success', 'Link Saved Successfully')
    res.redirect('/links') 
})

router.get('/', isLoggedIn, async (req, res) => {
    const links = await query('SELECT * FROM links WHERE user_id=?', [req.user.id])
    res.render('./links/list', { links: links }) //Second argument is the list of links of the user (we need it to print them)
})

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await query ('DELETE FROM links WHERE id=?',[id])
    req.flash('success', 'Link Removed Succesfully')
    res.redirect('/links')
})

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params
    const links = await query('SELECT * FROM links WHERE id=?', id)
    res.render('links/edit', { link: links[0] })
})

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params
    const { title, description, url } = req.body
    const editedLink = {
        title,
        url,
        description
    }
    await query('UPDATE links set ? WHERE id = ?', [editedLink, id])
    req.flash('success', 'Link Updated Succesfully')
    res.redirect('/links')
})
  
module.exports = router