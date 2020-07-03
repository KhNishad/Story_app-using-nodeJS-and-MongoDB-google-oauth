const express = require('express');
const router  = express.Router();

// login/ landing oage 

router.get('/', (req,res)=>{
  res.render('login.hbs',
  {layout : "login"}
  )
})

router.get('/dashboard', (req, res) => {
        res.render("dashboard.hbs");
    
})
module.exports = router