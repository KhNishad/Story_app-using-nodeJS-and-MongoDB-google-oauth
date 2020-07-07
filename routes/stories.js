const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth')
const story = require('../models/story')


// add story paage 

router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
});

// post req to submit story

router.post('/', ensureAuth, async(req, res) => {
   try {
       req.body.user = req.user.id
       await story.create(req.body)
       console.log("story added");
       
       res.redirect('/dashboard')

   } catch (err) {
       console.error(err)
       res.render('error/500');
       
   }
});




module.exports = router