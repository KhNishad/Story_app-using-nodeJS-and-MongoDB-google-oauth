const express = require('express');
const router  = express.Router();
const {ensureAuth, ensureGuest} = require('../middleware/auth')
const story =  require('../models/story')
// login/ landing oage 

router.get('/',ensureGuest, (req,res)=>{
  res.render('login.hbs',
  {layout : "login"}
  )
})

router.get('/dashboard',ensureAuth, async (req, res) => {
  try {
     const stories = await story.find({user: req.user.id}).lean()
    res.render("dashboard", {
      name: req.user.firstName,
      stories
    })
  } catch (err) {
    console.error(err);
   
    res.render('error/500')
    
  }
        
    
})
module.exports = router