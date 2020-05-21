const express = require('express');
const router = express.Router();
const { Comment } = require("../models/Comment");

// Comment

router.post('/saveComment', (req, res) => {
    const comment = new Comment(req.body);
    comment.save((err, newComment) => {
        if(err) return res.json({success:false, err});

        // newComment에는 popluate('writer') 같이 사용자 정보를 가져올수가 없다. 
        // 그래서 다시 조회한다.
        Comment.find({'_id' : newComment._id})
        .populate('writer')
        .exec((err, result) => {
            if(err) return res.json({success:false, err});
            return res.status(200).json({success:true, result});
        })
    })
})

module.exports = router;
