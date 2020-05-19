const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");


const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
// multer options
let storage = multer.diskStorage({
    destination : (req, file, cb) => {
        // 어디에 저장할지 설정
        cb(null, "uploads/");
    },
    filename : (req, file, cb) => {
        // 저장할 파일이름
        cb(null, `${Date.now()}_${file.originalname}`);        
    },
    fileFilter : (req, file, cb) => {
        // 파일 확장자 설정 
        const ext = path.extname(file.originalname);
        if(ext !== '.mp4') {
            return cb(res.status(400).end('only mp4'), false);
        }
        cb(null, true);
    }
})
const uplaod = multer({storage : storage}).single('file');

//=================================
//             Video
//=================================

router.post('/uploadfiles', (req, res) => {
    // 서버에 파일을 저장한다.
    uplaod(req, res, err => {
        if(err) return res.json({success:false, err})
        return res.json({success:true, url: res.req.file.path, fileName : res.req.file.filename})
    })
})

router.post('/thumbnail', (req, res) => {
    // 썸네일 생성하고 비디오 러닝타임 가져오기 
    
    let filePath = "";
    let fileDuration = "";
    // 비디오 정보 가져오기 
    ffmpeg.ffprobe(req.body.url, function(err, metadata) {        
        fileDuration = metadata.format.duration;
    })
    
    // 썸네일 생성
    ffmpeg(req.body.url)
    .on('filenames', function(filenames) {
        filePath = 'uploads/thumbnails/'+filenames[0];
    })
    .on('end', function() {
        return res.json({
            success : true,
            url : filePath,
            fileDuration : fileDuration
        })
    })
    .on('error', function(err){
        return res.json({success: false, err})
    })
    .screenshot({
        // screenshot 20%, 40%, 60%, 80%
        count : 3,
        folder : 'uploads/thumbnails',
        size : '320x240',
        // %b : input basename (no ext)
        filename : 'thumbnail-%b.png'
    })

})


router.post('/uploadVideo', (req, res) => {
    const video = new Video(req.body);
    video.save( (err, doc) => {
        if(err) return res.json({success : false, err})
        res.status(200).json({success: true})
    })

})

router.get('/getVideos', (req, res) => {    
    Video.find()
        .populate('writer') // 이걸 해줘야지 사용자 정보를 가져올수 있다.
        .exec((err, videos) => {
            if(err) return res.status(400).send(err)
            res.status(200).json({success : true, videos})
        })

})


router.post('/getVideoDetail', (req, res) => {    
    Video.findOne({"_id": req.body.videoId})
        .populate('writer') 
        .exec((err, videoDetail) => {
            if(err) return res.status(400).send(err)
            res.status(200).json({success : true, videoDetail})
        })

})

module.exports = router;
