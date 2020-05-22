import React,{useEffect, useState} from 'react'
import { Tooltip, Icon} from 'antd'
import Axios from 'axios';

function LikeDisLike(props) {

    const [Likes, setLikes] = useState(0)
    const [LikeActon, setLikeActon] = useState(null)
    const [DisLikes, setDisLikes] = useState(0)
    const [DisLikeActon, setDisLikeActon] = useState(null)
    useEffect(() => {
        let variable = {}
        if(props.video) {
            variable = {videoId : props.videoId,userId : props.userId}
        }else {
            variable = {commentId : props.commentId,userId : props.userId}
        }
        Axios.post('/api/like/getLikes', variable)
            .then(response => {
                if(response.data.success) {
                    // 얼마나 많은 좋아야를 받았는지
                    setLikes(response.data.likes.length)
                    // 내가 좋아요를 눌렀는지 
                    response.data.likes.map((like) => {
                        if(like.userId === props.userId) {
                            setLikeActon('liked')
                        }
                    })
                }else {
                    alert('like정보가져오기 실패')
                }
            })
        Axios.post('/api/like/getDisLikes', variable)
            .then(response => {
                if(response.data.success) {
                    // 얼마나 많은 싫어요를 받았는지
                    setDisLikes(response.data.dislikes.length)
                    // 내가 싫어요를 눌렀는지 
                    response.data.dislikes.map((dislike) => {
                        if(dislike.userId === props.userId) {
                            setDisLikeActon('disliked')
                        }
                    })
                }else {
                    alert('dislike정보가져오기 실패')
                }
            })    

    }, [])

    const onLike = () => {
        let variable = {}
        if(props.video) {
            variable = {videoId : props.videoId,userId : props.userId}
        }else {
            variable = {commentId : props.commentId,userId : props.userId}
        }

        if(LikeActon === null) {
            Axios.post('/api/like/upLike', variable)
                .then(response => {
                    if(response.data.success) {
                        setLikes(Likes + 1)
                        setLikeActon('liked')

                        if(DisLikeActon != null) {
                            setDisLikeActon(null)
                            setDisLikes(DisLikes - 1)
                        }
                    }else {
                        alert('실패')
                    }
                })
        }else {
            Axios.post('/api/like/unLike', variable)
                .then(response => {
                    if(response.data.success) {
                        setLikes(Likes - 1)
                        setLikeActon(null)
                    }else {
                        alert('실패')
                    }
                })
        } 
    }

    const onDisLike = () => {
        let variable = {}
        if(props.video) {
            variable = {videoId : props.videoId,userId : props.userId}
        }else {
            variable = {commentId : props.commentId,userId : props.userId}
        }

        if(DisLikeActon !== null) {
            Axios.post('/api/like/unDisLike', variable)
                .then(response => {
                    if(response.data.success) {
                       setDisLikes(DisLikes - 1)
                       setDisLikeActon(null)
                    }else {
                        alert('실패')
                    }
                })
        }else {
            Axios.post('/api/like/upDisLike', variable)
            .then(response => {
                if(response.data.success) {
                   setDisLikes(DisLikes + 1)
                   setDisLikeActon('disliked')
                   
                   if(LikeActon != null) {
                    setLikeActon(null)
                    setLikes(Likes - 1)
                }

                }else {
                    alert('실패')
                }
            })
        }
    }

    return (
        <div>
            <span key="comment-basic-like"> 
                <Tooltip title="Like">
                    <Icon 
                        type="like"
                        theme={LikeActon === 'liked' ? 'filled':'outlined'}
                        onClick={onLike}
                    />
                </Tooltip>
            </span>
            <span style={{ paddingLeft : '8px', cursor :'auto'}}> {Likes}</span>&nbsp;&nbsp;
            <span key="comment-basic-dislike"> 
                <Tooltip title="DisLike">
                    <Icon 
                        type="dislike"
                        theme={DisLikeActon === 'disliked' ? 'filled':'outlined'}
                        onClick={onDisLike}
                    />
                </Tooltip>
            </span>
            <span style={{ paddingLeft : '8px', cursor :'auto'}}>{DisLikes}</span>&nbsp;&nbsp;
        </div>
    )
}

export default LikeDisLike
