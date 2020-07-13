const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
    story_id: {
        type: String,
        required: true
    },
    user: {
        type:String,
       required: true
    }

})
module.exports = mongoose.model("like", likeSchema)