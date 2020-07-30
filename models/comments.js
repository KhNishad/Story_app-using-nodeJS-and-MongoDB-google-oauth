const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    story_id: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    userName :{
        type: String
    },
    comment :{
        type : String,
        required : true
    },
    time :{
        type: Date,
        default: Date.now

    },
    image :{
        type: String,
        
    }

})
module.exports = mongoose.model("comment", commentSchema)