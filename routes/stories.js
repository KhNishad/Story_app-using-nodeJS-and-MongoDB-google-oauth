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

router.get('/', ensureAuth , async (req,res) =>{
  try {
       const stories = await story.find({status : 'public'})
       .populate('user')
       .sort({createdAt: 'desc'})
       .lean()

       res.render('stories/index',{
           stories
       })
  } catch (err) {
      console.error(err)
  }
});

// edit page 
router.get('/edit/:id', ensureAuth, async (req, res) => {
    //console.log(req.params.id);
    
    const Story = await story.findOne({
        _id: req.params.id
    }).lean()
    
    if(!Story){
        return res.render('error/404')
    }
    if(Story.user != req.user.id){
        res.redirect('/stories')
    }else{
        res.render('stories/edit',{
            Story
        })
    }
});

// update story
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let sstory = await story.findById(req.params.id).lean()

        if (!sstory) {
            return res.render('error/404')
        }

        if (sstory.user != req.user.id) {
            res.redirect('/stories')
        } else {
            sstory = await story.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true,
            })

            res.redirect('/dashboard')
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})


// delete story

router.get('/delete/:id', ensureAuth, async (req, res) => {
   try {
       await story.remove({_id : req.params.id})
       res.redirect('/dashboard')
   } catch (err) {
       console.error(err)
       return res.render('error/500');
   }
});


// read more story
router.get('/:id', ensureAuth, async (req, res) => {
   try {
        let storyy  = await story.findById(req.params.id)
        .populate('user')
        .lean()
        console.log(storyy);
        if(!storyy){
            return res.render('error/404')
        }
        res.render('stories/show',{
            storyy
        })
   } catch (err) {
   console.error(err)
       return res.render('error/404');
       
   }
});


// @route   GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const stories = await story.find({
            user: req.params.userId,
            status: 'public',
        })
            .populate('user')
            .lean()

        res.render('stories/index', {
            stories,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports = router