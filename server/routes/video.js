const express = require('express');
const router = express.Router();
// const { Video } = require("../models/Video");

const multer = require('multer');
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

module.exports = router;
