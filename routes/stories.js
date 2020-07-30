const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth')
const story = require('../models/story')
const like  = require('../models/like')
const comments = require('../models/comments')


// add story paage 

router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
});

// post req to submit story

router.post('/', ensureAuth, async(req, res) => {
   try {
       req.body.user = req.user.id
       await story.create(req.body)
      // console.log("story added");
       
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

         //    count comments
         comments.find().countDocuments(function (err , count) {
             let com_count  = count;
            // console.log(com_count);
             
        

    //    count likes
      like.find().countDocuments(function (err, count) {
       let countt  = count ;
  
     // console.log(countt);
   // console.log(stories);
       res.render('stories/index',{
           stories,
          
       })
       })
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




// like post 
router.post('/like', ensureAuth, async (req, res) => {
    var status = 1;
    try {
        req.body.user = req.user.id
      
        const likes = await like.find({ story_id : req.body.story_id}).lean()
        //  console.log(likes.length);
        //  console.log(req.body.story_id);
        // console.log(likes[0].user);
       // console.log(req.body.user);
      //console.log(likes.length);
    if(likes.length){
        for(var i = 0;i<likes.length;i++)
        {
            
            if (likes[i].user == req.body.user) {
                console.log(" Already Liked ")
             var  status = 0;
                break;
                
            } 
        }
     
    }
    if(status == 1) {
        //console.log(req.body);
        await like.create(req.body)
        let id = req.body.story_id;

        res.redirect('likeUpdate/' + id);
    }else{
          res.redirect('/stories')
    }
      
    } 
     catch (err) {
        console.error(err)
        res.render('error/500');

    }
});

// like update
// like 
router.get('/likeUpdate/:id',  async (req, res) => {
    try {
        // story.findOneAndUpdate({ _id: req.params.id }, { $inc: { 'like': 1 } })

        story.findOneAndUpdate({ _id: req.params.id },
            { $inc: { 'like': 1 } },
            { new: true },
            function (err, response) {
               // console.log("up");
            });
       
        res.redirect('/stories')

    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

// comments 
router.post('/comment', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        req.body.userName = req.user.displayName
        req.body.image = req.user.image

        await comments.create(req.body)
        // console.log("cmnt added");
        let id  = req.body.story_id;

        res.redirect('commentsUpdate/' + id)

    } catch (err) {
        console.error(err)
        res.render('error/500');

    }
});
// comments update
router.get('/commentsUpdate/:id', ensureAuth , async(req,res) =>{
    try {
       
        story.findOneAndUpdate({ _id: req.params.id },
            { $inc: { 'comments': 1 } },
            { new: true },
            function (err, response) {
                 console.log("comnt up");
            });

        res.redirect('/stories')
    } catch (error) {
        
    }
});
// view comments 
router.get('/comment/:id', ensureAuth, async(req,res)=>{
//    console.log(req.params.id);

    try {
        const cmnt = await comments.find({ story_id : req.params.id}
          
        ).lean()

        if (!cmnt) {
            res.redirect('/stories')
        } else {
             console.log(cmnt);
            res.render('stories/comments',{
                cmnt,
            })
        }
      

        //   console.log(cmnt);
    } catch (error) {
        res.send(error);
    }


})

module.exports = router