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
    comment :{
        type : String,
        required : true
    }

})
module.exports = mongoose.model("comment", commentSchema)